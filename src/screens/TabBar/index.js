import React, { Component } from "react";
import moment from "moment";
import { View, Modal, Dimensions, Platform, AsyncStorage } from "react-native";
import { EventRegister } from "react-native-event-listeners";
import { connect } from "react-redux";
import {
  initUserData,
  checkChallengeDate,
  setJoinedChallenge,
} from "../../actions";
import Orientation from "react-native-orientation-locker";
// import { SafeAreaView } from "react-navigation";
import SafeAreaView from "react-native-safe-area-view";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { chain } from "lodash";
import { CHALLENGE_WORKOUT_DETAILS } from "../../actions/types";

import { skipToNextWeek } from "../../actions";

import {
  getRandomQuote,
  getDaily10,
  getBonusSweats,
  getLSFRollCall,
  getNutritionPlanLink,
  getChallengeBonusText,
  getChallengeBonusButtonText,
  getChallengeBonusPicture,
  getLatestChallenge,
  getChallengeBonusButtonLink,
  getBonusSectionInfo,
  getDaily10Endscreen,
  getJoinedChallenge,
} from "../../DataStore";

import { VideoModalIOS, VideoModalAndroid } from "../VideoModal";
import { Subscriptions, LoadingModal } from "../../components/common";
import { last, isEmpty } from "lodash";
import TabBar from "./TabBar";
import { subscribeUserToEmailList } from "../../utils/";

const { width: height, height: width } = Dimensions.get("screen");
import { flow, sortBy, maxBy } from "lodash/fp";

const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get("window");

import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
  type ProductPurchase,
  type PurchaseError,
} from "react-native-iap";

const IPHONE12_H = 844;
const IPHONE12_Max = 926;
const IPHONE12_Mini = 780;

class TabBarWrapper extends Component {
  constructor(props) {
    super(props);

    this.videoPlayerIOS = null;
    this.videoPlayerAndroid = null;
    this.listener = null;
    this.listener_D10 = undefined;

    this.state = {
      user: null,
      videoUrl: null,
      daily10: null,
      bonusSweats: null,
      lsfRollCall: null,
      latestChallenge: null,
      bonusChallenges: null,
      showPaywallModal: false,
      showLoadingModal: true,
      validPurchase: null,
      quote: null,
      joinedChallenge: false,
      nutritionPlanLink: null,
      challengeBonusText: null,
      challengeBonusButtonText: null,
      challengeBonusPicture: null,
      challengeBonusButtonLink: null,
      daily10Endscreen: null,
      challangeWorkoutDetails: [],
    };
  }

  componentDidMount() {
    Orientation.lockToPortrait();

    this.listener = EventRegister.addEventListener(
      "paywallEvent",
      this._checkSubscriptionLevel
    );

    this.listener_D10 = EventRegister.addEventListener(
      "isD10CompletedForToday",
      async (data) => {
        var challangeWorkoutDetails = this.state.challangeWorkoutDetails;
        challangeWorkoutDetails.push(data);

        await AsyncStorage.setItem(
          "challangeWorkoutDetails",
          JSON.stringify(
            challangeWorkoutDetails[challangeWorkoutDetails.length - 1]
          )
        );
      }
    );

    const t1 = Date.now();
    RNIap.initConnection().then(() => {
      console.log("componentDidMount in TabBar");

      Promise.all([
        this._fetchDaily10(),
        this._fetchBonusSweats(),
        this._fetchRollCall(),
        this._fetchUserData(),
        this._fetchRandomQuote(),
      ]).then(() =>
        console.log(`Total data fetch time: ${Date.now() - t1} ms`)
      );
    });
    // fetch the rest
    this._fetchLinks();
  }

