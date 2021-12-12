import React, { Component } from "react";
import {
  InteractionManager,
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  FlatList,
  TextInput,
  Linking,
  Platform,
  Share,
  Alert,
} from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import { WebView } from "react-native-webview";
import { Header } from "react-native-elements";
import moment from "moment";
import Video from "react-native-video";
import {
  LoadingComponent,
  MediumButton,
  GradientHeader,
  HeaderPink,
  ModalOverlayWrapper,
  GoalViewForHeader,
} from "../../components/common";
import {
  logo_white_love_seat_fitness,
  heart_like,
  heart_unlike,
  gear,
  lightning_bolt,
  info_grey,
  challenge_play_rounded,
  day_check_roundec,
  day_uncheck_roundec,
  icon_weekday_star,
  icon_ebook,
  icon_invite,
  icon_share,
  week_back,
  week_next,
  icon_star_gradient,
  cancel_round_cross,
  icon_download,
  icon_shop_now_arrow,
  lsfHighlights,
  getInspired,
  TouchableHighlight,
  be_empowered,
} from "../../images";

import { getBonusChallenges } from "../../DataStore";
import {
  getChallangeKlaviyoIDFromListWithName,
  subscribeUserToChallangeListWithListID,
  flagChallenge,
} from "../../utils";

import {
  ArrowShopNow,
  DownloadButton,
} from "../../components/common/AnimatedComponents";
import InstagramShareModal from "../InstagramShareModal";
import DailySweat from "../Daily10/DailySweat";
import DailySweatCompletion from "../Daily10/DailySweatCompletion";
import { getDaily10 } from "../../DataStore";
import { isEmpty } from "lodash";
import LinearGradient from "react-native-linear-gradient";
import { captureRef } from "react-native-view-shot";
import { SafeAreaView } from "react-navigation";

// components
import { color, colorNew } from "../../modules/styles/theme";
import { endScreens } from "./dynamicEndscreens";
import ChallengeEssentials from "./ChallengeEssentials";
import ChallengeTodaysMove from "./ChallengeTodaysMove";
import WeekViewForChallange from "./WeekViewForChallange";
import InviteFriend from "../InviteFriend";
import HomeHeader from "../Header/HomeHeader";

import closeButton from "./images/iconXPink.png";
import CompletionModal from "../Workouts/CompletionModalStack/Completion";

import ShareNew from "react-native-share";
import RNFS, {
  TemporaryDirectoryPath,
  DocumentDirectoryPath,
} from "react-native-fs";
import firebase from "react-native-firebase";
import { StarBurst } from "../../components/common/AnimatedComponents/StarBurst";
import ChallengeStar from "./ChallengeStar";
import { JoinChallengeButton } from "../../components/common/AnimatedComponents/JoinChallengeButton";

import { EventRegister } from "react-native-event-listeners";

import * as AddCalendarEvent from "react-native-add-calendar-event";

const { height, width } = Dimensions.get("window");

const GEAR_ITEM_WIDTH = Math.round(width * 0.72);
const GEAR_ITEM_HEIGHT = (width * 1.5) / 5;

const BONUS_SWEAT_ITEM_HEIGHT = (width * 1.5) / 4;
const ESSANTIALS_ITEM_HEIGHT = (width * 1.5) / 3;

const SCROLL_OFFSET = 100;

const utcDateToString = (momentInUTC) => {
  let s = moment.utc(momentInUTC).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  // console.warn(s);
  return s;
};

const videoContainerHeight = height * 0.62;
const videoContainerWidth = videoContainerHeight * 0.6;

export default class extends Component {
  constructor(props) {
    super(props);

    this._shareFor = this._shareFor.bind(this);
    const { name, email, joinedChallenge, challangeWorkoutDetails } =
      props.screenProps;

    console.log("challangeWorkoutDetails in ChallangeDashboard constructor");
    console.log("challangeWorkoutDetails");
    console.log(challangeWorkoutDetails);
    this.tabChangeListener = undefined;
    this.listener = undefined;
    this.state = {
      loggedDays: [],
      isTodayLogged: false,
      challangeWorkoutDetails: challangeWorkoutDetails
        ? challangeWorkoutDetails
        : [],
      videoUrl: "",
      shareForSize: "snapshotStory",
      thisWeekData: [
        {
          title: "Hot Body HIIT - Full Body",
          time: "20 min",
          subtitle: "Strenthen, tone, and BURN",
          featureImageUrl: "https://i.imgur.com/MABUbpDl.jpg",
        },
        {
          title: "Earlier this morning, NYC",
          time: "20 min",
          subtitle: "Strenthen, tone, and BURN",
          featureImageUrl: "https://i.imgur.com/KZsmUi2l.jpg",
        },
        {
          title: "White Pocket Sunset",
          time: "20 min",
          subtitle: "Strenthen, tone, and BURN",
          featureImageUrl: "https://i.imgur.com/MABUbpDl.jpg",
        },
        {
          title: "Acrocorinth, Greece",
          time: "20 min",
          subtitle: "Strenthen, tone, and BURN",
          featureImageUrl: "https://i.imgur.com/KZsmUi2l.jpg",
        },
      ],
      weekList: [
        "Week 1",
        "Week 2",
        "Week 3",
        "Week 4",
        "Week 5",
        "Week 6",
        "Week 7",
        "Week 8",
        "Week 9",
      ],
      bonusChallenges: [],
      bonus: [
        {
          thumbnailUrl:
            "https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/featured%20images%2F20minhbhfullbody.jpg?alt=media&token=29a854cf-56f3-40d5-843a-1694206c384d",
          videoName: "Full Body Burn",
          duration: "15 minutes",
          intensity: "Medium Intensity",
        },
        {
          thumbnailUrl:
            "https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/featured%20images%2F20minhittabsarms.jpg?alt=media&token=cbdc0488-3010-4601-9ab8-2a2334476d23",
          videoName: "Hot Body 100",
          duration: "20 minutes",
          intensity: "High Intensity",
        },
        {
          thumbnailUrl:
            "https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/featured%20images%2F10minfinisher.jpg?alt=media&token=6238df3d-4471-481e-8f11-a53971d911e9",
          videoName: "Cardio",
          duration: "10 minutes",
          intensity: "Medium Intensity",
        },
      ],
      challengeVideos: [
        {
          thumbnailUrl:
            "https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/featured%20images%2F20minhbhfullbody.jpg?alt=media&token=29a854cf-56f3-40d5-843a-1694206c384d",
          videoName: "SSD Cardio Dance",
          discription: "High energy dance + workout with audio",
        },
        {
          thumbnailUrl:
            "https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/featured%20images%2F20minhittabsarms.jpg?alt=media&token=cbdc0488-3010-4601-9ab8-2a2334476d23",
          videoName: "SSD Core HIIT",
          discription:
            "Strenthen your core and fallen your belly in 10 minutes",
        },
        {
          thumbnailUrl:
            "https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/featured%20images%2F10minfinisher.jpg?alt=media&token=6238df3d-4471-481e-8f11-a53971d911e9",
          videoName: "SSD Core MIIS",
          discription:
            "Strenthen your core and fallen your belly in 10 minutes",
        },
      ],
      shopList: [],
      challengeEssantials: [
        {
          thumbnailUrl:
            "https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/featured%20images%2F20minhbhfullbody.jpg?alt=media&token=29a854cf-56f3-40d5-843a-1694206c384d",
          name: "7 Day Slim Down",
          price: "$19.99",
        },
        {
          thumbnailUrl:
            "https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/featured%20images%2F20minhittabsarms.jpg?alt=media&token=cbdc0488-3010-4601-9ab8-2a2334476d23",
          name: "Booty Bands",
          price: "$11.99",
        },
        {
          thumbnailUrl:
            "https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/featured%20images%2F10minfinisher.jpg?alt=media&token=6238df3d-4471-481e-8f11-a53971d911e9",
          name: "Cardio",
          price: "$44.99",
        },
      ],
      showChallengeBonusModal: false,
      showCompletionModal: false,
      displayImage: false,
      refresh: false,
      isRegularWorkoutCompletedForToday: false,
      isD10CompletedForToday: false,
      isBonusCompletedForToday: false,
      weekNum: 0,
      displayWeekView: joinedChallenge ? joinedChallenge : false,
      selectedWeekNum: -1,
      emailValue: email,
      nameValue: name,
      shareImage: null,
      showInspoModal: false,
      challengeActive: props.challengeActive ? props.challengeActive : false,
      isChallangeJoined: joinedChallenge ? joinedChallenge : false,
      isChallangeInbetween: false,
      isChallangeDuringVideo: false,
      isChallangeVideoSelected: false,
      isChallangeWorkoutCompleted: false,
      isBonusVideoSelected: false,
      showInfoModal: false,
      showShareModal: false,
      showQuoteModal: false,
      showSweatStarterModal: false,
      showShopItem: false,
      showInviteFriend: false,
      currentShopItem: null,
      remainingDays: 0,
      remainingHours: 0,
      remainingMinutes: 0,
      remainingSeconds: 0,
      showDailySweatModal: false,
      showDailySweatCompletionModal: false,
      totalWeeks: 0,
    };
  }
  componentWillUnmount() {
    console.log("componentWillUnmount");
    if (this.tabChangeListener != undefined) {
      EventRegister.removeEventListener(this.tabChangeListener);
    }
    if (this.listener != undefined) {
      console.log(
        "Vishal - Remove listner if already added => " + this.listener
      );
      EventRegister.removeEventListener(this.listener);
    }
  }
  componentWillReceiveProps(props) {
    // const { challangeWorkoutDetails } = props.screenProps;
    // const { challangeWorkoutDetails} = props.screenProps;
    // console.log(challangeWorkoutDetails);
    // this.setState({
    //     challangeWorkoutDetails
    //   });
    // this.filterWorkoutForSelectedDay(challangeWorkoutDetails);
    // this.refreshView()
  }
  refreshView() {
    const { challangeWorkoutDetails } = this.state;
    this.loggedDays();
    this.filterWorkoutForSelectedDay(challangeWorkoutDetails);
  }
  componentDidUpdate(prevProps) {}
  componentDidMount() {
    this.tabChangeListener = EventRegister.addEventListener(
      "openChallangeDashboard",
      (data) => {
        console.log("Vishal - fire openTab");
        this.props.navigation.goback();
        console.log("Vishal - fire openTab1");
        this.props.navigation.navigate(data);
        console.log("Vishal - fire openTab2");
      }
    );
    this.listener = EventRegister.addEventListener(
      "isD10CompletedForToday",
      (data) => {
        console.log("Vishal - fire isD10CompletedForToday");
        console.log(data);
        var challangeWorkoutDetails = this.state.challangeWorkoutDetails;
        challangeWorkoutDetails.push(data);
        this.setState({
          isD10CompletedForToday: true,
          challangeWorkoutDetails,
        });
        this.refreshView();
        this.filterWorkoutForSelectedDay(challangeWorkoutDetails);
      }
    );
    let handle = InteractionManager.createInteractionHandle();
    this.refreshView();
    this._findCurrentWeekOfChallenge();
    this._fetchBonusChallenges();
    this._retrieveShopItemData();
    this._retrieveIDofKlaviyoChallangeLIst();
    InteractionManager.clearInteractionHandle(handle);

    setTimeout(() => {
      this.checkRemainingTime();
    }, 1000);
  }

  _retrieveIDofKlaviyoChallangeLIst = async () => {
    console.log("_retrieveIDofKlaviyoChallangeLIst called");
    const { challengeName } = this.props.screenProps.latestChallenge;
    console.log("challengeName");
    console.log(challengeName);
    // getChallangeKlaviyoIDFromListWithName('Sleigh 2020 Sign Ups')
    // .then(response => {
    //   console.log("_retrieveIDofKlaviyoChallangeLIst response")
    //   console.log(response)
    //   const space = response.filter(x => x.list_name === challengeName);
    //   console.log("_retrieveIDofKlaviyoChallangeLIst response filtered")
    //   console.log(space);
    // });
  };
  _openDailySweatModal = () => {
    this.setState({
      showDailySweatModal: true,
    });
  };
  _openBonusChallengeModal = () => {
    this.setState({
      showChallengeBonusModal: true,
    });
  };
  _prepDaily10Data() {
    const { daily10 } = this.props.screenProps;
    if (daily10 === null) {
      return {
        move1: null,
        move2: null,
        move3: null,
        move4: null,
      };
    }

    const {
      move1ImageUrl,
      move1Name,
      move1Reps,
      move2ImageUrl,
      move2Name,
      move2Reps,
      move3ImageUrl,
      move3Name,
      move3Reps,
      move4ImageUrl,
      move4Name,
      move4Reps,
      endScreens,
    } = daily10;

    return {
      move1: { imgUrl: move1ImageUrl, name: move1Name, reps: move1Reps },
      move2: { imgUrl: move2ImageUrl, name: move2Name, reps: move2Reps },
      move3: { imgUrl: move3ImageUrl, name: move3Name, reps: move3Reps },
      move4: { imgUrl: move4ImageUrl, name: move4Name, reps: move4Reps },
      endScreen: endScreens,
    };
  }

  _onDaily10Done = () => {
    const createdAt = Date.now();
    const today = new Date(createdAt);
    const name = "d10";
    const { validPurchase } = this.props.screenProps;
    console.log(
      "saveWorkoutForChallenge called in ChallangeDashboard _onDaily10Done"
    );
    this.props.screenProps.saveWorkoutForChallenge({
      createdAt,
      validPurchase,
      name,
    });

    var obj = {
      createdAt: createdAt,
      validPurchase: validPurchase,
      workoutName: name,
    };
    var challangeWorkoutDetails = this.state.challangeWorkoutDetails;
    challangeWorkoutDetails.push(obj);

    this.setState({
      showDailySweatModal: false,
      showDailySweatCompletionModal: true,
      challangeWorkoutDetails,
    });
  };
  _renderDaily10Modals() {
    const { showDailySweatModal, showDailySweatCompletionModal } = this.state;
    const { move1, move2, move3, move4, endScreen } = this._prepDaily10Data();
    const { daily10Endscreen } = this.props.screenProps;
    return (
      <View>
        <DailySweat
          visible={showDailySweatModal}
          onClose={this._closeDailySweatModal}
          move1={move1}
          move2={move2}
          move3={move3}
          move4={move4}
          onWorkoutComplete={this._onDaily10Done}
          animType="none"
        />
        <DailySweatCompletion
          visible={showDailySweatCompletionModal}
          onClose={this._closeDaily10CompletionModal}
          navigation={this.props.navigation}
          endScreen={endScreen ? endScreen : daily10Endscreen}
        />
      </View>
    );
  }
  _closeDailySweatModal = () => {
    console.log("close");
    this.setState({ showDailySweatModal: false });
  };

  _closeDaily10CompletionModal = () => {
    this.setState({
      showDailySweatCompletionModal: false,
    });
  };
  _retrieveShopItemData = async () => {
    let ref = firebase.database().ref("shopItems");
    ref
      .limitToFirst(5)
      .once("value")
      .then((snapshot) => {
        this.setState({
          shopList: snapshot.val(),
        });
      });
  };

  _fetchBonusChallenges() {
    getBonusChallenges().then((bonusChallenges) =>
      this.setState({ bonusChallenges }, () => {
        // console.log("bonusChallenges:- " + JSON.stringify(bonusChallenges));
      })
    );
  }