  checkWeek = async () => {
    AsyncStorage.getItem("currentWeek_")
      .then(async (item) => {
        var weekOfYear = this.getWeekOfYear(new Date()).toString();

        if (
          item != undefined &&
          item != null &&
          parseInt(weekOfYear.trim()) != parseInt(item.trim())
        ) {
          this.props.skipToNextWeek();

          // alert("currentWeek_ :" + item + " = " + weekOfYear);
        }

        await AsyncStorage.setItem("currentWeek_", weekOfYear);
      })
      .catch((err) => {
        // alert("currentWeek_ ERR :: " + err.toString());
      });
  };

  getWeekOfYear(d) {
    var target = new Date(d.valueOf());
    var dayNr = (d.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    var jan4 = new Date(target.getFullYear(), 0, 1);
    var dayDiff = (target - jan4) / 86400000;
    var weekNr = 1 + Math.ceil(dayDiff / 7);

    return weekNr;
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener);
    if (this.listener_D10 != undefined) {
      EventRegister.removeEventListener(this.listener_D10);
    }
  }

  render() {
    const {
      videoUrl,
      thumbnailUrl,
      videoName,
      videoDescription,
      quote,
      daily10,
      bonusSweats,
      lsfRollCall,
      nutritionPlanLink,
      challengeBonusText,
      challengeBonusButtonText,
      challengeBonusPicture,
      latestChallenge,
      challengeBonusButtonLink,
      challengeBonusSectionData,
      daily10Endscreen,
      joinedChallenge,
      currentChallengeImage,
    } = this.state;

    const { userData } = this.props;
    const showTabBar = !(
      quote === null ||
      daily10 === null ||
      !userData.initialized
    );
    // const showTabBar = quote !== null;
    var purchasePlatform = null;
    if (userData.purchaseHistory.length > 0) {
      const latestReceipt = flow(
        (a) => Object.values(a),
        sortBy((a) => a.transactionDate),
        last
      )(userData.purchaseHistory || []);

      purchasePlatform = this._getPurchasePlatform(userData.purchaseHistory);
    }
    // console.log("tabbar purchasePlatform : ",purchasePlatform);
    // console.log("tabbar userData.purchaseHistory : ",userData.purchaseHistory);
    // console.log("tabbar userData.weeklyWorkoutSchedule : ",userData.weeklyWorkoutSchedule);
    // console.log("tabbar userData.completedWorkouts : ",userData.completedWorkouts);
    // console.log("tabbar userData.weeklyProgram : ",userData.weeklyProgram);
    const screenProps = {
      userName: userData.userName,
      email: userData.email,
      level: userData.level,
      currentWeek: userData.currentWeek,
      avatar: userData.avatar,
      name: userData.name || "",
      lastname: userData.lastname || "",
      renderVideoModal: this._renderVideoModal,
      openVideoModal: this._playVideo,
      onLogout: this.props.onLogout,
      onDeleteUser: this.props.onDeleteUser,
      goals: userData.goals,
      achievements: userData.achievements,
      measurements: userData.measurements,
      historicalWeight: userData.historicalWeight,
      weeklyProgram: userData.weeklyProgram,
      weeklyWorkoutSchedule: userData.weeklyWorkoutSchedule,
      challangeWorkoutDetails: userData.challangeWorkoutDetails,
      completedWorkouts: userData.completedWorkouts,
      notificationQueue: userData.notificationQueue,
      selfCareLogs: userData.selfCareLogs,
      quote: quote ? quote.quote : "",
      sweatLogs: userData.sweatLogs,
      completedBonusChallenges: userData.completedBonusChallenges,
      daily10: !isEmpty(daily10) ? daily10 : {},
      bonusSweats: !isEmpty(bonusSweats) ? bonusSweats : {},
      lsfRollCall: !isEmpty(lsfRollCall) ? lsfRollCall : {},
      membership: this._getMembershipLevel(),
      closeLoadingModal: this._closeLoadingModal,
      purchaseHistory: userData.purchaseHistory,
      purchasePlatform: purchasePlatform,
      nutritionPlanLink: nutritionPlanLink
        ? nutritionPlanLink
        : "https://lovesweatfitness.com/",
      challengeBonusText: challengeBonusText
        ? challengeBonusText
        : "SWIPE FOR THIS WEEK'S BONUS",
      challengeBonusButtonText: challengeBonusButtonText
        ? challengeBonusButtonText
        : "Start this week's bonus",
      challengeBonusPicture: challengeBonusPicture,
      challengeFlag: latestChallenge ? latestChallenge.challengeFlag : null,
      challengeStartDate: latestChallenge ? latestChallenge.startDate : null,
      challengeEndDate: latestChallenge ? latestChallenge.endDate : null,
      challengeBonusButtonLink: challengeBonusButtonLink
        ? challengeBonusButtonLink
        : "https://lovesweatfitness.com/",
      challengeBonusSectionData: challengeBonusSectionData
        ? challengeBonusSectionData
        : {},
      validPurchase: userData.validPurchase,
      filteredChallengeLogs: userData.filteredChallengeLogs,
      challengeActive: userData.challengeActive,
      daily10Endscreen: daily10Endscreen,
      _fetchDaily10: this._fetchDaily10,
      _fetchBonusSweats: this._fetchBonusSweats,
      _fetchRollCall: this._fetchRollCall,
      joinedChallenge: joinedChallenge,
      latestChallenge: latestChallenge,
      currentChallengeImage: currentChallengeImage,
    };
    var new_bottom = "never";
    if (
      (Platform.OS === "ios" && D_HEIGHT === IPHONE12_H) ||
      D_HEIGHT === IPHONE12_Max ||
      D_HEIGHT === IPHONE12_Mini
    ) {
      new_bottom = "always";
    }
    return (
      <View style={{ width: "100%", height: "100%", backgroundColor: "white" }}>
        <SafeAreaProvider>
          <SafeAreaView
            style={{ flex: 1, backgroundColor: "#fff" }}
            forceInset={{ bottom: new_bottom, top: "never" }}
          >
            <VideoModalAndroid
              videoUrl={videoUrl}
              thumbnailUrl={thumbnailUrl}
              ref={(ref) => (this.videoPlayerAndroid = ref)}
              width={width}
              height={height}
              videoName={videoName}
              videoDescription={videoDescription}
              onVideoEnd={this._onVideoEnd}
            />
            {this._renderPaywallModal()}
            {this._renderLoadingModal()}
            {showTabBar ? <TabBar screenProps={screenProps} /> : null}
          </SafeAreaView>
        </SafeAreaProvider>
      </View>
    );
  }

  _getPurchasePlatform(purchaseHistory) {
    const latestPurchase = chain(purchaseHistory)
      .sortBy((receipt) => {
        return receipt.transactionDate;
      })
      .last()
      .value();
    return !latestPurchase ? null : latestPurchase.platform;
  }
  _renderPaywallModal() {
    const { showPaywallModal } = this.state;
    const { userData } = this.props;
    var purchasePlatform = null;
    if (userData.purchaseHistory.length > 0) {
      const latestReceipt = flow(
        (a) => Object.values(a),
        sortBy((a) => a.transactionDate),
        last
      )(userData.purchaseHistory || []);
      purchasePlatform = this._getPurchasePlatform(userData.purchaseHistory);
    }
    const screenProps = {
      purchaseHistory: userData.purchaseHistory,
      purchasePlatform: purchasePlatform,
    };
    return (
      <Modal
        onRequestClose={() => ""}
        visible={showPaywallModal}
        animationType="slide"
      >
        <Subscriptions
          screenProps={screenProps}
          onClose={() => this.setState({ showPaywallModal: false })}
        />
      </Modal>
    );
  }

  _renderLoadingModal() {
    const { showLoadingModal } = this.state;
    return <LoadingModal visible={showLoadingModal} />;
  }

  _closeLoadingModal = () =>
    this.setState({ showLoadingModal: false }, () => {
      this.checkWeek();
    });