  getWeekData() {
    const { completedWorkouts, weeklyWorkoutSchedule, challengeActive } =
      this.props.screenProps;
    console.log("getWeekData");
    const { completed } = weeklyWorkoutSchedule;

    let itemWidth = (width * 0.95 - 42) / 2;
    let gridHeight = itemWidth * 1.1 * 2 + 40;
    var weekData = [];
    var length = completedWorkouts ? completedWorkouts.length : 0;
    if (length > 0) {
      for (let [tag, item] of Object.entries(completedWorkouts)) {
        if (
          item.primaryType != "Rest" &&
          this.props.screenProps.currentWeek == item.week
        ) {
          var isObjectContains = false;
          for (const item1 of weekData) {
            if (
              item1.week == item.week &&
              item1.day == item.day &&
              this.props.screenProps.currentWeek == item.week
            ) {
              isObjectContains = true;
              break;
            }
          }
          if (isObjectContains == false) {
            console.log(item);
            var day = new Date(item.createdAt);
            console.log(day.getDay());
            console.log(item.day);
            if (
              day != "Invalid Date" &&
              this.props.screenProps.currentWeek == item.week
            ) {
              console.log(day);
              weekData.push({ ...item, isCompleted: true });
            } else {
              weekData.push({ ...item, isCompleted: false });
            }
          }
        }
      }
    }
    length = completed ? completed.length : 0;
    if (length > 0) {
      for (let [tag, item] of Object.entries(completed)) {
        if (
          item.primaryType != "Rest" &&
          this.props.screenProps.currentWeek == item.week
        ) {
          var isObjectContains = false;
          for (const item1 of weekData) {
            if (
              item1.week == item.week &&
              item1.day == item.day &&
              this.props.screenProps.currentWeek == item.week
            ) {
              isObjectContains = true;
              break;
            }
          }
          if (isObjectContains == false) {
            console.log(item);
            var day = new Date(item.createdAt);
            console.log(day.getDay());
            console.log(item.day);

            if (
              day != "Invalid Date" &&
              this.props.screenProps.currentWeek == item.week
            ) {
              weekData.push({ ...item, isCompleted: true });
            } else {
              weekData.push({ ...item, isCompleted: false });
            }
          }
        }
      }
    }
    if (weeklyWorkoutSchedule.today) {
      const { today } = weeklyWorkoutSchedule;
      var isObjectContains = false;
      for (const item1 of weekData) {
        if (item1.week == today.week && item1.day == today.day) {
          isObjectContains = true;
          break;
        }
      }
      if (today.primaryType != "Rest") {
        if (isObjectContains == false) {
          weekData.push(today);
        }
      }
    }
    if (weeklyWorkoutSchedule.upcomming) {
      for (let [tag, item] of Object.entries(weeklyWorkoutSchedule.upcomming)) {
        if (item.primaryType != "Rest") {
          var isObjectContains = false;
          for (const item1 of weekData) {
            if (item1.week == item.week && item1.day == item.day) {
              isObjectContains = true;
              break;
            }
          }
          if (isObjectContains == false) {
            weekData.push(item);
          }
        }
      }
    }
    weekData.sort(function (a, b) {
      return a.day > b.day;
    });
    var weekDataLatest = [];
    var weekDataCompleted = [];
    var isPreviousWorkoutCompleted = false;
    for (let [tag, item] of Object.entries(weekData)) {
      var moveToLast =
        moment(Date.now())
          .startOf("day")
          .diff(moment(item.createdAt).startOf("day"), "days") >= 1;
      if (isPreviousWorkoutCompleted) {
        if (item.isCompleted != undefined && item.isCompleted && moveToLast) {
          weekDataCompleted.push({ ...item, isPreviousWorkoutCompleted: true });
        } else {
          weekDataLatest.push({ ...item, isPreviousWorkoutCompleted: true });
        }
      } else {
        if (item.isCompleted != undefined && item.isCompleted && moveToLast) {
          weekDataCompleted.push({
            ...item,
            isPreviousWorkoutCompleted: false,
          });
        } else {
          weekDataLatest.push({ ...item, isPreviousWorkoutCompleted: false });
        }
      }
      if (item.isCompleted) {
        isPreviousWorkoutCompleted = true;
      } else {
        isPreviousWorkoutCompleted = false;
      }
    }
    return weekDataLatest.concat(weekDataCompleted);
  }
  filterWorkoutForSelectedDay(challangeWorkoutDetails) {
    console.log("filterWorkoutForSelectedDay called");
    console.log(challangeWorkoutDetails);
    var todaysWorkout = [];
    var isRegularWorkoutCompletedForToday = false;
    var isD10CompletedForToday = false;
    var isBonusCompletedForToday = false;
    var isChallangeWorkoutCompleted = false;

    if (challangeWorkoutDetails != null) {
      console.log("filterWorkoutForSelectedDay called 1");
      challangeWorkoutDetails.map((obj) => {
        console.log("filterWorkoutForSelectedDay called 2");
        console.log("challangeWorkoutDetails : " + obj);
        let dateFormat = "YYYY-MM-DD";
        let createdDate = moment(obj.createdAt).format(dateFormat);
        let today = moment(new Date()).format(dateFormat);
        console.log("compare date for Object");
        console.log(createdDate);
        console.log(today);
        if (createdDate === today) {
          console.log("filterWorkoutForSelectedDay check 1 true for date");
        } else {
          console.log("filterWorkoutForSelectedDay check 1 false for date");
        }
        if (createdDate === today) {
          console.log("filterWorkoutForSelectedDay check 1 true");
          todaysWorkout.push(obj);
          isChallangeWorkoutCompleted = true;
          if (obj.workoutName == "regular") {
            isRegularWorkoutCompletedForToday = true;
          } else if (obj.workoutName == "d10") {
            isD10CompletedForToday = true;
          } else if (obj.workoutName == "bonus") {
            isBonusCompletedForToday = true;
          }
          console.log(
            "isRegularWorkoutCompletedForToday : " +
              isRegularWorkoutCompletedForToday
          );
          console.log("isD10CompletedForToday : " + isD10CompletedForToday);
          console.log("isBonusCompletedForToday : " + isBonusCompletedForToday);
        } else {
          console.log("filterWorkoutForSelectedDay check 2 false");
        }
      });

      this.setState({
        challangeWorkoutDetails: todaysWorkout,
        isChallangeWorkoutCompleted,
        isRegularWorkoutCompletedForToday,
        isD10CompletedForToday,
        isBonusCompletedForToday,
      });
    }
  }
  loggedDays() {
    var day;
    var dates = [];

    const { lotsOfLoveChallenges, challengeFlag, springSlimDownChallenges } =
      this.props.screenProps;

    if (springSlimDownChallenges != null) {
      springSlimDownChallenges.map((obj) => {
        day = new Date(obj.createdAt);

        if (moment(day).isSame(new Date(), "isoWeek")) {
          dates.push(day.getDay());
        }
      });
      console.log("loggedDays");
      console.log(dates);

      const createdAt = Date.now();
      const today = new Date(createdAt);
      var isTodayLogged = false;
      if (
        dates.includes(today.getDay()) ||
        this.state.loggedDays.includes(today.getDay())
      ) {
        isTodayLogged = true;
      }

      this.setState({
        isTodayLogged,
        loggedDays: [...this.state.loggedDays, ...dates],
      });
    }
  }
  _closeInviteFriendModal = () => {
    console.log("_closeshowInviteFriendModal");
    this.setState({ showInviteFriend: false });
  };
  _renderInviteFriend() {
    const { showInviteFriend } = this.state;
    return (
      <View>
        <InviteFriend
          safeAreaBG={colorNew.mediumPink}
          visible={showInviteFriend}
          onClose={this._closeInviteFriendModal}
        />
      </View>
    );
  }
  _selectShareSize(shareViewRef) {
    console.log("_selectShareSize");
    console.log(shareViewRef);
    this.setState({
      shareForSize: shareViewRef,
    });
  }
  _shareSelectedSize() {
    console.log("_shareSelectedSize");
    var shareViewRef = this.snapshotStory;
    if (this.state.shareForSize == "snapshotSquare") {
      shareViewRef = this.snapshotSquare;
    }
    this._shareFor(shareViewRef, false);
  }
  _shareFor(shareViewRef, openInstaModel) {
    console.log("_share");
    captureRef(shareViewRef, {
      format: "jpg",
      quality: 0.8,
    }).then(
      (uri) =>
        openInstaModel
          ? this.setState({
              showInspoModal: true,
              shareImage: uri,
            })
          : this._share(uri),
      (error) => alert("Oops, snapshot failed", error)
    );
    // this.props.close();
    // this.props.navigation.navigate('Menu');
    // this.props.navigation.navigate('ProgressPhotoBuilder');
  }
  _share(uri) {
    if (Platform.OS === "android") {
      RNFS.readFile(uri, "base64").then((res) => {
        let shareOptionsUrl = {
          title: "LSF",
          message: "LSF",
          url: `data:image/jpeg;base64,${res}`, // use image/jpeg instead of image/jpg
          subject: "LSF",
          social: ShareNew.Social.INSTAGRAM,
        };
        ShareNew.shareSingle(shareOptionsUrl)
          .then((res) => {
            console.log(res);
            this.props.close();
          })
          .catch((err) => {
            err && console.log(err);
          });
      });
    } else {
      CameraRoll.save(uri, "photo").then(() => {
        Linking.openURL(
          "instagram://library?OpenInEditor=1&LocalIdentifier=" + uri
        );
      });
    }
  }
  // _share(uri) {
  //   RNFS.readFile(uri, "base64").then((res) => {
  //     let shareOptionsUrl = {
  //       title: "LSF",
  //       message: "LSF",
  //       url: `data:image/jpeg;base64,${res}`, // use image/jpeg instead of image/jpg
  //       subject: "LSF",
  //     };
  //     ShareNew.open(shareOptionsUrl)
  //       .then((res) => {
  //         console.log(res);
  //         this.props.close();
  //       })
  //       .catch((err) => {
  //         err && console.log(err);
  //       });
  //   });
  // }