  _renderVideoModal = (
    videoUrl,
    thumbnailUrl,
    videoName,
    videoDescription,
    duration
  ) => {
    console.log("_renderVideoModal in TabBar index");
    console.log("duration");
    console.log(duration);

    if (Platform.OS === "ios") {
      return (
        <VideoModalIOS
          ref={(ref) => {
            this.videoPlayerIOS = ref;
          }}
          videoUrl={videoUrl}
          thumbnailUrl={thumbnailUrl}
          videoName={videoName}
          videoDescription={videoDescription}
          duration={duration}
        />
      );
    }

    return null;
  };

  _checkSubscriptionLevel = (fn) => {
    const { validPurchase } = this.props.userData;
    if (validPurchase) {
      return fn();
    }

    return this.setState({ showPaywallModal: true });
  };

  _playVideo = (
    videoUrl,
    thumbnailUrl,
    videoName,
    videoDescription,
    duration
  ) => {
    console.log("_playVideo tabbar index");
    console.log(duration);

    if (Platform.OS === "ios" && videoUrl) {
      this.videoPlayerIOS.videoUrl = videoUrl;
      this.videoPlayerIOS.duration = duration;
      this.videoPlayerIOS._playVideo();
    } else if (Platform.OS === "android" && videoUrl) {
      this.setState(
        {
          videoUrl,
          thumbnailUrl,
          videoName,
          videoDescription,
          duration,
        },
        () => this.videoPlayerAndroid._playVideo()
      );
    }
  };

  _onVideoEnd = () => {
    this.setState({
      videoUrl: null,
    });
  };

  _getMembershipLevel() {
    const { validPurchase, purchaseHistory } = this.props.userData;
    if (validPurchase === false) {
      return null;
    }

    const latestPurchase = purchaseHistory.reduce((latest, purchase) => {
      if (
        latest === null ||
        purchase.transactionDate > latest.transactionDate
      ) {
        return purchase;
      }

      return latest;
    }, null);

    const productId = latestPurchase.productId || latestPurchase.productID;

    const levels = {
      ios: {
        "001": "Monthly",
        "002": "3-Month",
        "003": "Yearly",
      },
      android: {
        "01": "Monthly",
        "002": "3-Month",
        "003": "Yearly",
      },
      stripe: {
        "001": "Monthly",
        "002": "3-Month",
        "003": "Yearly",
      },
    };

    return levels[latestPurchase.platform][productId];
  }

  _fetchUserData = () => {
    console.log("_fetchUserData called");
    const t1 = Date.now();
    console.log("t1 : " + t1);
    return this.props.initUserData().then(() => {
      const { userData } = this.props;
      const { validPurchase } = userData;
      console.log("userData.error : " + userData.error);
      console.log(userData);
      if (userData.error) {
        this.setState({ showLoadingModal: false }, this.props.onLogout);
        return;
      }

      // update users subscription for klaviyo email list
      subscribeUserToEmailList(validPurchase);

      // get latest challenge data
      getLatestChallenge().then((latestChallenge) => {
        this.setState({
          latestChallenge: latestChallenge,
          currentChallengeImage: latestChallenge.currentChallengeImage,
        });
        const { challengeFlag } = latestChallenge;

        // set challenge active flag in redux store
        this.props.checkChallengeDate(
          latestChallenge.startDate,
          latestChallenge.endDate,
          latestChallenge.challengeReady
        );

        // get challenge dashboard bonus section data based off of challenge flag i.e. 'sleighChallenge', 'bootyChallenge'
        getBonusSectionInfo(challengeFlag).then((data) => {
          this.setState({ challengeBonusSectionData: data });
        });

        // check to see if they have joined the challenge from based off if they have the challenge flag in their data
        console.log("getJoinedChallenge for challengeFlag");
        console.log(challengeFlag);
        getJoinedChallenge(challengeFlag).then((flag) => {
          console.log("getJoinedChallenge for challengeFlag 1");
          console.log(flag);
          var joinFlag = false;
          if (flag != null) {
            joinFlag = flag;
          }
          console.log("joinFlag : " - joinFlag);
          this.setState({ joinedChallenge: joinFlag });
          console.log("joinFlag set in state");
          // setJoinedChallenge(joinFlag);
        });
      });

      console.log(`*********** User data fetch took ${Date.now() - t1} ms`);
    });
  };
  _fetchRollCall = () => {
    const t1 = Date.now();
    return getLSFRollCall()
      .then((lsfRollCall) => {
        console.log(
          `***********LSF ROLL CALL  fetch took ${Date.now() - t1} ms`
        );
        this.setState({ lsfRollCall });
      })
      .catch((err) => console.log(err.stack));
  };

  _fetchBonusSweats = () => {
    const t1 = Date.now();
    return getBonusSweats()
      .then((bonusSweats) => {
        console.log(`***********BonusSweats fetch took ${Date.now() - t1} ms`);

        this.setState({ bonusSweats });
      })
      .catch((err) => console.log(err.stack));
  };

  _fetchDaily10 = () => {
    const t1 = Date.now();
    return getDaily10()
      .then((daily10) => {
        console.log(`***********Daily10 fetch took ${Date.now() - t1} ms`);
        // alert("Fetched Daily10:\n\n" + JSON.stringify(daily10));
        this.setState({ daily10 });
      })
      .catch((err) => console.log(err.stack));
  };

  _fetchRandomQuote = () => {
    const t1 = Date.now();
    return getRandomQuote()
      .then((quote) => {
        console.log(`***********fetchQuote fetch took ${Date.now() - t1} ms`);
        this.setState({ quote });
      })
      .catch((err) => console.log(err.stack));
  };

  _fetchLinks = () => {
    const t1 = Date.now();
    let links = {};

    getNutritionPlanLink()
      .then((link) => {
        console.log(`***********links fetch took ${Date.now() - t1} ms`);
        this.setState(
          {
            nutritionPlanLink: link,
          },
          () => {
            links = {
              nutritionPlanLink: link,
            };
          }
        );
      })
      .catch((err) => console.log(err.stack));

    getChallengeBonusText()
      .then((text) => {
        this.setState(
          {
            challengeBonusText: text,
          },
          () => {
            links = {
              challengeBonusText: text,
            };
          }
        );
      })
      .catch((err) => console.log(err.stack));

    getChallengeBonusButtonText()
      .then((buttonText) => {
        this.setState(
          {
            challengeBonusButtonText: buttonText,
          },
          () => {
            links = {
              challengeBonusButtonText: buttonText,
            };
          }
        );
      })
      .catch((err) => console.log(err.stack));

    getChallengeBonusPicture()
      .then((link) => {
        this.setState(
          {
            challengeBonusPicture: link,
          },
          () => {
            links = {
              challengeBonusPicture: link,
            };
          }
        );
      })
      .catch((err) => console.log(err.stack));

    getChallengeBonusButtonLink()
      .then((link) => {
        this.setState(
          {
            challengeBonusButtonLink: link,
          },
          () => {
            links = {
              challengeBonusButtonLink: link,
            };
          }
        );
      })
      .catch((err) => console.log(err.stack));

    getDaily10Endscreen()
      .then((link) => {
        this.setState({
          daily10Endscreen: link,
        });
      })
      .catch((err) => console.log("error getting d10 endscreen: ", err));

    return links;
  };

  _emptyUserFailSafe = () => {
    this.props.onLogout();
  };
}

const mapStateToProps = ({ userData }) => {
  return {
    userData,
  };
};

export default connect(mapStateToProps, {
  initUserData,
  checkChallengeDate,
  setJoinedChallenge,
  skipToNextWeek,
})(TabBarWrapper);