  render() {
    // console.log("this.props.screenProps.latestChallenge : ");
    const { weeklyWorkoutSchedule, joinedChallenge } = this.props.screenProps;
    console.log("joinedChallenge : " + joinedChallenge);
    const {
      videoUrl,
      thumbnailUrl,
      videoName,
      videoDescription,
      isRegularWorkoutCompletedForToday,
      isD10CompletedForToday,
      isBonusCompletedForToday,
      challangeWorkoutDetails,
    } = this.state;

    // alert(
    //   "challangeWorkoutDetails: " + JSON.stringify(challangeWorkoutDetails)
    // );

    const { screenProps } = this.props;
    const colors = [colorNew.gradientsPinkStart, colorNew.gradientsPinkEnd];
    if (weeklyWorkoutSchedule && weeklyWorkoutSchedule.today) {
      const { today } = weeklyWorkoutSchedule;
      var safeAreaColor = colorNew.white;
      var topMargin = 0;
      var renderChallange = !joinedChallenge;
      var renderVideo = false;
      if (
        this.state.isChallangeInbetween ||
        this.state.isChallangeDuringVideo
      ) {
        safeAreaColor = colorNew.darkPink;
        topMargin = SCROLL_OFFSET;
        renderChallange = false;
        renderVideo = true;
      } else if (this.state.isChallangeWorkoutCompleted) {
        safeAreaColor = colorNew.darkPink;
        topMargin = SCROLL_OFFSET;
        renderChallange = false;
        renderVideo = true;
      }
      if (renderChallange) {
        safeAreaColor = colorNew.white;
      } else {
        renderVideo = true;
      }
      return (
        <SafeAreaView
          style={{ flex: 1, backgroundColor: safeAreaColor }}
          forceInset={{ top: "never", bottom: "never" }}
        >
          <View style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView contentContainerStyle={{ marginTop: topMargin }}>
              {this.renderBanner()}
              {this._renderWeeks()}
              {this._renderWeekView()}
              <View
                style={{
                  width: "90%",
                  height: 1,
                  backgroundColor: "#ddd",
                  marginLeft: "5%",
                  marginTop: 20,
                }}
              />
              {renderChallange ? this.renderChallangeView() : null}
              {renderVideo ? this.renderVideoView() : null}
              <View
                style={{
                  width: "90%",
                  height: 1,
                  backgroundColor: "#ddd",
                  marginLeft: "5%",
                  marginTop: 20,
                }}
              />
              {isRegularWorkoutCompletedForToday == false
                ? this.renderDailyMotivationView()
                : null}
              {isRegularWorkoutCompletedForToday == false
                ? this.renderDailyMotivationButtonView()
                : null}
              {isRegularWorkoutCompletedForToday == false ? (
                <View
                  style={{
                    width: "90%",
                    height: 1,
                    backgroundColor: "#ddd",
                    marginLeft: "5%",
                    marginTop: 20,
                  }}
                />
              ) : null}
              {this._renderBonusSweatsView()}
              {this.state.isChallangeInbetween
                ? null
                : this._renderChallengeEssantials()}
              {this.renderHeader()}
            </ScrollView>
            {this.renderGradientHeader()}
            {this.renderGoalView()}
            {this._renderChallengeBonusModal()}
            {this._renderCompletionModal()}
            {this._renderInfoModal()}
            {this._renderShareModal()}
            {this._renderQuoteModal()}
            {this._renderSweatStarterModal()}
            {this._renderShopItemModal()}
          </View>
          {this._renderInviteFriend()}
          {this._renderDaily10Modals()}
          {screenProps.renderVideoModal(
            videoUrl,
            thumbnailUrl,
            videoName,
            videoDescription
          )}
          <InstagramShareModal
            shareImage={this.state.shareImage}
            visible={this.state.showInspoModal}
            quote={this.state.quote}
            onClose={() => this._closeInspoModal()}
            onPostSuccessful={() => console.log("post successful")}
          />
        </SafeAreaView>
      );
    }

    return (
      <View
        style={{
          width,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoadingComponent />
      </View>
    );
  }
  getSelfcareWorkoutForCurrentWeek() {
    const { weeklyWorkoutSchedule, completedWorkouts } = this.props.screenProps;
    var workout = null;
    if (weeklyWorkoutSchedule.today) {
      const { today } = weeklyWorkoutSchedule;
      if (today.primaryType == "Rest") {
        workout = today;
      }
    }
    if (weeklyWorkoutSchedule.upcomming) {
      for (let [tag, item] of Object.entries(weeklyWorkoutSchedule.upcomming)) {
        if (item.primaryType == "Rest") {
          workout = item;
        }
      }
    }
    return workout;
  }
  checkIfSelfCareCompletedOrNot() {
    const { level, currentWeek, completedWorkouts, weeklyWorkoutSchedule } =
      this.props.screenProps;
    const { completed } = weeklyWorkoutSchedule;
    var isSelfCareCompleted = false;

    for (let [tag, item] of Object.entries(completedWorkouts)) {
      var day = new Date(item.createdAt);
      if (
        item.primaryType == "Rest" &&
        item.week == this.props.screenProps.currentWeek &&
        day != "Invalid Date" &&
        day.getDay() == item.day
      ) {
        isSelfCareCompleted = true;
      }
    }
    for (let [tag, item] of Object.entries(completed)) {
      var day = new Date(item.createdAt);
      if (
        item.primaryType == "Rest" &&
        item.week == this.props.screenProps.currentWeek &&
        day != "Invalid Date" &&
        day.getDay() == item.day
      ) {
        isSelfCareCompleted = true;
      }
    }
    return isSelfCareCompleted;
  }
  renderGoalView() {
    const { showGoalView } = this.state;
    if (showGoalView) {
      let weekData = this.getWeekData();
      var workout = this.getSelfcareWorkoutForCurrentWeek();
      weekData.push(workout);
      var isSelfCareCompleted = this.checkIfSelfCareCompletedOrNot();
      return (
        <View
          style={{
            overflow: "hidden",
            width: "100%",
            flex: 1,
            marginTop: 90,
            position: "absolute",
            paddingBottom: 15,
          }}
        >
          <View
            style={[
              this.shadowBottom(5),
              {
                width: "100%",
                backgroundColor: colorNew.lightPink,
                justifyContent: "flex-end",
              },
            ]}
          >
            <GoalViewForHeader
              {...this.props}
              completed={weekData}
              isSelfCareCompleted={isSelfCareCompleted}
            />
          </View>
        </View>
      );
    } else {
      return null;
    }
  }
  _startWorkout = (workout, screenAfterWorkout) => {
    if (workout == undefined || workout == null) {
      return Alert.alert(
        "Trouble Loading Your Workout",
        "Please re-load your app."
      );
    }

    const { primaryType: primaryType, secondaryType: secondaryType } = workout;

    if (primaryType === "Rest") {
      console.log("self love!");
      return this._openSelfcareModal(workout);
    }

    screenAfterWorkout =
      screenAfterWorkout != undefined ? "ChallangeNavigator" : "Today";

    let screen;
    const { featuredImageLink } = this.props.screenProps.latestChallenge;

    if (isComboDetailWorkout(primaryType, secondaryType)) {
      screen = "ComboDetail";
    } else if (isCircuitOnlyWorkout(primaryType, secondaryType)) {
      screen = "CircuitOnlyDetails";
    } else {
      screen = "CardioDetail";
    }
    console.log("\n\n\n");
    console.log("========== screen redriect 1 ==========");
    console.log(screen);
    console.log("===========\n");
    console.log(workout);
    const passedProps = {
      workout: { ...workout, isFromChallangeDashboard: true },
      openVideoModal: this.props.screenProps.openVideoModal,
      renderVideoModal: this.props.screenProps.renderVideoModal,
      navigationFunctions: {
        navigateToMenuTab: this._navigateToMenuTab,
      },
      screenAfterWorkout: screenAfterWorkout,
    };
    this.props.navigation.navigate(screen, passedProps);
    setTimeout(() => {
      this.setState({
        isChallangeWorkoutCompleted: true,
        isChallangeDuringVideo: false,
      });
    }, 150);
  };

  _checkVideoPaywall = (item) => {
    console.log("_checkVideoPaywall called");
    console.log(item);
    // const {
    //   challengeBonusText,
    //   challengeBonusButtonText,
    //   challengeBonusPicture,
    //   challengeBonusSectionData
    // } = this.props.screenProps;
    // console.log("challengeBonusSectionData")
    // console.log(challengeBonusSectionData)

    console.log("challengeBonusSectionData 1");

    const { exercisesInCircuit, title } = item;
    const tags = exercisesInCircuit.split(",").map((e) => parseInt(e));
    const passedProps = {
      ...item,
      tags,
    };

    this.props.navigation.navigate("BonusChallenge", passedProps);

    // if (item.isFree) {
    // return this._showVideoFullScreen(challengeBonusSectionData.exerciseVideo)();
    // } else {
    //   return EventRegister.emit("paywallEvent", this._showVideoFullScreen(item.videoUrl));
    // }
  };

  _showVideoFullScreen = (videoUrl) => () => {
    const { screenProps } = this.props;
    this.setState(
      {
        videoUrl,
      },
      () => screenProps.openVideoModal(videoUrl)
    );
  };
  _closeInspoModal() {
    this.setState({
      showInspoModal: false,
    });
  }
  hideShopItemModal() {
    console.log("hideSweatStarterModal");
    this.setState({
      showShopItem: false,
    });
  }
  _renderShopItemModal() {
    const { showShopItem, currentShopItem } = this.state;
    const containerWidth = width * 0.75;
    const innerContainerWidth = containerWidth;
    const colors = [colorNew.darkPink, colorNew.lightPink];
    if (!this.state.showShopItem) return null;

    let uri;

    if (currentShopItem != undefined && currentShopItem != null) {
      uri = { uri: currentShopItem.imgUrl };
    } else {
      uri = { uri: null };
    }
    return (
      <View
        style={{
          ...styles.modalContainer,
          position: "absolute",
          marginTop: -20,
          overflow: "hidden",
        }}
      >
        <View style={{ ...styles.window, overflow: "hidden" }}>
          <View
            style={{
              ...styles.dialogue,
              height: 510,
              overflow: "hidden",
              borderRadius: 10,
              width: "75%",
            }}
          >
            <View
              style={{
                width: innerContainerWidth,
                height: innerContainerWidth,
                marginTop: 0,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: color.lightGrey,
                overflow: "hidden",
              }}
            >
              <ImageBackground
                imageStyle={{ resizeMode: "cover" }}
                style={{
                  width: innerContainerWidth,
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 0,
                }}
                source={uri}
              ></ImageBackground>
            </View>
            <Text
              allowFontScaling={false}
              style={{
                ...styles.modalHeaderText,
                color: "#000",
                fontWeight: "bold",
                marginTop: 20,
                marginBottom: 0,
                fontSize: 25,
                lineHeight: 30,
                height: 30,
                marginRight: 10,
                marginLeft: 10,
              }}
            >
              {currentShopItem.title}
            </Text>
            <Text
              numberOfLines={3}
              allowFontScaling={false}
              style={{
                ...styles.shopItemHeaderText,
                color: "#b2b2b2",
                fontWeight: "normal",
                marginTop: 20,
                marginBottom: 5,
                fontSize: 10,
                lineHeight: 18,
                marginRight: 10,
                marginLeft: 10,
              }}
            >
              {currentShopItem.description}
            </Text>
            <View
              style={{
                width: containerWidth,
                height: 40,
                marginLeft: 15,
                marginTop: 0,
                justifyContent: "center",
                alignItems: "flex-start",
                position: "absolute",
              }}
            >
              <View
                style={{
                  width: "100%",
                  marginRight: 16,
                  flex: 1,
                  top: 0,
                  marginBottom: 0,
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 35,
                    height: 35,
                    marginRight: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => this.hideShopItemModal()}
                >
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      top: 0,
                      resizeMode: "contain",
                      marginBottom: 0,
                      tintColor: "#000",
                    }}
                    source={cancel_round_cross}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                width: "85%",
                height: 45,
                marginTop: 30,
                marginBottom: 10,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 0,
                backgroundColor: colorNew.mediumPink,
                borderColor: colorNew.mediumPink,
                borderRadius: 30,
              }}
            >
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={colors}
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 30,
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => Linking.openURL(currentShopItem.shopItemUrl)}
                >
                  <Text
                    allowFontScaling={false}
                    style={{
                      ...styles.modelButtonText,
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "#fff",
                      marginTop: 10,
                      height: 30,
                      marginRight: 5,
                      marginLeft: 10,
                    }}
                  >
                    Shop now
                  </Text>
                  <View
                    style={{
                      width: 50,
                      height: 45,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ArrowShopNow
                      animatedView={{
                        width: 50,
                        height: 45,
                        top: 0,
                        margin: 0,
                      }}
                    />
                    {/*<Image style={{width: 12,height:11,resizeMode: 'contain'}} source={icon_shop_now_arrow} />*/}
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>
      </View>
    );
  }
  showSweatStarterModal() {
    console.log("showInfo");
    this.setState({
      showSweatStarterModal: true,
    });
  }
  hideSweatStarterModal() {
    console.log("hideInfo");
    this.setState({
      showSweatStarterModal: false,
    });
  }
  _renderSweatStarterModal() {
    const { showSweatStarterModal } = this.state;
    const { ebookImage, ebookPDF } = this.props.screenProps.latestChallenge;
    // if (ebookImage != undefined) {
    uri = { uri: ebookImage };
    // } else {
    //   uri = require('./images/Pic_1.png')
    // }
    const containerWidth = width * 0.9 * 0.95;
    const innerContainerWidth = containerWidth * 0.9;
    const colors = [colorNew.darkPink, colorNew.lightPink];
    if (!this.state.showSweatStarterModal) return null;
    return (
      <View
        style={{
          ...styles.modalContainer,
          position: "absolute",
          marginTop: -20,
          overflow: "hidden",
        }}
      >
        <View style={{ ...styles.window, overflow: "hidden" }}>
          <View style={{ ...styles.dialogue, height: 475, overflow: "hidden" }}>
            <View
              style={{
                width: containerWidth,
                height: containerWidth * 1.1,
                flexDirection: "row",
                marginTop: 10,
                justifyContent: "space-around",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: 20,
              }}
            >
              <View
                style={{
                  width: innerContainerWidth,
                  height: innerContainerWidth,
                  marginTop: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    marginTop: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    ref={(snapshot) => (this.snapshotStory = snapshot)}
                    style={{
                      width: "92%",
                      height: "100%",
                      marginTop: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: innerContainerWidth * 0.5,
                        height: innerContainerWidth * 0.65,
                        marginTop: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#b2b2b2",
                        borderRadius: 20,
                        overflow: "hidden",
                      }}
                    >
                      <ImageBackground
                        imageStyle={{ resizeMode: "contain" }}
                        style={{
                          width: innerContainerWidth * 0.5,
                          height: "100%",
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: 0,
                        }}
                        source={uri}
                      ></ImageBackground>
                    </View>
                    <Text
                      allowFontScaling={false}
                      style={{
                        ...styles.modalHeaderText,
                        color: "#000",
                        fontWeight: "normal",
                        marginTop: 20,
                        marginBottom: 0,
                        fontSize: 13,
                        lineHeight: 18,
                        height: 20,
                        marginRight: 10,
                        marginLeft: 10,
                      }}
                    >
                      Download your Sweat Starter
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{
                        ...styles.modalHeaderText,
                        color: "#000",
                        fontWeight: "normal",
                        marginTop: 0,
                        marginBottom: 0,
                        fontSize: 13,
                        lineHeight: 18,
                        height: 20,
                        marginRight: 10,
                        marginLeft: 10,
                      }}
                    >
                      and access everything you need
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{
                        ...styles.modalHeaderText,
                        color: "#000",
                        fontWeight: "normal",
                        marginTop: 0,
                        marginBottom: 0,
                        fontSize: 13,
                        lineHeight: 18,
                        height: 20,
                        marginRight: 10,
                        marginLeft: 10,
                      }}
                    >
                      to rock this challenge! Tips,
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{
                        ...styles.modalHeaderText,
                        color: "#000",
                        fontWeight: "normal",
                        marginTop: 0,
                        marginBottom: 0,
                        fontSize: 13,
                        lineHeight: 18,
                        height: 20,
                        marginRight: 10,
                        marginLeft: 10,
                      }}
                    >
                      recipes, checklists, and more!
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  width: "90%",
                  marginRight: 30,
                  marginLeft: "85%",
                  flex: 1,
                  top: 20,
                  marginBottom: 0,
                  position: "absolute",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{ width: "90%", height: 20 }}
                  onPress={() => this.hideSweatStarterModal()}
                >
                  <Image
                    style={{
                      width: "90%",
                      height: 20,
                      top: 0,
                      resizeMode: "contain",
                      marginBottom: 0,
                      tintColor: "#b2b2b2",
                    }}
                    source={cancel_round_cross}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                width: "85%",
                height: 55,
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                backgroundColor: colorNew.mediumPink,
                borderColor: colorNew.mediumPink,
                borderRadius: 30,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => this.downloadSweatStartClicked()}
              >
                <Text
                  allowFontScaling={false}
                  style={{
                    // ...styles.modalHeaderText,
                    // width: "55%",
                    fontFamily: "SF Pro Text",
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "center",
                    fontSize: 15,
                    fontWeight: "normal",
                    color: "#fff",
                    marginTop: 10,
                    height: 30,
                    marginRight: 0,
                    marginLeft: 10,
                  }}
                >
                  Download Sweat Starter
                </Text>
                <View
                  style={{
                    width: 50,
                    height: 45,
                    marginLeft: -10,
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                  }}
                >
                  <DownloadButton
                    animatedView={{ width: 50, height: 45, top: 0, margin: 0 }}
                  />
                  {/*<Image style={{width: 12,height:11,resizeMode: 'contain'}} source={icon_shop_now_arrow} />*/}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
  _renderQuoteModal() {
    const { showQuoteModal } = this.state;
    const { quote } = this.props.screenProps;
    const containerWidth = width * 0.9 * 0.95;
    const innerContainerWidth = containerWidth * 0.9;
    const colors = [colorNew.darkPink, colorNew.lightPink];
    if (!this.state.showQuoteModal) return null;
    return (
      <View
        style={{
          ...styles.modalContainer,
          position: "absolute",
          marginTop: -20,
          overflow: "hidden",
        }}
      >
        <View style={{ ...styles.window, overflow: "hidden" }}>
          <View style={{ ...styles.dialogue, overflow: "hidden" }}>
            <View
              style={{
                width: containerWidth,
                height: containerWidth,
                flexDirection: "row",
                marginTop: 10,
                justifyContent: "space-around",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: 20,
              }}
            >
              <View
                style={{
                  width: innerContainerWidth,
                  height: innerContainerWidth,
                  marginTop: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    marginTop: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: "92%",
                      height: "92%",
                      marginTop: 30,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <LinearGradient
                      ref={(snapshot) => (this.snapshotQuote = snapshot)}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      colors={colors}
                      style={{
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 20,
                      }}
                    >
                      <Image
                        style={{
                          width: "80%",
                          height: 40,
                          marginTop: 20,
                          resizeMode: "contain",
                          marginBottom: 0,
                        }}
                        source={logo_white_love_seat_fitness}
                      />
                      <ImageBackground
                        imageStyle={{ opacity: 1.0, resizeMode: "contain" }}
                        style={{
                          width: "95%",
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: 10,
                        }}
                        source={icon_star_gradient}
                      >
                        <Text
                          numberOfLines={4}
                          allowFontScaling={false}
                          style={{
                            ...styles.modalHeaderText,
                            color: "#fff",
                            fontWeight: "bold",
                            marginTop: 0,
                            marginBottom: 0,
                            fontSize: 20,
                            lineHeight: 30,
                            height: 30 * 3,
                            marginRight: 10,
                            marginLeft: 10,
                          }}
                        >
                          {quote}
                        </Text>
                      </ImageBackground>
                    </LinearGradient>
                  </View>
                </View>
              </View>
              <View
                style={{
                  width: "90%",
                  marginRight: 30,
                  marginLeft: "85%",
                  flex: 1,
                  top: 20,
                  marginBottom: 0,
                  position: "absolute",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{ width: "90%", height: 20 }}
                  onPress={() => this.hideQuoteModal()}
                >
                  <Image
                    style={{
                      width: "90%",
                      height: 20,
                      top: 0,
                      resizeMode: "contain",
                      marginBottom: 0,
                      tintColor: "#b2b2b2",
                    }}
                    source={cancel_round_cross}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                width: "85%",
                height: 40,
                marginTop: 30,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                backgroundColor: colorNew.mediumPink,
                borderColor: colorNew.mediumPink,
                borderRadius: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => this._shareFor(this.snapshotQuote, false)}
              >
                <Text
                  allowFontScaling={false}
                  style={{
                    ...styles.modalHeaderText,
                    fontWeight: "normal",
                    color: "#fff",
                    marginTop: 0,
                    height: 30,
                    marginRight: 50,
                    marginLeft: 50,
                  }}
                >
                  Share On Social
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
  showQuoteModal() {
    console.log("showInfo");
    this.setState({
      showQuoteModal: true,
    });
  }
  hideQuoteModal() {
    console.log("hideInfo");
    this.setState({
      showQuoteModal: false,
    });
  }
  _renderShareModal() {
    const { showShareModal } = this.state;
    const containerWidth = width * 0.9 * 0.95;
    const innerContainerWidth = containerWidth * 0.45;
    const colors = [colorNew.darkPink, colorNew.lightPink];
    if (!this.state.showShareModal) return null;
    return (
      <View
        style={{
          ...styles.modalContainer,
          position: "absolute",
          marginTop: -20,
          overflow: "hidden",
        }}
      >
        <View style={{ ...styles.window, overflow: "hidden" }}>
          <View style={{ ...styles.dialogue, overflow: "hidden" }}>
            <View
              style={{
                width: containerWidth,
                flex: 0.95,
                flexDirection: "row",
                marginTop: 10,
                justifyContent: "space-around",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: 20,
              }}
            >
              <View
                style={{
                  width: innerContainerWidth,
                  height: "90%",
                  marginTop: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => this._selectShareSize("snapshotStory")}
                >
                  <View
                    style={{
                      width: "100%",
                      height: "85%",
                      marginTop: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      ref={(snapshot) => (this.snapshotStory = snapshot)}
                      style={{
                        width: "100%",
                        height: "75%",
                        marginTop: 10,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        colors={colors}
                        style={{
                          width: "100%",
                          height: "100%",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 20,
                        }}
                      >
                        <ImageBackground
                          imageStyle={{ opacity: 1.0, resizeMode: "contain" }}
                          style={{
                            width: "95%",
                            flex: 1,
                            justifyContent: "space-around",
                            alignItems: "center",
                            marginBottom: 10,
                          }}
                          source={icon_star_gradient}
                        >
                          <Image
                            style={{
                              width: innerContainerWidth * 0.8,
                              height: 40,
                              marginTop: 0,
                              resizeMode: "contain",
                              marginBottom: 0,
                            }}
                            source={logo_white_love_seat_fitness}
                          />
                          <Text
                            numberOfLines={4}
                            adjustsFontSizeToFit
                            allowFontScaling={false}
                            style={{
                              ...styles.modalHeaderText,
                              color: "#fff",
                              fontWeight: "bold",
                              marginTop: 0,
                              marginBottom: 5,
                              fontSize: 20,
                              lineHeight: 30,
                              height: 25 * 5,
                              marginRight: 10,
                              marginLeft: 10,
                            }}
                          >
                            You are{"\n"}exactly{"\n"}where you{"\n"}need to be.
                          </Text>
                        </ImageBackground>
                      </LinearGradient>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    <Text
                      allowFontScaling={false}
                      style={{
                        ...styles.modalHeaderText,
                        fontWeight: "bold",
                        marginTop: 0,
                        marginBottom: 3,
                        fontSize: 12,
                        height: 17,
                        marginRight: 2,
                        marginLeft: 2,
                        color:
                          this.state.shareForSize == "snapshotStory"
                            ? colorNew.textPink
                            : "#b2b2b2",
                      }}
                    >
                      STORY SIZE
                    </Text>
                    {this.state.shareForSize == "snapshotStory" ? (
                      <View
                        style={{
                          height: 1,
                          width: 70,
                          backgroundColor: colorNew.textPink,
                        }}
                      />
                    ) : null}
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: 1,
                  height: "90%",
                  flexDirection: "row",
                  marginTop: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: colorNew.boxGrey,
                }}
              />
              <TouchableOpacity
                onPress={() => this._selectShareSize("snapshotSquare")}
              >
                <View
                  style={{
                    width: innerContainerWidth,
                    height: "90%",
                    marginTop: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 20,
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      height: "85%",
                      marginTop: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      ref={(snapshot) => (this.snapshotSquare = snapshot)}
                      style={{
                        width: innerContainerWidth,
                        height: innerContainerWidth,
                        flexDirection: "row",
                        marginTop: 10,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        colors={colors}
                        style={{
                          width: "100%",
                          height: "100%",
                          justifyContent: "space-around",
                          alignItems: "center",
                          borderRadius: 20,
                        }}
                      >
                        <Image
                          style={{
                            width: "90%",
                            height: 40,
                            marginTop: 0,
                            resizeMode: "contain",
                            marginBottom: 0,
                          }}
                          source={logo_white_love_seat_fitness}
                        />
                        <ImageBackground
                          imageStyle={{ opacity: 1.0, resizeMode: "contain" }}
                          style={{
                            width: "100%",
                            flex: 0.8,
                            justifyContent: "space-around",
                            alignItems: "center",
                            marginBottom: 10,
                          }}
                          source={icon_star_gradient}
                        >
                          <Text
                            numberOfLines={2}
                            allowFontScaling={false}
                            style={{
                              ...styles.modalHeaderText,
                              color: "#fff",
                              fontWeight: "bold",
                              marginTop: 0,
                              marginBottom: 5,
                              fontSize: 11,
                              lineHeight: 20,
                              height: 20 * 2,
                              marginRight: 10,
                              marginLeft: 10,
                            }}
                          >
                            You are exactly{"\n"}where you need to be.
                          </Text>
                        </ImageBackground>
                      </LinearGradient>
                    </View>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      height: "15%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      allowFontScaling={false}
                      style={{
                        ...styles.modalHeaderText,
                        fontWeight: "bold",
                        marginTop: 0,
                        marginBottom: 5,
                        fontSize: 12,
                        height: 17,
                        marginRight: 10,
                        marginLeft: 10,
                        color:
                          this.state.shareForSize == "snapshotSquare"
                            ? colorNew.textPink
                            : "#b2b2b2",
                      }}
                    >
                      SQUARE
                    </Text>
                    {this.state.shareForSize == "snapshotSquare" ? (
                      <View
                        style={{
                          height: 1,
                          width: 50,
                          backgroundColor: colorNew.textPink,
                        }}
                      />
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  width: "90%",
                  marginRight: 30,
                  marginLeft: "70%",
                  flex: 1,
                  top: 20,
                  marginBottom: 0,
                  position: "absolute",
                }}
              >
                <TouchableOpacity onPress={() => this.hideShareModal()}>
                  <Image
                    style={{
                      width: "90%",
                      marginRight: 30,
                      marginLeft: "70%",
                      height: 20,
                      top: 0,
                      resizeMode: "contain",
                      marginBottom: 0,
                      tintColor: "#b2b2b2",
                      position: "absolute",
                    }}
                    source={cancel_round_cross}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                width: "85%",
                height: 40,
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                backgroundColor: colorNew.mediumPink,
                borderColor: colorNew.mediumPink,
                borderRadius: 20,
              }}
            >
              <TouchableOpacity onPress={() => this._shareSelectedSize()}>
                <Text
                  allowFontScaling={false}
                  style={{
                    ...styles.modalHeaderText,
                    fontWeight: "normal",
                    color: "#fff",
                    marginTop: 10,
                    height: 30,
                    marginRight: 50,
                    marginLeft: 50,
                  }}
                >
                  Share On Social
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
  showShareModal() {
    console.log("showInfo");
    this.setState({
      showShareModal: true,
    });
  }
  downloadSweatStartClicked() {
    console.log("hideInfo");

    console.log("latestChallenge");
    const { ebookPDF } = this.props.screenProps.latestChallenge;
    let uri = { uri: ebookPDF };
    // this._sharePDF(uri);
    Linking.openURL(ebookPDF);
    this.setState({
      showSweatStarterModal: false,
    });
  }
  hideShareModal() {
    console.log("hideInfo");
    this.setState({
      showShareModal: false,
    });
  }
  _renderInfoModal() {
    const { showInfoModal } = this.state;
    if (!this.state.showInfoModal) return null;
    return (
      <View
        style={{
          ...styles.modalContainer,
          position: "absolute",
          marginTop: -20,
        }}
      >
        <View style={styles.window}>
          <View style={{ ...styles.dialogue, justifyContent: "center" }}>
            <Text allowFontScaling={false} style={styles.modalHeaderText}>
              HERE'S HOW IT WORKS
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                ...styles.infoMiddleText,
                fontSize: 17,
                fontWeight: "normal",
                marginBottom: 30,
                marginLeft: "5%",
              }}
            >
              To complete and log your challange{"\n"}for the day you must.
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                ...styles.infoMiddleText,
                fontSize: 15,
                fontWeight: "normal",
                marginBottom: 20,
                marginLeft: "5%",
              }}
            >
              1. Complete your Sweat Sesh Workout.
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                ...styles.infoMiddleText,
                fontSize: 15,
                fontWeight: "normal",
                marginBottom: 20,
                marginLeft: "5%",
              }}
            >
              2. Complete your Daily 10 moves.
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                ...styles.infoMiddleText,
                fontSize: 15,
                fontWeight: "normal",
                marginBottom: 20,
                marginLeft: "5%",
              }}
            >
              3. Complete the Bonus Move.
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                ...styles.infoMiddleText,
                fontSize: 15,
                fontWeight: "normal",
                marginBottom: 20,
                marginLeft: "5%",
              }}
            >
              And don't forget to do your LSF Roll Call{"\n"}and check in on
              Instagram!
            </Text>
            <View
              style={{
                height: 40,
                width: "100%",
                marginLeft: "5%",
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: 40,
                  marginRight: 20,
                  marginTop: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colorNew.mediumPink,
                  borderRadius: 20,
                }}
              >
                <TouchableOpacity onPress={() => this.hideInfo()}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      ...styles.modalHeaderText,
                      fontWeight: "normal",
                      marginTop: 0,
                      height: 30,
                      marginRight: 50,
                      marginLeft: 50,
                    }}
                  >
                    Got It
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
  showInfo() {
    console.log("showInfo");
    this.setState({
      showInfoModal: true,
    });
  }
  hideInfo() {
    console.log("hideInfo");
    this.setState({
      showInfoModal: false,
    });
  }
  _weekButtonPressed() {
    console.log("_weekButtonPressed");
  }
  _handleWeekClick() {
    console.log("WeekViewForHeader _handleWeekClick");
  }
  _renderWeeks() {
    const { isChallangeDuringVideo, displayWeekView } = this.state;
    const { weekDayStyle } = styles;
    if (displayWeekView) {
      /*
      return(
          <View style={[{flexDirection:"row",width:"100%",height:60,alignItems:"center",justifyContent:"center"}]}>
            <View style={this.state.isWeekButtonSelected ?[{...styles.navigationButtonBackgroundViewSelected,marginLeft:0,marginBottom:0,justifyContent:"flex-end"}] : [{...styles.navigationButtonBackgroundView,marginLeft:0,marginBottom:10,justifyContent:"flex-end"}]}>
              <TouchableOpacity onPress={this._handleWeekClick.bind(this)}>
              <Image source={week_back} resizeMode="contain" style={{ width: 13, height: 13,marginBottom:9,marginLeft:2}}/>
              </TouchableOpacity>
            </View>
           <View style={[{width:"80%",height:60,marginTop:20,alignItems:"center",justifyContent:"center",backgroundColor:"#b2b2b2",marginRight:10,marginLeft:10}]}>
            <FlatList
              contentContainerStyle={{ paddingLeft: 5}} 
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              ItemSeparatorComponent={() => <View style={{ width: 15, height: "100%", backgroundColor: 'transparent' }} />}
              style={{width: "100%",backgroundColor: "#fff",padding:0}}
              data={this.state.weekList}
              renderItem={this._renderWeekCell}
              keyExtractor={(item, index) => item + index}
            />
          </View>
          <View style={this.state.isWeekButtonSelected ?[{...styles.navigationButtonBackgroundViewSelected,width:40,flex:1,marginLeft:0,marginBottom:0,justifyContent:"flex-end"}] : [{...styles.navigationButtonBackgroundView,marginLeft:0,marginBottom:10,justifyContent:"flex-start"}]}>
            <TouchableOpacity onPress={this._handleWeekClick.bind(this)}>
            <Image source={week_next} resizeMode="contain" style={{ width: 13, height: 13,marginBottom:9,marginLeft:2}}/>
            </TouchableOpacity>
          </View>
          </View>
      )*/
      console.log("renderWeeklyChallengeCount called");
      const { weekNum, totalWeeks } = this.state;

      return (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: 44,
            margin: 10,
          }}
        >
          <Text style={styles.weekText}>WEEK </Text>
          <Text
            style={{
              fontFamily: "SF Pro Text",
              fontSize: 28,
              fontStyle: "normal",
              textAlign: "center",
              color: "#ec568f",
            }}
          >
            {weekNum}
          </Text>
          <Text style={styles.weekText}> OF {totalWeeks}</Text>
        </View>
      );
    }
    return;
    {
      return null;
    }
  }
  _renderWeekCell = ({ item, index }) => {
    // console.log("_renderWeekCell called");
    const newWidth = width * 0.22;
    const { weekDayStyle } = styles;
    console.log("this.state.weekNum - 1");
    console.log(this.state.weekNum - 1);
    let selectedWeek = 0;
    if (this.state.selectedWeekNum == -1) {
      selectedWeek = this.state.weekNum - 1;
    } else {
      selectedWeek = this.state.selectedWeekNum;
    }
    return (
      <View
        style={{
          flex: 1,
          height: 20,
          alignItems: "center",
          justifyContent: "flex-start",
          overflow: "hidden",
        }}
      >
        <TouchableOpacity
          style={{ fleX: 1, justifyContent: "center", alignItems: "center" }}
          onPress={() => this._weekClicked(index, item)}
        >
          <Text
            allowFontScaling={false}
            style={{
              ...weekDayStyle,
              height: "100%",
              fontWeight: "400",
              fontSize: 12,
              lineHeight: 20,
              marginBottom: 0,
              marginTop: 0,
              color:
                index == selectedWeek ? colorNew.mediumPink : colorNew.bgGrey,
            }}
          >
            {item.toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  _weekClicked(index, item) {
    console.log("_weekClicked");
    console.log(index);
    console.log(item);
    this.setState({
      selectedWeekNum: index,
    });
  }
  _renderWeekView() {
    const { isChallangeDuringVideo, isChallangeWorkoutCompleted } = this.state;
    var top_margin = 0;
    if (isChallangeWorkoutCompleted) {
      top_margin = 20;
    }
    if (isChallangeDuringVideo || isChallangeWorkoutCompleted) {
      return (
        <View
          style={[
            {
              width: "100%",
              height: 60,
              marginTop: top_margin,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          {this.renderWeekDayView()}
          {/*<WeekViewForChallange onLeftPress={this._weekButtonPressed.bind(this)}/>*/}
        </View>
      );
    }
    return;
    {
      return null;
    }
  }
  renderWeekDayView() {
    const { weekDayStyle } = styles;
    return (
      <View
        style={{
          width: "90%",
          height: 60,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            height: this.state.isWeekButtonSelected ? 36 : 60,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          {this.renderWeekDayCellView(this.state.loggedDays.includes(1), "M")}
          {this.renderWeekDayCellView(this.state.loggedDays.includes(2), "T")}
          {this.renderWeekDayCellView(this.state.loggedDays.includes(3), "W")}
          {this.renderWeekDayCellView(this.state.loggedDays.includes(4), "T")}
          {this.renderWeekDayCellView(this.state.loggedDays.includes(5), "F")}
          {this.renderWeekDayCellView(this.state.loggedDays.includes(6), "S")}
          {this.renderWeekDayCellView(this.state.loggedDays.includes(0), "S")}
        </View>
      </View>
    );
  }
  renderWeekDayCellView(isSelected, text) {
    const { weekDayStyle } = styles;
    if (this.state.isTodayLogged) {
      return this.renderWeekDayImageViewOnly(isSelected, text);
    } else {
      return this.renderWeekDayImageAndTextView(isSelected, text);
    }
  }
  renderWeekDayImageAndTextView(isSelected, text) {
    const { weekDayStyle } = styles;
    return (
      <View
        style={{
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          width: "14%",
        }}
      >
        <ChallengeStar filled={isSelected} />
        <View
          style={{
            height: 20,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            allowFontScaling={false}
            style={{ ...weekDayStyle, height: "100%", marginBottom: 18 }}
          >
            {text}
          </Text>
        </View>
      </View>
    );
  }
  renderWeekDayImageViewOnly(isSelected, text) {
    const { weekDayStyle } = styles;
    return (
      <View
        style={{
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          width: "14%",
          paddingLeft: 3,
          paddingRight: 3,
        }}
      >
        <ChallengeStar filled={isSelected} />
      </View>
    );
  }
  _renderBonusSweatsHeaderView() {
    const { isChallangeVideoSelected, isBonusVideoSelected } = this.state;

    // -HP- Condition REVERSED
    if (!this.state.isChallangeDuringVideo) {
      return (
        <View
          style={{
            width: "100%",
            flex: 1,
            height: 110,
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Text
            allowFontScaling={false}
            style={{
              ...styles.subTitleNew,
              marginTop: 0,
              marginLeft: "5%",
              color: "#000",
            }}
          >
            You're So Extra
          </Text>
          <View
            style={{
              width: "100%",
              flex: 1,
              height: 50,
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            {/*<TouchableOpacity 
                    style={{ fleX: 1, justifyContent: 'flex-start', alignItems: 'center'}}
                    onPress={() => this._showChallangeVideo()}
                  >
                    <Text allowFontScaling={false} style={{...styles.subTitleNew,fontSize: 16,lineHeight: 30,fontWeight: "700",marginTop: 0,marginLeft:"5%",color:isChallangeVideoSelected ? colorNew.mediumPink : colorNew.borderGrey}}>CHALLENGE VIDEOS</Text>
                    <View style={{marginLeft:"5%",marginTop:0,height:5,backgroundColor:isChallangeVideoSelected ? colorNew.mediumPink : 'transparent',width:"90%"}} />
                  </TouchableOpacity>*/}
            <TouchableOpacity
              style={{
                fleX: 1,
                justifyContent: "flex-end",
                alignItems: "center",
              }}
              onPress={() => this._showBonusVideo()}
            >
              <Text
                allowFontScaling={false}
                style={{
                  ...styles.subTitleNew,
                  fontSize: 16,
                  lineHeight: 30,
                  fontWeight: "700",
                  marginTop: 0,
                  marginLeft: "5%",
                  color: isBonusVideoSelected
                    ? colorNew.mediumPink
                    : colorNew.borderGrey,
                }}
              >
                BONUS SWEATS
              </Text>
              <View
                style={{
                  marginLeft: "5%",
                  marginTop: 0,
                  height: 5,
                  backgroundColor: isBonusVideoSelected
                    ? colorNew.mediumPink
                    : "transparent",
                  width: "90%",
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={{
            width: "100%",
            flex: 1,
            height: 50,
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text
            allowFontScaling={false}
            style={{
              ...styles.subTitleNew,
              marginTop: 0,
              marginLeft: "5%",
              color: "#000",
            }}
          >
            Bonus Sweats
          </Text>
          <TouchableOpacity
            style={{ fleX: 1, justifyContent: "center", alignItems: "center" }}
            onPress={() => this._viewBonusSweats()}
          >
            <Text
              allowFontScaling={false}
              style={{
                ...styles.highlightTextBold,
                fontWeight: "normal",
                fontSize: 11,
                color: "#000",
                marginTop: 15,
                marginLeft: 25,
              }}
            >
              VIEW ALL
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
  _renderBonusSweatsView() {
    const {
      isChallangeDuringVideo,
      isChallangeVideoSelected,
      isBonusVideoSelected,
    } = this.state;
    var data = this.state.bonusChallenges;

    // if (isChallangeDuringVideo && isChallangeVideoSelected) {
    //   data =  this.state.challengeVideos;
    // }
    const newWidth = BONUS_SWEAT_ITEM_HEIGHT * 1.32;
    return (
      <View
        style={{
          width: "100%",
          flex: 1,
          marginTop: 20,
          marginBottom: this.state.isChallangeInbetween ? 120 : 0,
        }}
      >
        {this._renderBonusSweatsHeaderView()}
        <View
          style={[
            this.shadowBottomForGrid(5),
            {
              marginTop: 10,
              flex: 1,
              flexDirection: "column",
              backgroundColor: colorNew.lightPink,
            },
          ]}
        >
          <View
            style={{ flex: 1, width: "100%", marginBottom: 20, marginTop: 30 }}
          >
            <FlatList
              contentContainerStyle={{ paddingLeft: width * 0.05 }}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    width: 20,
                    height: "100%",
                    backgroundColor: "transparent",
                  }}
                />
              )}
              style={{ width: "100%", padding: 0, height: newWidth }}
              data={data}
              renderItem={this._renderBonusSweats}
              keyExtractor={(item, index) => item + index}
            />
          </View>
        </View>
      </View>
    );
  }
  _renderChallengeEssantials() {
    const colors = [colorNew.gradientsPinkStart, colorNew.gradientsPinkEnd];
    var topMargin = 0;
    if (
      this.state.isChallangeInbetween ||
      this.state.isChallangeDuringVideo ||
      this.state.isChallangeWorkoutCompleted
    ) {
      topMargin = SCROLL_OFFSET;
    }
    return (
      <View
        style={{
          width: "100%",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: topMargin,
        }}
      >
        {/* <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={colors}
          style={{
            width: "100%",
            height: 5,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 40,
            marginBottom: 0,
          }}
        ></LinearGradient> */}
        <View
          style={{
            width: "100%",
            flex: 1,
            justifyContent: "center",
            alignItems: "flex-start",
            marginTop: 40,
          }}
        >
          <Text
            allowFontScaling={false}
            style={{
              ...styles.subTitleNew,
              marginLeft: "5%",
              color: "#000",
              marginBottom: 2,
            }}
          >
            Challenge Essentials
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://my.lovesweatfitness.com")}
          >
            <Text
              style={{
                color: "#bdbdbd",
                textAlign: "left",
                fontWeight: "normal",
                fontFamily: "Sofia Pro",
                textDecorationLine: "underline",
                fontSize: 15,
                marginLeft: "5%",
                marginBottom: 20,
              }}
            >
              View the LSF Shop
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "100%",
            height: ESSANTIALS_ITEM_HEIGHT + 70,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 0,
            backgroundColor: "#202020",
            marginBottom: 20,
          }}
        >
          <FlatList
            contentContainerStyle={{ paddingLeft: width * 0.05 }}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  width: 5,
                  height: "100%",
                  backgroundColor: "transparent",
                }}
              />
            )}
            style={{ width: "100%", backgroundColor: "#fff", padding: 0 }}
            data={this.state.shopList}
            renderItem={this._renderEssantiasl}
            keyExtractor={(item, index) => item + index}
          />
        </View>
      </View>
    );
  }
  _renderGearItems = ({ item }) => {
    // console.log("_renderGearItems called");
    return (
      <View
        style={{
          alignItems: "flex-start",
          flexDirection: "column",
          justifyContent: "center",
          width: GEAR_ITEM_HEIGHT,
        }}
      >
        <View
          style={{
            width: GEAR_ITEM_HEIGHT,
            height: GEAR_ITEM_HEIGHT,
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: colorNew.boxGrey,
            borderRadius: 10,
          }}
        ></View>
        <Text
          style={[
            styles.gearTitleText,
            {
              color: "#000",
              fontSize: 10,
              fontWeight: "700",
              textAlign: "left",
              paddingLeft: 5,
            },
          ]}
        >
          {item.toUpperCase()}
        </Text>
      </View>
    );
  };
  _renderBonusSweats = ({ item }) => {
    console.log("_renderBonusSweats called");
    const { isChallangeDuringVideo, isChallangeVideoSelected } = this.state;
    const {
      videoUrl,
      isRegularWorkoutCompletedForToday,
      isD10CompletedForToday,
      isBonusCompletedForToday,
      challangeWorkoutDetails,
    } = this.state;
    // console.log(item)
    if (isChallangeDuringVideo && isChallangeVideoSelected) {
      console.log("_renderBonusSweats called if");
      const newWidth = BONUS_SWEAT_ITEM_HEIGHT * 1.35;
      return (
        <TouchableHighlight
          onPress={() => this._checkVideoPaywall(item)}
          underlayColor={color.lightGrey}
        >
          <View
            style={{
              alignItems: "flex-start",
              flexDirection: "column",
              justifyContent: "center",
              width: newWidth,
              borderWidth: 1,
              borderRadius: 15,
              overflow: "hidden",
              backgroundColor: "#fff",
            }}
          >
            <View
              style={{
                width: newWidth,
                height: newWidth - 30,
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: colorNew.boxGrey,
              }}
            ></View>
            <View
              style={{
                flex: 1,
                width: newWidth,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: newWidth * 0.75,
                  height: 75,
                  alignItems: "center",
                  justifyContent: "flex-start",
                  overflow: "hidden",
                }}
              >
                <Text
                  style={[
                    styles.gearTitleText,
                    {
                      color: "#000",
                      width: "100%",
                      fontSize: 16,
                      fontWeight: "normal",
                      textAlign: "left",
                      paddingLeft: 5,
                      marginBottom: 5,
                      marginTop: 15,
                    },
                  ]}
                >
                  {item.videoName}
                </Text>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.gearTitleText,
                    {
                      color: "#b2b2b2",
                      width: "100%",
                      fontSize: 9,
                      fontWeight: "normal",
                      textAlign: "left",
                      paddingLeft: 5,
                      marginBottom: 10,
                    },
                  ]}
                >
                  {item.discription}
                </Text>
              </View>
              <View
                style={{
                  width: newWidth * 0.25,
                  height: 75,
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                }}
              >
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    marginLeft: 10,
                    marginBottom: 10,
                    marginRight: 10,
                  }}
                  source={challenge_play_rounded}
                />
              </View>
            </View>
          </View>
        </TouchableHighlight>
      );
    } else {
      console.log("_renderBonusSweats called else");
      let uri;
      console.log(item);
      console.log("_renderBonusSweats called else 1");
      console.log("item.featureImageUrl");
      console.log(item.featureImageUrl);
      console.log("item.title");
      console.log(item.title);
      console.log("item.time");
      console.log(item.time);
      console.log("item.description");
      console.log(item.description);
      if (item.featureImageUrl != undefined) {
        uri = { uri: item.featureImageUrl };
      } else {
        uri = { uri: null };
      }
      const newWidth = BONUS_SWEAT_ITEM_HEIGHT * 1.1;
      console.log("_renderBonusSweats called else 2");
      return (
        <View
          style={[
            this.shadowBottomForGrid(5),
            {
              alignItems: "center",
              justifyContent: "center",
              width: newWidth,
              height: BONUS_SWEAT_ITEM_HEIGHT * 1.25,
              borderRadius: 15,
              backgroundColor: "#fff",
            },
          ]}
        >
          <TouchableOpacity
            style={{
              alignItems: "flex-start",
              flexDirection: "column",
              justifyContent: "center",
              width: newWidth,
              borderRadius: 15,
              overflow: "hidden",
            }}
            onPress={() => this._checkVideoPaywall(item)}
          >
            <ImageBackground
              imageStyle={{ resizeMode: "cover" }}
              style={{
                width: newWidth,
                height: BONUS_SWEAT_ITEM_HEIGHT,
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: colorNew.white,
                marginTop: -10,
              }}
              source={uri}
            ></ImageBackground>
            <Text
              style={[
                styles.bonusVideoTitleText,
                {
                  color: "#000",
                  fontSize: 12,
                  fontWeight: "bold",
                  textAlign: "left",
                  paddingLeft: 10,
                  paddingRight: 5,
                  marginBottom: 3,
                  marginTop: 10,
                },
              ]}
            >
              {item.title}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.bonusVideoSubTitleText,
                {
                  color: "#b2b2b2",
                  fontSize: 7,
                  fontWeight: "normal",
                  textAlign: "left",
                  paddingLeft: 10,
                  paddingRight: 5,
                  marginBottom: 10,
                },
              ]}
            >
              {item.time}
              <Text
                style={[
                  styles.gearTitleText,
                  {
                    color: "#b2b2b2",
                    fontSize: 8,
                    fontWeight: "normal",
                    textAlign: "left",
                    paddingLeft: 5,
                    marginBottom: 10,
                  },
                ]}
              >
                {" "}
                | {item.description}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };
  _renderEssantiasl = ({ item }) => {
    return (
      <View
        style={{
          alignItems: "flex-start",
          flexDirection: "column",
          justifyContent: "center",
          width: ESSANTIALS_ITEM_HEIGHT,
          overflow: "hidden",
          flex: 1,
        }}
      >
        <TouchableOpacity
          style={{ fleX: 1, justifyContent: "center", alignItems: "center" }}
          onPress={() => this._essentialClicked(item)}
        >
          <ChallengeEssentials
            data={item}
            onLikeClicked={this._likeButtonClicked}
          />
        </TouchableOpacity>
      </View>
    );
  };
  _essentialClicked(item) {
    console.log("_essentialClicked");
    this.setState({
      showShopItem: true,
      currentShopItem: item,
    });
  }
  _likeButtonClicked() {
    console.log("_likeButtonClicked");
  }
  renderDailyMotivationButtonView() {
    let image_text_color = colorNew.darkPink;
    return (
      <View
        style={{
          width: "100%",
          height: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                fleX: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => this._inviteClicked()}
            >
              <Image
                style={{
                  marginLeft: 10,
                  marginRight: 10,
                  tintColor: image_text_color,
                }}
                source={icon_invite}
              />
              <Text
                allowFontScaling={false}
                style={{
                  ...styles.viewallTextBlack,
                  textAlign: "center",
                  height: 15,
                  marginTop: 2,
                  fontSize: 11,
                  color: image_text_color,
                }}
              >
                INVITE
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <TouchableOpacity
              style={{
                fleX: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => this.showShareModal()}
            >
              <Image
                style={{
                  marginLeft: 10,
                  marginRight: 10,
                  tintColor: image_text_color,
                }}
                source={icon_share}
              />
              <Text
                allowFontScaling={false}
                style={{
                  ...styles.viewallTextBlack,
                  textAlign: "center",
                  height: 15,
                  marginTop: 2,
                  fontSize: 11,
                  color: image_text_color,
                }}
              >
                SHARE
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                fleX: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => this._ebookClicked()}
            >
              <Image
                style={{
                  marginLeft: 10,
                  marginRight: 10,
                  tintColor: image_text_color,
                }}
                source={icon_ebook}
              />
              <Text
                allowFontScaling={false}
                style={{
                  ...styles.viewallTextBlack,
                  textAlign: "center",
                  height: 15,
                  marginTop: 2,
                  fontSize: 11,
                  color: image_text_color,
                }}
              >
                EBOOK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  renderDailyMotivationView() {
    let { lsfRollCall } = this.props.screenProps;
    console.log("renderDailyMotivationView called");
    console.log("lsfRollCall data : " + lsfRollCall);
    let uri;
    console.log("lsfRollCall.mainImage data : " + lsfRollCall.mainImage);
    if (lsfRollCall && lsfRollCall.mainImage != undefined) {
      uri = { uri: lsfRollCall.mainImage };
    } else {
      uri = { uri: null };
    }
    let shareuri;
    if (lsfRollCall && lsfRollCall.shareImage != undefined) {
      shareuri = lsfRollCall.shareImage;
    } else {
      shareuri = null;
    }
    console.log("shareuri :=> " + lsfRollCall.shareImage);

    const colors = [colorNew.gradientsPinkStart, colorNew.gradientsPinkEnd];
    return (
      <View style={[{ flex: 1 }]}>
        <View style={{ width: "100%" }}>
          <View
            style={{ width: "100%", marginLeft: "5%", flexDirection: "row" }}
          >
            <View
              style={{
                width: 150,
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <Text
                allowFontScaling={false}
                style={{ ...styles.headingTextBlackBig, paddingLeft: 0 }}
              >
                Daily
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <Text
                allowFontScaling={false}
                style={{
                  ...styles.viewallTextBlack,
                  fontSize: 11,
                  color: color.darkGrey,
                }}
              >
                GET MOTIVATED WITH #TEAMLSF
              </Text>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              height: height * 0.55,
              marginTop: 20,
              marginBottom: 10,
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                marginTop: 10,
                marginBottom: 10,
                justifyContent: "space-evenly",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <View style={{ flex: 1, marginLeft: 10 }}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      showInspoModal: true,
                      shareImage: shareuri,
                    })
                  }
                >
                  <View
                    style={[
                      this.shadowBottomForGrid(5),
                      {
                        width: "95%",
                        height: "97%",
                        borderRadius: 25,
                        justifyContent: "center",
                        alignItems: "center",
                      },
                    ]}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 25,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        source={uri}
                        resizeMode="cover"
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 25,
                        }}
                      />
                      {/*<LinearGradient
              ref={snapshot => (this.snapshotRollCall = snapshot)}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={colors}
              style={{width:"90%", height:"95%",margin:5,justifyContent:"center",alignItems:"center",backgroundColor:"#bcb",borderRadius:25}}>
                <View style={{width:"95%", height:"30%",marginTop:10,marginBottom:2,justifyContent:"center",alignItems:"center"}}>
                  <Text allowFontScaling={true} style={{...styles.headingTextBlackBig,fontWeight: "600",color:"#fff",fontSize: 17,marginTop: 0,width: "100%",paddingLeft: 0,textAlign: "center"}}>TODAY'S</Text>            
                  <Image source={lsfHighlights} resizeMode="contain" style={{height:25,width:"90%",tintColor:'#fff'}} />
                </View>
                <View style={{width:"90%",height:1,backgroundColor:"#fff",marginLeft:"5%",marginTop:2}}/>
                <View style={{width:"95%", height:"30%",marginTop:10,marginBottom:2,justifyContent:"center",alignItems:"center"}}>
                  <Text allowFontScaling={true} style={{...styles.headingTextBlackBig,fontWeight: "600",color:"#fff",fontSize: 13,height: 19,marginTop: 0,width: "100%",paddingLeft: 0,textAlign: "center"}}>Challenge 3 LSF girls</Text>
                  <Text allowFontScaling={true} style={{...styles.headingTextBlackBig,fontWeight: "600",color:"#fff",fontSize: 13,height: 19,marginTop: 0,width: "100%",paddingLeft: 0,textAlign: "center"}}>to 10 burpees after</Text>
                  <Text allowFontScaling={true} style={{...styles.headingTextBlackBig,fontWeight: "600",color:"#fff",fontSize: 13,height: 19,marginTop: 0,width: "100%",paddingLeft: 0,textAlign: "center"}}>their workout today</Text>
                </View>
                <View style={{width:"90%",height:1,backgroundColor:"#fff",marginLeft:"5%",marginTop:2}}/>
                <View style={{width:"95%", height:"30%",marginTop:10,marginBottom:2,justifyContent:"center",alignItems:"center"}}>
                  <Text allowFontScaling={true} style={{...styles.headingTextBlackBig,color:"#fff",fontSize: 17,marginTop: 0,width: "100%",paddingLeft: 10}}>Get Motivated</Text>
                  <Text numberOfLines={2} allowFontScaling={true} style={{...styles.dailySubtitleText,color:"#fff",marginTop: 0,width: "100%"}}>Today's Roll Call</Text>
                </View>          
              </LinearGradient>*/}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: "45%",
                  height: "95%",
                  marginTop: -6,
                  marginBottom: 0,
                  marginRight: 10,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: "95%",
                    height: "45%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() =>
                    Linking.openURL("https://www.instagram.com/teamlsf")
                  }
                  activeOpacity={1}
                >
                  <View
                    style={[
                      this.shadowBottomForGrid(5),
                      {
                        width: "100%",
                        height: "100%",
                        marginTop: 10,
                        marginBottom: 10,
                        marginRight: "5%",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: colorNew.boxGrey,
                        borderRadius: 25,
                      },
                    ]}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: "100%",
                        justifyContent: "flex-end",
                        alignItems: "flex-start",
                        backgroundColor: colorNew.boxGrey,
                        borderRadius: 25,
                        overflow: "hidden",
                      }}
                    >
                      <ImageBackground
                        style={{
                          width: "100%",
                          height: "100%",
                          marginRight: "5%",
                          justifyContent: "flex-end",
                          alignItems: "flex-start",
                          backgroundColor: colorNew.boxGrey,
                          borderRadius: 25,
                        }}
                        source={getInspired}
                      >
                        <Text
                          allowFontScaling={true}
                          style={{
                            ...styles.headingTextBlackBig,
                            color: "#fff",
                            fontSize: 17,
                            marginTop: 0,
                            width: "100%",
                            paddingLeft: 10,
                          }}
                        >
                          Get Inspired
                        </Text>
                        <Text
                          numberOfLines={2}
                          allowFontScaling={true}
                          style={{
                            ...styles.dailySubtitleText,
                            color: "#fff",
                            marginTop: 0,
                            width: "100%",
                          }}
                        >
                          Interact with #TeamLSF{"\n"}on Instagram
                        </Text>
                      </ImageBackground>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: "95%",
                    height: "45%",
                    marginBottom: 6,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => this.showQuoteModal()}
                >
                  <View
                    style={[
                      this.shadowBottomForGrid(5),
                      {
                        width: "100%",
                        height: "100%",
                        marginTop: 10,
                        marginBottom: 10,
                        marginRight: "5%",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: colorNew.boxGrey,
                        borderRadius: 25,
                      },
                    ]}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: "100%",
                        justifyContent: "flex-end",
                        alignItems: "flex-start",
                        backgroundColor: colorNew.boxGrey,
                        borderRadius: 25,
                        overflow: "hidden",
                      }}
                    >
                      <ImageBackground
                        style={{
                          width: "100%",
                          height: "100%",
                          marginRight: "5%",
                          justifyContent: "flex-end",
                          alignItems: "flex-start",
                          backgroundColor: colorNew.boxGrey,
                          borderRadius: 25,
                        }}
                        source={be_empowered}
                      >
                        <Text
                          allowFontScaling={true}
                          style={{
                            ...styles.headingTextBlackBig,
                            color: "#fff",
                            fontSize: 17,
                            marginTop: 0,
                            width: "100%",
                            paddingLeft: 10,
                          }}
                        >
                          Be Empowered
                        </Text>
                        <Text
                          numberOfLines={2}
                          allowFontScaling={true}
                          style={{
                            ...styles.dailySubtitleText,
                            color: "#fff",
                            marginTop: 0,
                            width: "100%",
                          }}
                        >
                          View and share today's{"\n"}motivational quote
                        </Text>
                      </ImageBackground>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
  _onJoinChallangePressed() {
    console.log("_onJoinChallangePressed");
    console.log(this.state.isChallangeJoined);
    const isChallangeJoined = !this.state.isChallangeJoined;
    const { emailListID, emailList } = this.props.screenProps.latestChallenge;
    const { nameValue, emailValue } = this.state;
    console.log(
      "this.props.screenProps.latestChallenge : ",
      this.props.screenProps.latestChallenge
    );
    console.log("emailList : ", emailList);
    console.log("emailListID : ", emailListID);

    if (emailListID == undefined || emailListID == null || emailListID == "") {
      alert("Something went wrong. Please try again later.");
      return;
    } else {
      subscribeUserToChallangeListWithListID(
        emailListID,
        nameValue,
        emailValue
      ).then((response) => {
        console.log("subscribeUserToChallangeListWithListID response");
        console.log(response);
        this.props.screenProps.flagChallenge();
        this.setState({
          isChallangeJoined,
        });
        this.checkRemainingTime();
        EventRegister.emit("isChallengeJoined", true);
      });
    }
  }
  renderChallangeJoinView() {
    const { emailValue, nameValue, isChallangeJoined } = this.state;
    if (isChallangeJoined) {
      const { challengeBanner, currentChallengeImage, challengeJoinedImage } =
        this.props.screenProps.latestChallenge;
      let uri;
      if (challengeBanner != undefined) {
        uri = { uri: challengeJoinedImage };
      } else {
        uri = { uri: null };
      }
      return (
        <View
          ref={(snapshot) => (this.snapshot = snapshot)}
          options={{ format: "png", quality: 0.9 }}
          collapsable={false}
          style={{
            height: width * 0.9,
            width: "100%",
            borderRadius: 40,
            backgroundColor: "#b2b2b2",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 0,
            overflow: "hidden",
          }}
        >
          <ImageBackground
            imageStyle={{ resizeMode: "contain" }}
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              alignItems: "center",
            }}
            source={uri}
          >
            {/*<Image style={{width: '45%',height:40,marginTop:width*0.08,resizeMode: 'contain',marginBottom:0}} source={logo_white_love_seat_fitness} />
            <Text allowFontScaling={false} style={{...styles.iminText,marginTop:-5,marginLeft:0,color:"#fff"}}>I'M IN</Text>*/}
            <View
              style={{
                fleX: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: width * 0.75,
                position: "absolute",
              }}
            >
              <TouchableOpacity
                style={{
                  fleX: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => this._shareClicked()}
              >
                <View
                  style={{
                    ...styles.joinButtonBox,
                    width: width * 0.4,
                    backgroundColor: colorNew.darkPink,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      ...styles.joinText,
                      borderColor: "transparent",
                      paddingLeft: 0,
                      paddingRight: 0,
                      marginTop: 0,
                      marginBottom: 0,
                      lineHeight: 18,
                    }}
                  >
                    Share
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 0,
            position: "relative",
            overflow: "visible",
          }}
        >
          <View style={{ position: "absolute", bottom: 0 }}>
            <JoinChallengeButton
              onButtonPressed={this._onJoinChallangePressed.bind(this)}
              onAnimating={() =>
                this.setState({ hideInputsForAnimation: true })
              }
            />
          </View>
          <View style={styles.joinContainerStyle}>
            {!this.state.hideInputsForAnimation && (
              <>
                <View style={styles.sectionStyle}>
                  <TextInput
                    style={styles.textInputStyle}
                    placeholder={"Name"}
                    placeholderTextColor={color.mediumGrey}
                    onChangeText={(nameValue) => {
                      this.setState({ nameValue });
                    }}
                  >
                    {nameValue}
                  </TextInput>
                </View>
                <View style={styles.sectionStyle}>
                  <TextInput
                    style={styles.textInputStyle}
                    placeholder={"Email"}
                    placeholderTextColor={color.mediumGrey}
                    onChangeText={(emailValue) => {
                      this.setState({ emailValue });
                    }}
                  >
                    {emailValue}
                  </TextInput>
                </View>
              </>
            )}
          </View>
        </View>
      );
    }
  }
  _infoClicked() {
    console.log("_infoClicked");
    console.log(this.state);
  }
  renderVideoView() {
    let itemWidth = (width * 0.95 - 42) / 2;
    let gridHeight = itemWidth * 1.1 * 2 + 40;
    const paddingLeftRightForFirstItem = 16;
    var completedStr = "0/3 Completed";
    var displayLogButton = false;
    const {
      videoUrl,
      isRegularWorkoutCompletedForToday,
      isD10CompletedForToday,
      isBonusCompletedForToday,
      challangeWorkoutDetails,
    } = this.state;

    const createdAt = Date.now();
    const today = new Date(createdAt);
    if (this.state.loggedDays.includes(today.getDay())) {
    } else {
      if (
        isRegularWorkoutCompletedForToday ||
        isD10CompletedForToday ||
        isBonusCompletedForToday
      ) {
        displayLogButton = true;
      }
    }

    console.log("challangeWorkoutDetails");
    console.log(challangeWorkoutDetails);
    if (challangeWorkoutDetails.length > 0) {
      let count = challangeWorkoutDetails.length;
      completedStr = challangeWorkoutDetails.length + "/3 Completed";
      console.log("completedStr in renderVideoView");
      console.log(completedStr);
    }
    const {
      weeklyWorkoutSchedule,
      joinedChallenge,
      daily10,
      completedWorkouts,
    } = this.props.screenProps;
    const {
      challengeBonusText,
      challengeBonusButtonText,
      challengeBonusPicture,
      challengeBonusSectionData,
    } = this.props.screenProps;

    let weekData = this.getWeekData();
    let todaysWorkoutData = weekData[0];
    const colors = [colorNew.gradientsPinkStart, colorNew.gradientsPinkEnd];
    var isTodayLogged = false;
    let _isBonusCompletedForToday = isBonusCompletedForToday; //this.state.loggedDays.includes(today.getDay())
    var completedWorkoutsCount = 0;
    console.log("Vishal check for completed workout of today");
    if (todaysWorkoutData.isCompleted) {
      console.log("Vishal check for completed workout of today for regular");
      completedWorkoutsCount = completedWorkoutsCount + 1;
    }
    if (_isBonusCompletedForToday) {
      console.log("Vishal check for completed workout of today for bonus");
      completedWorkoutsCount = completedWorkoutsCount + 1;
    }
    if (isD10CompletedForToday) {
      console.log("Vishal check for completed workout of today for daily10");
      completedWorkoutsCount = completedWorkoutsCount + 1;
    }
    completedStr = completedWorkoutsCount + "/3 Completed";
    console.log("Vishal check for final string");
    console.log(completedStr);
    return (
      <View style={[{ flex: 1 }]}>
        <View style={{ width: "100%" }}>
          <View
            style={{ width: "100%", marginLeft: "5%", flexDirection: "row" }}
          >
            <View style={{ flex: 0.95, flexDirection: "row" }}>
              <View
                style={{ justifyContent: "center", alignItems: "flex-start" }}
              >
                <Text
                  allowFontScaling={false}
                  style={{
                    ...styles.headingTextBlackBig,
                    width: "100%",
                    paddingLeft: 0,
                  }}
                >
                  Today's Moves
                </Text>
              </View>
              <View
                style={{
                  flex: 0.85,
                  justifyContent: "space-around",
                  padding: 10,
                  alignItems: "flex-start",
                }}
              >
                <Text
                  allowFontScaling={false}
                  style={{
                    ...styles.moveCompletedText,
                    fontSize: 10,
                    color: colorNew.darkPink,
                  }}
                >
                  {completedStr}
                </Text>
              </View>
            </View>
            <View
              style={{
                fleX: 1,
                width: 50,
                justifyContent: "center",
                alignItems: "flex-end",
                marginRight: 10,
              }}
            >
              <TouchableOpacity
                style={{ justifyContent: "space-around" }}
                activeOpacity={0.9}
                onPress={() => this.showInfo()}
              >
                <Image
                  style={{ marginLeft: 10, marginRight: 10 }}
                  source={info_grey}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              height: height * 0.26,
              marginTop: 10,
              marginBottom: 10,
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <ChallengeTodaysMove
              isRegularWorkoutCompletedForToday={todaysWorkoutData.isCompleted}
              isD10CompletedForToday={isD10CompletedForToday}
              isBonusCompletedForToday={_isBonusCompletedForToday}
              displayCompletedView={this.state.isChallangeWorkoutCompleted}
              weeklyWorkoutSchedule={todaysWorkoutData}
              daily10={daily10}
              openDailySweatModal={this._openDailySweatModal}
              openBonusChallengeModal={this._openBonusChallengeModal}
              challengeBonusText={challengeBonusText}
              challengeBonusSectionData={challengeBonusSectionData}
              challengeBonusPicture={challengeBonusPicture}
              challengeBonusButtonText={challengeBonusButtonText}
              startWorkout={this._startWorkout}
            />
          </View>
          {/* {true ? ( */}
          {displayLogButton ? (
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={colors}
              style={{
                width: "65%",
                height: 44,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 30,
                marginLeft: "17.5%",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => this._logWorkout()}
              >
                <Text
                  allowFontScaling={false}
                  style={{
                    ...styles.modelButtonText,
                    fontSize: 13,
                    fontWeight: "bold",
                    color: "#fff",
                    marginTop: 10,
                    height: 30,
                    marginRight: 5,
                    marginLeft: 10,
                  }}
                >
                  Complete Today's Challenge
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          ) : null}
        </View>
      </View>
    );
  }
  checkRemainingTime() {
    const { isChallangeJoined } = this.state;
    // console.log("checkRemainingTime")
    const { challengeReady, startDate } =
      this.props.screenProps.latestChallenge;
    // console.log(startDate);
    const today = new Date();
    var diff = moment.duration(moment(startDate).diff(moment(today)));
    var remainingDays = parseInt(diff.asDays()); //days
    var remainingHours = parseInt(diff.asHours()); //2039 hours, but it gives total hours in given miliseconds which is not expacted.
    remainingHours = remainingHours - remainingDays * 24; //hours
    var remainingMinutes = parseInt(diff.asMinutes()); //minutes,but it gives total minutes in given miliseconds which is not expacted.
    remainingMinutes =
      remainingMinutes - (remainingDays * 24 * 60 + remainingHours * 60); //minutes.
    var remainingSeconds = parseInt(diff.asSeconds()); //seconds,but it gives total seconds in given miliseconds which is not expacted.
    if (remainingDays > 0) {
      remainingSeconds =
        remainingSeconds -
        (remainingDays * 24 * 60 * 60 +
          remainingHours * 60 * 60 +
          remainingMinutes * 60); //Seconds.
    } else if (remainingHours > 0) {
      remainingDays = 0;
      remainingSeconds =
        remainingSeconds - (remainingHours * 60 * 60 + remainingMinutes * 60); //Seconds.
    } else if (remainingMinutes > 0) {
      remainingHours = 0;
      remainingSeconds =
        remainingSeconds - (remainingMinutes * 60 + remainingMinutes * 60); //Seconds.
    }
    if (remainingSeconds <= 0) {
      remainingSeconds = 0;
    }
    if (remainingDays <= 0) {
      remainingDays = 0;
    }
    if (remainingHours <= 0) {
      remainingHours = 0;
    }
    if (remainingMinutes <= 0) {
      remainingMinutes = 0;
    }
    // console.log(remainingDays)
    // console.log(remainingHours)
    // console.log(remainingMinutes)
    // console.log(remainingSeconds)
    if (
      remainingDays > 0 ||
      remainingMinutes > 0 ||
      remainingHours > 0 ||
      remainingSeconds > 0
    ) {
      setTimeout(() => {
        this.checkRemainingTime();
      }, 1000);
      this.setState({
        displayWeekView: false,
        remainingDays,
        remainingHours,
        remainingMinutes,
        remainingSeconds,
      });
    } else {
      this.setState({
        isChallangeDuringVideo: isChallangeJoined,
        displayWeekView: isChallangeJoined,
        remainingDays,
        remainingHours,
        remainingMinutes,
        remainingSeconds,
      });
    }
  }

  renderChallangeView() {
    const {
      remainingDays,
      remainingHours,
      remainingMinutes,
      remainingSeconds,
      isChallangeJoined,
    } = this.state;
    const { challengeBanner, challengeReady, startDate } =
      this.props.screenProps.latestChallenge;
    // console.log("renderChallangeView startDate")

    if (
      remainingDays >= 0 ||
      remainingHours >= 0 ||
      remainingMinutes >= 0 ||
      remainingSeconds >= 0
    ) {
      const colors1 = [color.hotPink, color.mediumPink];
      const { isChallangeJoined } = this.state;

      const { challengeName, startDate, endDate } =
        this.props.screenProps.latestChallenge;
      // console.log(startDate)
      const today = new Date();
      var diff = moment.duration(moment(startDate).diff(moment(today)));
      var remainingDaysDiff = parseInt(diff.asDays()); //days

      return (
        <View style={styles.challangeContainer}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={colors1}
            style={{
              flex: 1,
              width: "90%",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 20,
              borderRadius: 40,
            }}
          >
            <View
              style={{
                width: "70%",
                height: 1,
                backgroundColor: "#ddd",
                marginTop: 10,
              }}
            />
            <Text
              numberOfLines={2}
              allowFontScaling={true}
              style={{
                ...styles.dailySubtitleText,
                color: "#fff",
                marginTop: 0,
                width: "100%",
                textAlign: "center",
                letterSpacing: 3,
                margin: 10,
                marginTop: 10,
                fontWeight: "300",
              }}
            >
              CHALLENGE COUNTDOWN
            </Text>
            <View
              style={{
                width: "70%",
                height: 1,
                backgroundColor: "#ddd",
                marginBottom: 10,
              }}
            />
            <View
              style={{
                width: "75%",
                height: 70,
                marginBottom: 10,
                justifyContent: "space-evenly",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  width: "24%",
                  height: "100%",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={2}
                  allowFontScaling={true}
                  style={{
                    ...styles.dailySubtitleText,
                    color: "#fff",
                    fontSize: 28,
                    marginTop: 0,
                    width: "100%",
                    textAlign: "center",
                    margin: 10,
                    marginTop: 10,
                    fontWeight: "500",
                  }}
                >
                  {remainingDays}
                </Text>
                <Text
                  numberOfLines={2}
                  allowFontScaling={true}
                  style={{
                    ...styles.dailySubtitleText,
                    color: "#fff",
                    fontSize: 10,
                    marginTop: 0,
                    width: "100%",
                    textAlign: "center",
                    margin: 10,
                    marginTop: 10,
                    fontWeight: "500",
                  }}
                >
                  days
                </Text>
              </View>
              <View
                style={{
                  width: "24%",
                  height: "100%",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={2}
                  allowFontScaling={true}
                  style={{
                    ...styles.dailySubtitleText,
                    color: "#fff",
                    fontSize: 28,
                    marginTop: 0,
                    width: "100%",
                    textAlign: "center",
                    margin: 10,
                    marginTop: 10,
                    fontWeight: "500",
                  }}
                >
                  {remainingHours}
                </Text>
                <Text
                  numberOfLines={2}
                  allowFontScaling={true}
                  style={{
                    ...styles.dailySubtitleText,
                    color: "#fff",
                    fontSize: 10,
                    marginTop: 0,
                    width: "100%",
                    textAlign: "center",
                    marginTop: 10,
                    fontWeight: "500",
                  }}
                >
                  hours
                </Text>
              </View>
              <View
                style={{
                  width: "24%",
                  height: "100%",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={2}
                  allowFontScaling={true}
                  style={{
                    ...styles.dailySubtitleText,
                    color: "#fff",
                    fontSize: 28,
                    marginTop: 0,
                    width: "100%",
                    textAlign: "center",
                    margin: 10,
                    marginTop: 10,
                    fontWeight: "500",
                  }}
                >
                  {remainingMinutes}
                </Text>
                <Text
                  numberOfLines={2}
                  allowFontScaling={true}
                  style={{
                    ...styles.dailySubtitleText,
                    color: "#fff",
                    fontSize: 10,
                    marginTop: 0,
                    width: "100%",
                    textAlign: "center",
                    marginTop: 10,
                    fontWeight: "500",
                  }}
                >
                  minutes
                </Text>
              </View>
              <View
                style={{
                  width: "24%",
                  height: "100%",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <Text
                  numberOfLines={2}
                  allowFontScaling={true}
                  style={{
                    ...styles.dailySubtitleText,
                    color: "#fff",
                    fontSize: 28,
                    marginTop: 0,
                    width: "100%",
                    textAlign: "center",
                    margin: 10,
                    marginTop: 10,
                    fontWeight: "500",
                  }}
                >
                  {remainingSeconds}
                </Text>
                <Text
                  numberOfLines={2}
                  allowFontScaling={true}
                  style={{
                    ...styles.dailySubtitleText,
                    color: "#fff",
                    fontSize: 10,
                    marginTop: 0,
                    width: "100%",
                    textAlign: "center",
                    marginTop: 10,
                    fontWeight: "500",
                  }}
                >
                  seconds
                </Text>
              </View>
            </View>
            {isChallangeJoined && remainingDaysDiff > 0 ? (
              <TouchableOpacity
                style={{
                  fleX: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => this._setReminderClicked()}
              >
                <View style={styles.joinButtonBox}>
                  <Text style={styles.joinText}>Set Reminder</Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </LinearGradient>
          <View
            style={{
              flex: 1,
              width: "90%",
              height: isChallangeJoined ? width * 0.9 : 250,
              flexDirection: "column",
              alignItems: "center",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            {this.renderChallangeJoinView()}
          </View>
          {this.renderChallangeHighlightView()}
        </View>
      );
    } else {
      // setTimeout(() => {this.checkRemainingTime()}, 1000)
      return null;
    }
  }
  renderChallangeHighlightView() {
    const { isChallangeJoined } = this.state;
    const { highlights } = this.props.screenProps.latestChallenge;
    console.log("vishal : renderChallangeHighlightView");
    console.log(this.props.screenProps.latestChallenge);
    if (isChallangeJoined) {
      return null;
    } else {
      return (
        <View
          style={{
            marginBottom: 10,
            width: "100%",
            backgroundColor: colorNew.darkPink,
          }}
        >
          <Text
            allowFontScaling={false}
            style={{ ...styles.subTitleNew, marginLeft: 20, color: "#fff" }}
          >
            Challenge Highlights
          </Text>
          <View
            style={{
              marginBottom: 20,
              width: "98%",
              height: 85,
              marginLeft: "1%",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <FlatList
              contentContainerStyle={{ paddingLeft: 16, paddingRight: 5 }}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    width: 15,
                    height: "100%",
                    backgroundColor: "transparent",
                  }}
                />
              )}
              style={{ width: "100%", padding: 0, height: "100%" }}
              data={highlights}
              extraData={this.state}
              renderItem={this._renderHighlightCell}
              keyExtractor={(item, index) => item + index}
            />
            {/*<View style={[this.elevationShadowStyle(3),{width:"45%",height:"80%",backgroundColor:"#fff",flexDirection:"row",borderRadius:15,borderColor:"#b2b2b2",borderWidth:1,marginTop: 0,justifyContent:"flex-start",alignItems:"center"}]}>
              <View style={{width:50,marginLeft:10,height:50,backgroundColor:"#b2b2b2",borderColor:"#000",borderWidth:1}} />
              <View style={{marginLeft:10,marginRight:5,height:"95%",flex:1,justifyContent:"flex-start",alignItems:"center"}}>
              <Text allowFontScaling={false} numberOfLines={2} style={{...styles.highlightTextBold,marginLeft:0,marginTop:10,color:"#000"}}>Free Challenge</Text>
              <Text allowFontScaling={false} numberOfLines={3} style={{...styles.highlightTextLight,marginLeft:0,color:"#000"}}>6 week challenge + million challenge to get challenge to get</Text>
              </View>
            </View>  
            <View style={[this.elevationShadowStyle(3),{width:"45%",height:"80%",backgroundColor:"#fff",flexDirection:"row",borderRadius:15,borderColor:"#b2b2b2",borderWidth:1,marginTop: 0,justifyContent:"flex-start",alignItems:"center"}]}>
              <View style={{width:50,marginLeft:10,height:50,backgroundColor:"#b2b2b2",borderColor:"#000",borderWidth:1}} />
              <View style={{marginLeft:10,marginRight:5,height:"95%",flex:1,justifyContent:"flex-start",alignItems:"center"}}>
                <Text allowFontScaling={false} numberOfLines={2} style={{...styles.highlightTextBold,marginLeft:0,marginTop:10,color:"#000"}}>WIN Your Dream Vacation</Text>
                <Text allowFontScaling={false} numberOfLines={3} style={{...styles.highlightTextLight,marginLeft:0,color:"#000"}}>We are giving $1000 cash PLUS all travel essentials </Text>
              </View>
            </View>*/}
          </View>
        </View>
      );
    }
  }
  _renderHighlightCell = ({ item, index }) => {
    console.log("_renderHighlightCell");
    // console.log(item);

    let box_height = 80;
    let margin_top_bottom = 10;
    let img_height = 60;
    return (
      <View
        style={[
          this.shadowBottomForHighlightSection(3),
          {
            width: width * 0.5,
            height: box_height,
            backgroundColor: "#fff",
            flexDirection: "row",
            borderRadius: 15,
            borderColor: "#b2b2b2",
            borderWidth: 1,
            marginTop: 0,
            justifyContent: "flex-start",
            alignItems: "center",
          },
        ]}
      >
        <View />
        <View
          style={{
            width: img_height,
            marginLeft: 10,
            height: img_height,
            backgroundColor: "#b2b2b2",
            borderColor: "#000",
            borderWidth: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            imageStyle={{ resizeMode: "contain" }}
            style={{ width: img_height - 5, height: img_height - 5, margin: 1 }}
            source={{ uri: item.img }}
          ></Image>
        </View>
        <View
          style={{
            marginLeft: 10,
            marginRight: 10,
            height: img_height,
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Text
            allowFontScaling={false}
            numberOfLines={2}
            style={{
              ...styles.highlightTextBold,
              textAlignVertical: "top",
              fontSize: 12,
              marginTop: 0,
              marginLeft: 0,
              marginTop: 0,
              color: "#000",
            }}
          >
            {item.title}
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={3}
            style={{
              ...styles.highlightTextLight,
              marginLeft: 0,
              color: "#000",
            }}
          >
            {item.desc}
          </Text>
        </View>
      </View>
    );
  };
  _setReminderClicked() {
    // console.log("_setReminderClicked");
    console.log(this.state.isChallangeJoined);

    const { challengeName, startDate, endDate } =
      this.props.screenProps.latestChallenge;

    var title = "";
    const startDateUTC = moment(startDate, "YYYY-MM-DD");
    const endDateUTC = moment(endDate, "YYYY-MM-DD");

    title = challengeName != undefined ? challengeName : "";

    const eventConfig = {
      title,
      startDate: utcDateToString(startDateUTC),
      endDate: utcDateToString(moment.utc(endDateUTC)),
      notes: "Love Sweat Fitness " + title + " challenge start.",
    };

    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then((eventInfo) => {
        console.warn(JSON.stringify(eventInfo));
      })
      .catch((error) => {
        // handle error such as when user rejected permissions
        console.warn(error);
      });
  }
  _viewBonusSweats() {
    // console.log("_viewBonusSweats");
    console.log(this.state.isChallangeJoined);
    this.props.navigation.navigate("SweatChallenges");
  }
  _showBonusVideo() {
    console.log("_showBonusVideo");
    this.setState({
      isChallangeVideoSelected: false,
      isBonusVideoSelected: true,
    });
  }
  _showChallangeVideo() {
    console.log("_showChallangeVideo");
    this.setState({
      isChallangeVideoSelected: true,
      isBonusVideoSelected: false,
    });
  }
  _inviteClicked() {
    console.log("_inviteClicked");

    // const result = await
    Share.share({
      title: "Invite for challenge",
      message:
        "Hey girl! I just started these incredible workouts in the Love Sweat Fitness App! Wanna do them with me? There's a free 7 day trial you can get here https://lovesweatfitness.com/lsf-app",
      url: "https://lovesweatfitness.com/lsf-app",
    });
    // if (result.action === Share.sharedAction) {
    //   if (result.activityType) {
    //     // shared with activity type of result.activityType
    //   } else {
    //     // shared
    //   }
    // } else if (result.action === Share.dismissedAction) {
    //   // dismissed
    // }

    //  this.setState({
    //   showInviteFriend: true
    // });
  }
  _ebookClicked() {
    console.log("_ebookClicked");
    this.showSweatStarterModal();
  }
  _shareClicked() {
    console.log("_shareClicked");
    console.log(this.state.isChallangeJoined);
    this._shareFor(this.snapshot, false);
  }
  renderBanner() {
    const { challengeBanner } = this.props.screenProps.latestChallenge;
    let uri;

    if (challengeBanner != undefined) {
      uri = { uri: challengeBanner };
    } else {
      uri = { uri: null };
    }
    console.log("renderBanner");
    console.log("this.state.isChallangeDuringVideo");
    console.log(this.state.isChallangeDuringVideo);
    console.log(challengeBanner);
    if (
      (this.state.isChallangeDuringVideo ||
        this.state.isChallangeWorkoutCompleted) &&
      this.state.isTodayLogged == false
    ) {
      return (
        <View
          style={{
            ...styles.headerContainer,
            backgroundColor: "#fff",
            height: height * 0.15,
            justifyContent: "center",
          }}
        >
          <ImageBackground
            imageStyle={{ resizeMode: "contain" }}
            style={{ flex: 1, width: "100%", height: "80%", marginTop: "5%" }}
            source={uri}
          >
            {/*<Text style={{ fontFamily: "SF Pro Text", fontSize: 35, fontStyle: "normal",fontWeight: 'normal', textAlign: "center", color: colorNew.textPink,marginTop:20}}>CHALLENGE</Text>*/}
          </ImageBackground>
        </View>
      );
    } else if (this.state.isTodayLogged) {
      return null;
    } else if (this.state.isChallangeInbetween) {
      return (
        <View
          style={{
            ...styles.headerContainer,
            backgroundColor: "#fff",
            height: height * 0.22,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "SF Pro Text",
              fontSize: 35,
              fontStyle: "normal",
              fontWeight: "bold",
              textAlign: "center",
              color: colorNew.textPink,
              marginTop: 20,
            }}
          >
            New Challenge{"\n"}Coming Soon!
          </Text>
        </View>
      );
    } else {
      return (
        <View
          style={{ ...styles.headerContainer, backgroundColor: "transparent" }}
        >
          <ImageBackground
            imageStyle={{ resizeMode: "contain" }}
            style={{ flex: 1, width: "100%", height: "100%" }}
            source={uri}
          >
            {/*<Text style={{ fontFamily: "SF Pro Text", fontSize: 28, fontStyle: "normal", textAlign: "center", color: '#fff', marginBottom:40}}>CHALLENGE{'\n'}LOGO HERE</Text>*/}
          </ImageBackground>
        </View>
      );
    }
  }
  _navigationLeftButtonPressed() {
    const refresh = !this.state.refresh;
    this.setState({ refresh });
    console.log("_navigationLeftButtonPressed");
    this.props.navigation.navigate("Settings", {
      backToScreen: "ChallangeNavigator",
      screenProps: this.props.screenProps,
    });
  }
  _navigationRightButtonPressed() {
    console.log("_navigationRightButtonPressed");
    let showGoalView = !this.state.showGoalView;
    this.setState({ showGoalView });
  }
  renderGradientHeader() {
    if (
      this.state.isChallangeInbetween ||
      this.state.isChallangeDuringVideo ||
      this.state.isChallangeWorkoutCompleted
    ) {
      return (
        <View
          style={[
            {
              width: "100%",
              height: 100,
              position: "absolute",
              marginTop: 0,
              justifyContent: "flex-end",
            },
          ]}
        >
          {/*<HeaderPink onLeftPress={this._navigationLeftButtonPressed.bind(this)} onRightPress={this._navigationRightButtonPressed.bind(this)}/>*/}
          <HomeHeader
            onRightPressed={this._navigationLeftButtonPressed.bind(this)}
          />
        </View>
      );
    } else {
      return null;
    }
  }
  renderHeader() {
    if (
      this.state.isChallangeInbetween == false &&
      this.state.isChallangeDuringVideo == false &&
      this.state.isChallangeWorkoutCompleted == false
    ) {
      const paddingLeftRightForFirstItem = 16;
      /*return (
        <View style={{flexDirection:"row",width:"100%",position:"absolute",height:64,backgroundColor:"transparent",alignItems:"center",justifyContent:"center"}}>
          <TouchableOpacity style={{flexDirection:"row",height:60,width:60,backgroundColor:"transparent",alignItems:"center",justifyContent:"flex-start"}} onPress={this._navigationLeftButtonPressed.bind(this)}>
            <ImageBackground imageStyle={{resizeMode: 'center'}} style={{height:64,width:64}} source={gear}>
            </ImageBackground>  
          </TouchableOpacity>
        <View style={{flex:1,height:"100%",backgroundColor:"transparent",alignItems:"center",justifyContent:"center"}}>
        </View>
          <TouchableOpacity style={{width:64,height:64}} onPress={this._navigationRightButtonPressed.bind(this)}>
            <ImageBackground imageStyle={{resizeMode: 'center'}} style={{height:64,width:64}} source={lightning_bolt}>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      )*/

      return (
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            position: "absolute",
            height: 64,
            backgroundColor: "transparent",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              height: 60,
              width: 60,
              backgroundColor: "transparent",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          ></TouchableOpacity>
          <View
            style={{
              flex: 1,
              height: "100%",
              backgroundColor: "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          ></View>
          <TouchableOpacity
            style={{ width: 64, height: 64 }}
            onPress={this._navigationLeftButtonPressed.bind(this)}
          >
            <ImageBackground
              imageStyle={{ resizeMode: "center" }}
              style={{ height: 64, width: 64 }}
              source={gear}
            ></ImageBackground>
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  }

  renderBanner_old() {
    const { challengeBanner } = this.props.screenProps.latestChallenge;

    return (
      <View style={styles.bannerContainer}>
        <Image style={styles.banner} source={{ uri: challengeBanner }} />
      </View>
    );
  }

  renderWeeklyChallengeCount() {
    console.log("renderWeeklyChallengeCount called");
    const { weekNum, totalWeeks } = this.state;

    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: 60,
        }}
      >
        <Text style={styles.weekText}>WEEK </Text>
        <Text
          style={{
            fontFamily: "SF Pro Text",
            fontSize: 28,
            fontStyle: "normal",
            textAlign: "center",
            color: "#ec568f",
          }}
        >
          {weekNum}
        </Text>
        <Text style={styles.weekText}> OF {totalWeeks}</Text>
      </View>
    );
  }

  _findCurrentWeekOfChallenge() {
    const { challengeStartDate, challengeEndDate } = this.props.screenProps;

    let weekNum = 0;
    let totalWeeks = 0;
    let weekInMiliseconds = 604800000;
    let currentWeek = moment().valueOf();

    // start times and end times of challenge
    let start = moment(challengeStartDate).startOf("isoWeek").valueOf();
    let end = moment(challengeEndDate).endOf("isoWeek").valueOf();

    // starting with the beginning of the challenge week, loop by adding a full week of miliseconds
    // and check to see if the current week time is still greater than or equal to the week iteration
    // this will tally the weeks you're on.

    var weekText = [];
    for (
      let weekIteration = start;
      weekIteration <= end;
      weekIteration += weekInMiliseconds
    ) {
      totalWeeks++;

      let weekTextString = "Week " + totalWeeks;
      weekText.push(weekTextString);
      if (weekIteration <= currentWeek) {
        weekNum++;
      }
    }
    console.log("weekText");
    console.log(weekText);

    this.setState({
      weekNum: weekNum,
      weekList: weekText,
      totalWeeks: totalWeeks,
    });
  }

  renderCalendarWeek() {
    let d = new Date();
    let today = d.getDay();

    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          height: 90,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "90%",
            justifyContent: "space-evenly",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={this.props.onDayPressed}
          >
            <View style={{ flexDirection: "column" }}>
              <View style={styles.calendar}>
                {this.state.loggedDays.includes(1) ? (
                  <Image
                    style={{ position: "absolute", top: 5, left: 6 }}
                    source={require("./images/star.png")}
                  />
                ) : (
                  <View></View>
                )}
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text allowFontScaling={false} style={styles.weekDay(today, 1)}>
                  MON
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={this.props.onDayPressed}
          >
            <View style={{ flexDirection: "column" }}>
              <View style={styles.calendar}>
                {this.state.loggedDays.includes(2) ? (
                  <Image
                    style={{ position: "absolute", top: 5, left: 6 }}
                    source={require("./images/star.png")}
                  />
                ) : (
                  <View></View>
                )}
              </View>
              <View style={{ alignItems: "center" }}>
                <Text allowFontScaling={false} style={styles.weekDay(today, 2)}>
                  TUE
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={this.props.onDayPressed}
          >
            <View style={{ flexDirection: "column" }}>
              <View style={styles.calendar}>
                {this.state.loggedDays.includes(3) ? (
                  <Image
                    style={{ position: "absolute", top: 5, left: 6 }}
                    source={require("./images/star.png")}
                  />
                ) : (
                  <View></View>
                )}
              </View>
              <View style={{ alignItems: "center" }}>
                <Text allowFontScaling={false} style={styles.weekDay(today, 3)}>
                  WED
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={this.props.onDayPressed}
          >
            <View style={{ flexDirection: "column" }}>
              <View style={styles.calendar}>
                {this.state.loggedDays.includes(4) ? (
                  <Image
                    style={{ position: "absolute", top: 5, left: 6 }}
                    source={require("./images/star.png")}
                  />
                ) : (
                  <View></View>
                )}
              </View>
              <View style={{ alignItems: "center" }}>
                <Text allowFontScaling={false} style={styles.weekDay(today, 4)}>
                  THU
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={this.props.onDayPressed}
          >
            <View style={{ flexDirection: "column" }}>
              <View style={styles.calendar}>
                {this.state.loggedDays.includes(5) ? (
                  <Image
                    style={{ position: "absolute", top: 5, left: 6 }}
                    source={require("./images/star.png")}
                  />
                ) : (
                  <View></View>
                )}
              </View>
              <View style={{ alignItems: "center" }}>
                <Text allowFontScaling={false} style={styles.weekDay(today, 5)}>
                  FRI
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={this.props.onDayPressed}
          >
            <View style={{ flexDirection: "column" }}>
              <View style={styles.calendar}>
                {this.state.loggedDays.includes(6) ? (
                  <Image
                    style={{ position: "absolute", top: 5, left: 6 }}
                    source={require("./images/star.png")}
                  />
                ) : (
                  <View></View>
                )}
              </View>
              <View style={{ alignItems: "center" }}>
                <Text allowFontScaling={false} style={styles.weekDay(today, 6)}>
                  SAT
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={this.props.onDayPressed}
          >
            <View style={{ flexDirection: "column" }}>
              <View style={styles.calendar}>
                {this.state.loggedDays.includes(0) ? (
                  <Image
                    style={{ position: "absolute", top: 5, left: 6 }}
                    source={require("./images/star.png")}
                  />
                ) : (
                  <View></View>
                )}
              </View>
              <View style={{ alignItems: "center" }}>
                <Text allowFontScaling={false} style={styles.weekDay(today, 0)}>
                  SUN
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  shadowTop(elevation) {
    return {
      elevation,
      shadowColor: "black",
      shadowOffset: { width: 0, height: 0.5 * -elevation },
      shadowOpacity: 0.3,
      shadowRadius: 0.8 * elevation,
      backgroundColor: "white",
    };
  }

  renderSweatSesh(today) {
    const nowUTC = moment.utc();

    let uri;

    if (today && today.imageUrl != undefined) {
      uri = { uri: today.imageUrl };
    } else {
      uri = { uri: null };
    }

    return (
      <View
        style={[
          this.elevationShadowStyle(5),
          { marginTop: 20, flex: 1, flexDirection: "column" },
        ]}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#fae8ee",
            width: "100%",
            height: 60,
          }}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              style={{ width: 180, resizeMode: "contain" }}
              source={require("./images/sweatSesh.png")}
            />
          </View>
        </View>
        <ImageBackground
          style={{ flex: 1, width: "100%", height: 247.7 }}
          source={uri}
        >
          <View
            style={{
              position: "absolute",
              backgroundColor: "rgba(147, 122, 132, 0.20)",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          ></View>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text style={styles.descriptions}>
              {today && today.description != undefined
                ? today.description.toUpperCase()
                : "Today's Workout"}
            </Text>
          </View>
        </ImageBackground>
        <View
          style={{
            flex: 1,
            backgroundColor: "#fae8ee",
            width: "100%",
            height: 70,
          }}
        >
          <TouchableOpacity
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={() =>
              this.props.screenProps.startWorkout(today, "ChallengeDashboard")
            }
          >
            <View style={styles.startButton}>
              <Text allowFontScaling={false} style={styles.startButtonText}>
                START TODAY'S WORKOUT
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderChallengeDaily10() {
    let { daily10 } = this.props.screenProps;

    // start/end of week millisecond timestamp
    const dayOfTheWeek = moment().format("dddd");

    return (
      <View style={this.elevationShadowStyle(5)}>
        <View style={this.shadowTop(5)}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: 60,
              backgroundColor: "#f09ab8",
            }}
          >
            <Image
              style={{ width: "80%", resizeMode: "contain" }}
              source={require("./images/challengeDaily10.png")}
            />
          </View>
          <ImageBackground
            style={{ width: "100%", height: 255 }}
            source={{
              uri: daily10.ssuPhoto != undefined ? daily10.ssuPhoto : null,
            }}
          >
            <View
              style={{
                position: "absolute",
                backgroundColor: "rgba(147, 122, 132, 0.20)",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            ></View>

            {!isEmpty(daily10) ? (
              <View style={{ flex: 1, justifyContent: "center", top: 30 }}>
                <Text allowFontScaling={false} style={styles.DOWHeaderText}>
                  {dayOfTheWeek.toUpperCase()}
                </Text>
              </View>
            ) : (
              <View style={{ flex: 1, justifyContent: "center", top: 20 }}>
                <TouchableOpacity onPress={this.reloadDaily10}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      { ...styles.ssuDOWHeaderText },
                      { fontSize: 22, color: "white" },
                    ]}
                  >
                    Press to reload
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ImageBackground>
          <View
            style={{
              flex: 1,
              width: "100%",
              height: 70,
              backgroundColor: "#f09ab8",
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              activeOpacity={0.5}
              onPress={this.props.screenProps.openDailySweatModal}
              disabled={!isEmpty(daily10) ? false : true}
            >
              <View style={styles.daily10Button}>
                <Text allowFontScaling={false} style={styles.daily10ButtonText}>
                  GET TODAY'S MOVES
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  reloadDaily10 = async () => {
    const { _fetchDaily10 } = this.props.screenProps;

    try {
      let daily10 = await _fetchDaily10();
    } catch (error) {
      console.log("error reloading daily 10 data");
    }
  };

  renderBonus() {
    const {
      challengeBonusText,
      challengeBonusButtonText,
      challengeBonusPicture,
      challengeBonusSectionData,
    } = this.props.screenProps;

    console.log("challengeBonusSectionData");
    console.log(challengeBonusSectionData);

    const { reps, exerciseVideo, exercise, description, type } =
      challengeBonusSectionData;

    const exerciseVideoUri =
      exerciseVideo != undefined
        ? exerciseVideo
        : "https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/Challenge%20Bonus%20Section%20Videos%2FBooty%20Challenge%202019%2F1-SingleLegSquat_Booty19.mp4?alt=media&token=8397e714-64c4-4556-9274-9cbd79b550dd";

    return (
      <View
        style={[
          this.elevationShadowStyle(5),
          {
            flex: 1,
            alignItems: "center",
            backgroundColor: "#fae8ee",
            width: "100%",
          },
        ]}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginBottom: 10,
          }}
        >
          <Image
            style={{ width: 110, resizeMode: "contain" }}
            source={require("./images/bonus.png")}
          />
          <Text style={styles.bonusMessage}>
            {challengeBonusText.toUpperCase()}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: 260,
          }}
        >
          {type != "picture" ? (
            <Video
              source={{ uri: exerciseVideoUri }}
              style={{ width: "120%", height: "100%" }}
              repeat={true}
              resizeMode={"contain"}
            />
          ) : (
            <Image
              style={{ width: "100%", height: "100%", resizeMode: "stretch" }}
              source={{ uri: exerciseVideoUri }}
            />
          )}
        </View>
        {exercise ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#fae8ee",
              width: "100%",
              height: 40,
            }}
          >
            <Text style={styles.bonusText}>{exercise}</Text>
            <Text style={styles.bonusText}>{reps}</Text>
          </View>
        ) : null}
      </View>
    );
  }
  _onBonusChallengeDone = () => {
    const createdAt = Date.now();
    const today = new Date(createdAt);
    const name = "bonus";
    const { validPurchase } = this.props.screenProps;
    console.log(
      "saveWorkoutForChallenge called in ChallangeDashboard _onBonusChallengeDone"
    );
    this.props.screenProps.saveWorkoutForChallenge({
      createdAt,
      validPurchase,
      name: "bonus",
    });
    var obj = {
      createdAt: createdAt,
      validPurchase: validPurchase,
      workoutName: "bonus",
    };
    var challangeWorkoutDetails = this.state.challangeWorkoutDetails;
    challangeWorkoutDetails.push(obj);
    this.setState({
      showChallengeBonusModal: false,
      isBonusCompletedForToday: true,
      challangeWorkoutDetails,
    });
  };

  _renderChallengeBonusModal = () => {
    const {
      challengeBonusText,
      challengeBonusButtonText,
      challengeBonusPicture,
      challengeBonusSectionData,
    } = this.props.screenProps;

    console.log("challengeBonusSectionData");
    console.log(challengeBonusSectionData);

    const { reps, exerciseVideo, exercise, description, type } =
      challengeBonusSectionData;

    const exerciseVideoUri =
      exerciseVideo != undefined
        ? exerciseVideo
        : "https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/Challenge%20Bonus%20Section%20Videos%2FBooty%20Challenge%202019%2F1-SingleLegSquat_Booty19.mp4?alt=media&token=8397e714-64c4-4556-9274-9cbd79b550dd";
    const { challengeBonusButtonLink } = this.props.screenProps;
    const { showChallengeBonusModal } = this.state;
    console.log("challengeBonusButtonLink");
    console.log(challengeBonusButtonLink);
    if (Platform.OS === "ios") {
      videoStyle = {
        height: videoContainerHeight * 1.75,
        width: videoContainerWidth * 1.75,
        backgroundColor: "transparent",
        borderRadius: 40,
      };
      imageStyle = {
        height: videoContainerHeight * 1.75,
        width: videoContainerWidth * 1.15,
        backgroundColor: "transparent",
        borderRadius: 40,
      };
    } else {
      videoStyle = {
        height: videoContainerHeight * 1.75,
        width: videoContainerWidth * 1.75,
        borderRadius: 40,
      };
      imageStyle = {
        height: videoContainerHeight * 1.75,
        width: videoContainerWidth * 1.15,
        borderRadius: 40,
      };
    }
    return (
      <Modal
        animationType="slide"
        visible={showChallengeBonusModal}
        onRequestClose={() => {}}
      >
        <View style={{ flex: 1 }}>
          <Header
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    showChallengeBonusModal: false,
                  });
                }}
              >
                <Image source={require("./images/iconXPink.png")} />
              </TouchableOpacity>
            }
            centerComponent={{ text: "BONUS", style: styles.headerTitle }}
            backgroundColor={"#ffffff"}
            outerContainerStyles={{ borderBottomWidth: 0 }}
          />
          <View
            style={{
              flex: 1,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={styles.videoContainer}>
              <View
                style={{
                  width: width,
                  justifyContent: "center",
                  alignItems: "center",
                  height: height * 0.85,
                }}
              >
                {type != "picture" ? (
                  <Video
                    source={{ uri: exerciseVideoUri }}
                    style={videoStyle}
                    repeat={true}
                    resizeMode={"contain"}
                  />
                ) : (
                  <Image
                    style={imageStyle}
                    source={{ uri: exerciseVideoUri }}
                  />
                )}
              </View>
            </View>
          </View>
          {exercise ? (
            <View
              style={{
                width: width,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fae8ee",
                width: "100%",
                height: height * 0.2,
              }}
            >
              <Text
                adjustsFontSizeToFit={true}
                numberOfLines={1}
                style={styles.subTitle}
              >
                {exercise.toUpperCase()}
              </Text>
              <Text
                adjustsFontSizeToFit={true}
                numberOfLines={1}
                style={styles.highlighText}
              >
                {reps}
              </Text>

              <TouchableOpacity onPress={() => this._onBonusChallengeDone()}>
                <View
                  style={{
                    backgroundColor: colorNew.textPink,
                    borderRadius: 50,
                    height: 40,
                    width: width / 2,
                    marginTop: 10,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}
                    style={{
                      width: width / 2,
                      height: 20,
                      fontFamily: "SF Pro Text",
                      fontSize: 14,
                      fontWeight: "bold",
                      fontStyle: "normal",
                      lineHeight: 20,
                      letterSpacing: 0.5,
                      textAlign: "center",
                      color: colorNew.white,
                      flexWrap: "wrap",
                    }}
                  >
                    {"Log Bonus Move"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </Modal>
    );
  };

  renderLogMyWorkoutButton() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
          marginBottom: 20,
          width: "100%",
          height: 160,
          backgroundColor: "white",
        }}
      >
        <View style={{ height: 60 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              width: 240,
            }}
            activeOpacity={0.5}
            onPress={() => this._logWorkout()}
          >
            <Image
              style={{ height: 120, width: 280, resizeMode: "contain" }}
              source={require("./images/logMyWorkout.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _logWorkout = () => {
    const createdAt = Date.now();
    const today = new Date(createdAt);
    const { validPurchase } = this.props.screenProps;

    this.setState({
      showCompletionModal: true,
    });

    if (this.state.loggedDays.includes(today.getDay())) {
      console.log("This day's workout as already been logged.");
    } else {
      this.props.screenProps
        .saveChallengeWorkout({ createdAt, validPurchase })
        .then(() => {
          // set state for star to show up
          console.log("workout been logged for today.");
          this.loggedDays();
        });
    }
  };

  _renderCompletionModal = () => {
    const { showCompletionModal } = this.state;
    const { endScreens } = this.props.screenProps.latestChallenge;
    const esIndex = this.state.weekNum;

    // let endScreen = (endScreens[esIndex] != undefined) ?
    //   { uri: endScreens[esIndex] } :
    //   require('./images/lol_end_screens-01.jpg');
    // console.log("endScreen");
    // console.log(endScreen);
    let endScreen = require("./images/lol_end_screens-01.jpg");

    return (
      <CompletionModal
        title="Workout Logged"
        visible={showCompletionModal}
        shift={this._closeCompletionModal}
        endScreen={endScreen}
        lowerButtons={true}
        challengeActive={this.props.screenProps.challengeActive}
      />
    );
  };

  _closeCompletionModal = () => {
    this.setState({
      showCompletionModal: false,
    });
  };
  shadowBottomForHighlightSection(elevation) {
    return {
      elevation,
      shadowColor: "rgba(0, 0, 0, 0.3)",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 1,
      shadowRadius: 1 * elevation,
      backgroundColor: "white",
    };
  }
  shadowBottomForGrid(elevation) {
    return {
      elevation,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 0.5 * (elevation + 7) },
      shadowOpacity: 0.2,
      shadowRadius: 0.5 * elevation,
      backgroundColor: "white",
    };
  }
  shadowBottom(elevation) {
    return {
      elevation,
      shadowColor: "#b2b2b2",
      shadowOffset: { width: 0, height: 0.5 * (elevation + 5) },
      shadowOpacity: 0.2,
      shadowRadius: 0.8 * elevation,
      backgroundColor: "white",
    };
  }
  elevationShadowStyle(elevation) {
    return {
      marginTop: 20,
      elevation,
      shadowColor: "black",
      shadowOffset: { width: 0, height: 0.5 * elevation },
      shadowOpacity: 0.3,
      shadowRadius: 0.8 * elevation,
      backgroundColor: "white",
    };
  }
  elevationShadowStyleForHighlight(elevation) {
    return {
      marginTop: 20,
      elevation,
      shadowColor: "black",
      shadowOffset: { width: 0, height: 0.5 * elevation + 5 },
      shadowOpacity: 0.3,
      shadowRadius: 0.8 * elevation,
      backgroundColor: "white",
    };
  }
}

function isCircuitOnlyWorkout(primaryType, secondaryType) {
  return primaryType === "Circuit" && secondaryType === "Circuit";
}

function isComboDetailWorkout(primaryType, secondaryType) {
  return (
    (primaryType === "Circuit" && secondaryType === "MISS Cardio") ||
    secondaryType === "LISS Cardio" ||
    secondaryType === "HIIT Cardio"
  );
}

const styles = {
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    marginTop: 0,
    height: height,
    width: width,
  },
  window: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#bfbfbf80",
    height: "100%",
    width: "100%",
  },
  dialogue: {
    width: "90%",
    height: 440,
    borderRadius: 50,
    borderWidth: 0,
    borderColor: colorNew.bgGrey,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  infoMiddleText: {
    width: "90%",
    marginTop: 0,
    fontFamily: "SF Pro Text",
    fontSize: 18,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#828282",
  },
  modalHeaderText: {
    width: "90%",
    height: "15%",
    marginTop: 50,
    fontFamily: "SF Pro Text",
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colorNew.textPink,
  },
  shopItemHeaderText: {
    width: "90%",
    fontFamily: "SF Pro Text",
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colorNew.textPink,
  },
  modelButtonText: {
    fontFamily: "SF Pro Text",
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colorNew.textPink,
  },
  joinButtonBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  joinText: {
    top: 1,
    letterSpacing: 0,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "normal",
    fontStyle: "normal",
    color: "white",
    padding: 5,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 10,
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 10,
    marginBottom: 20,
  },
  sectionStyle: {
    height: 40,
    width: width * 0.84,
    marginTop: height * 0.034,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: color.lightGrey,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  joinContainerStyle: {
    height: 160,
    marginTop: 0,
  },
  textInputStyle: {
    flex: 1,
    fontFamily: "SF Pro Text",
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#000",
  },
  subTitleNew: {
    marginTop: 10,
    marginBottom: 5,
    marginLeft: "10%",
    fontFamily: "SF Pro Text",
    fontSize: 24,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: 55,
    letterSpacing: 0,
    textAlign: "left",
    color: color.white,
  },
  iminText: {
    marginTop: 5,
    marginBottom: 5,
    fontFamily: "SF Pro Text",
    fontSize: 34,
    fontWeight: "700",
    fontStyle: "normal",
    textAlign: "center",
    color: color.white,
  },
  headingTextBlackBig: {
    width: "90%",
    height: 30,
    fontFamily: "SF Pro Text",
    fontSize: 25,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    paddingLeft: 20,
    color: "#000",
    marginTop: 20,
  },
  viewallTextBlack: {
    width: "90%",
    height: 18,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0.0,
    textAlign: "left",
    color: "#000",
    marginTop: 20,
  },
  moveCompletedText: {
    height: 18,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0.0,
    textAlign: "left",
    color: "#000",
    marginTop: 20,
  },
  highlightTextBold: {
    width: "100%",
    fontFamily: "SF Pro Text",
    fontSize: 10,
    fontWeight: "bold",
    fontStyle: "normal",
    textAlign: "left",
    color: "#000",
    marginTop: 2,
  },
  highlightTextLight: {
    width: "100%",
    fontFamily: "SF Pro Text",
    fontSize: 8,
    lineHeight: 12,
    fontWeight: "300",
    fontStyle: "normal",
    letterSpacing: 0.0,
    textAlign: "left",
    color: "#000",
    marginTop: 5,
  },
  dailySubtitleText: {
    width: "90%",
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "100",
    fontStyle: "normal",
    letterSpacing: 0.0,
    textAlign: "left",
    color: "#000",
    paddingLeft: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  challangeContainer: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  headerContainer: {
    width: "100%",
    height: Platform.OS === "ios" ? height * 0.25 : height * 0.3,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: colorNew.bgGrey,
  },
  bannerContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  weekDayStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "500",
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    fontStyle: "normal",
    color: colorNew.mediumPink,
    marginTop: 10,
  },
  thisWeekStartNow: {
    fontFamily: "SF Pro Text",
    fontSize: 9,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 14,
    padding: 5,
    letterSpacing: 0,
    textAlign: "center",
    color: "#fff",
    marginTop: 0,
  },
  banner: {
    resizeMode: "contain",
    width: "90%",
    height: 200,
  },
  weekText: {
    fontFamily: "SF Pro Text",
    fontSize: 28,
    fontStyle: "normal",
    textAlign: "center",
    color: color.mediumGrey,
  },
  weekDay: (today, dayNumber) => {
    let style = {
      marginTop: 5,
      width: 31,
      height: 15,
      fontFamily: "SF Pro Text",
      fontSize: 12,
      fontWeight: "300",
      fontStyle: "normal",
      lineHeight: 15,
      letterSpacing: 0.5,
      textAlign: "center",
      color: "#f09ab8",
    };

    if (today == dayNumber) {
      style.textDecorationLine = "underline";
    }

    return style;
  },
  calendar: {
    width: 40,
    height: 40,
    backgroundColor: "#fae8ee",
    borderRadius: 20,
    marginTop: 7,
    borderWidth: 1,
    borderColor: "#f09ab8",
  },
  mainText: {
    width: "100%",
    height: 140,
    fontFamily: "SF Pro Text",
    fontSize: 72,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 140,
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
    marginTop: 0,
    textShadowColor: color.mediumPink,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  startButton: {
    width: 220,
    height: 36,
    borderWidth: 1.8,
    borderRadius: 0,
    borderColor: "#f09ab8",
    alignItems: "center",
    justifyContent: "center",
  },
  startButtonText: {
    width: 195,
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 1,
    textAlign: "center",
    color: "#f09ab8",
  },
  lsfDailyHeader: {
    color: "#fff",
    marginTop: 20,
    fontWeight: "bold",
    fontFamily: "SF Pro Text",
    fontSize: 24,
    marginBottom: 10,
  },
  DOWHeaderText: {
    width: "100%",
    height: 55,
    fontFamily: "SF Pro Text",
    fontSize: 42,
    fontWeight: "900",
    fontStyle: "normal",
    letterSpacing: 8,
    textAlign: "center",
    color: "#ffffff",
    marginTop: 10,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  daily10Button: {
    width: 220,
    height: 36,
    borderWidth: 2,
    borderRadius: 0,
    borderColor: "#fff",
    backgroundColor: "#f09ab8",
    alignItems: "center",
    justifyContent: "center",
  },
  daily10ButtonText: {
    width: 195,
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 1,
    textAlign: "center",
    color: "#fff",
  },
  bonusMessage: {
    fontFamily: "Sofia Pro",
    fontSize: 20,
    color: "#ec568f",
    fontWeight: "900",
  },
  bonusText: {
    // width: 195,
    height: 15,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 1,
    textAlign: "center",
    color: "#f09ab8",
  },
  logWorkoutButton: {
    width: 220,
    height: 52,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logWorkoutButtonText: {
    width: 195,
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 1,
    textAlign: "center",
    color: "#fff",
  },
  descriptions: {
    fontFamily: "SF Pro Text",
    fontSize: 32,
    lineHeight: 32,
    fontWeight: "900",
    fontStyle: "normal",
    letterSpacing: 2,
    textAlign: "center",
    color: "#FFF",
    marginTop: 40,
    marginBottom: 20,
    textShadowColor: color.hotPink,
    textShadowRadius: 2,
  },
  ssuDOWHeaderText: {
    width: "100%",
    height: 55,
    fontFamily: "SF Pro Text",
    fontSize: 44,
    fontWeight: "900",
    fontStyle: "normal",
    letterSpacing: 10,
    textAlign: "center",
    color: "#ffffff",
    marginTop: 10,
  },
  closeImgContainerStyle: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    top: 10,
    left: 10,
  },
  videoContainer: {
    height: videoContainerHeight,
    width: videoContainerWidth,
    backgroundColor: "#b2b2b2",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    zIndex: 0,
    overflow: "hidden",
    flexDirection: "column",
  },
  videoContainerBottom: {
    top: 30,
    height: videoContainerHeight - 22,
    marginLeft: videoContainerWidth * 0.15,
    width: videoContainerWidth * 0.7,
    backgroundColor: "#a2a2a2",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    position: "absolute",
    flexDirection: "column",
  },
  subTitle: {
    width: width - 100,
    height: 25,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    color: "black",
    flexWrap: "wrap",
  },
  highlighText: {
    width: width - 100,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    textAlign: "center",
    color: colorNew.textPink,
    flexWrap: "wrap",
  },
  gearTitleText: {
    width: "100%",
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    paddingLeft: 5,
    color: "#000",
    marginTop: 10,
  },
  bonusVideoTitleText: {
    width: "100%",
    fontFamily: "SF Pro Text Regular",
    fontSize: 20,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    paddingLeft: 5,
    color: "#000",
    marginTop: 10,
  },
  bonusVideoSubTitleText: {
    width: "100%",
    fontFamily: "SF Pro Text Regular",
    fontSize: 20,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    paddingLeft: 5,
    color: "#000",
  },
  headerTitle: {
    color: color.hotPink,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
  },
};
