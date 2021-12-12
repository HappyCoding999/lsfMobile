import React, { Component } from "react";
import {
  View,
  ImageBackground,
  InteractionManager,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Linking,
  Modal,
  Alert,
  FlatList,
  Animated,
  TouchableHighlight,
  Platform,
  AsyncStorage,
} from "react-native";
import { createStackNavigator, NavigationActions } from "react-navigation";
import { color, colorNew } from "../../modules/styles/theme";
import Goals from "../Profile/tabs/Goals/Goals";
import { User, getDaily10, getHasSeenHowItWorks } from "../../DataStore";
import { EventRegister } from "react-native-event-listeners";
import { sortBy, uniqBy, isEmpty } from "lodash";
import InstagramShareModal from "../InstagramShareModal";
import Profile from "../Profile";
import Settings from "../Settings";
import ShareModal from "../ShareModal";
import DailySweat from "../Daily10/DailySweat";
import DailySweatCompletion from "../Daily10/DailySweatCompletion";
import ExplainerScreen from "../ExplainerScreen";
import HydrationTracker from "../HydrationTracker";
import PremiumEndScreen from "../PremiumEndScreen";
import Journal from "../Journal";
import InviteFriend from "../InviteFriend";
import SelfCareLog from "../SelfCareLog";
import * as AddCalendarEvent from "react-native-add-calendar-event";
import moment from "moment";
import { captureRef } from "react-native-view-shot";
import Spotify from "rn-spotify-sdk";
import Playlists from "../Workouts/Playlists";
import Video from "react-native-video";
import Wave from "react-native-waveview";

import {
  LoadingComponent,
  GradientHeader,
  GoalViewForHeader,
  WeekViewForHeader,
  WeekDropDownOptionView,
} from "../../components/common";
import { getWeeklyWorkoutSchedule } from "../../utils";
import Svg, { Text as SvgText, TSpan } from "react-native-svg";
import ChallengeDashboard from "../ChallengeDashboard";
import { WebView } from "react-native-webview";
import { Header } from "react-native-elements";
import CompletionModal from "../Workouts/CompletionModalStack";
import LinearGradient from "react-native-linear-gradient";
import {
  bottle_blank,
  bottle_fill,
  gear,
  lightning_bolt,
  goal_workout_status,
  goal_plus_rounded,
  home_invite_friend,
  home_motivate_me,
  home_shop,
  home_video_library,
  goal_feel_hapier,
  logo_white_love_seat_fitness,
  goal_build_edurance,
  goal_eat_halthier,
  day_uncheck_roundec,
  day_check_roundec,
  icon_star_gradient,
  cancel_round_cross,
  challenge_pink_mark_rounded,
  getInspired,
  be_empowered,
} from "../../images";

import Share from "react-native-share";
import RNFS, {
  TemporaryDirectoryPath,
  DocumentDirectoryPath,
} from "react-native-fs";
import { SmallButtonAnimated } from "../../components/common/AnimatedComponents/SmallButtonAnimated";
import { CheckmarkFlipAnimation } from "../../components/common/AnimatedComponents/CheckmarkFlipAnimation";
import ArrowToggle from "../../components/common/ArrowToggle";
import ExpandingBanner from "../../components/common/ExpandingBanner";
import HomeHeader from "../Header/HomeHeader";
import { WeekView } from "./WeekView";
import WeekDropDown from "./WeekDropDown";
import SweatStreak from "../Goals/GoalCards/SweatStreak";
import { UPDATE_WEEKLY_SCHEDULE } from "../../actions/types";

const { height, width } = Dimensions.get("window");

const itemRatio = 125 / 160;

const headerHeight = 200;

const utcDateToString = (momentInUTC) => {
  let s = moment.utc(momentInUTC).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  // console.warn(s);
  return s;
};

export default class extends Component {
  constructor(props) {
    super(props);

    this.renderGridItem = this.renderGridItem.bind(this);
    this._bottomButtonClick = this._bottomButtonClick.bind(this);
    this._viewAllClicked = this._viewAllClicked.bind(this);
    this._shareFor = this._shareFor.bind(this);
    this._share = this._share.bind(this);
    this.renderNameAlert = this.renderNameAlert.bind(this);
    this._retrieveData = this._retrieveData.bind(this);

    this.listener = undefined;
    this.tabChangeListener = undefined;

    this.state = {
      currentDay: null,
      bottles: 0,
      bottleCount: 0,
      quote:
        "Exercise is a celebration of what your body can do. Not a punishment for what you ate.",
      selfCareImage: "",
      showGoalView: false,
      showWeekOptionView: false,
      showInspoModal: false,
      showShareModal: false,
      showNameAlert: false,
      showNameAlertStoredValue: false,
      shareForSize: "snapshotStory",
      // showJournalModal: false,
      showDailySweatModal: false,
      showHydrationTracker: false,
      showExplainerModals: false,
      showDailySweatCompletionModal: false,
      showSelfCareModal: false,
      showQuoteModal: false,
      showInviteFriend: false,
      shareImage: "",
      spotifyInitialized: false,
      spotifyLoggedIn: false,
      playlist: "",
      showPlaylist: false,
      trackList: [],
      showNutritionPlanModal: false,
      showCompletionModal: false,
      joinedChallenge: false,
      selfLoveData: null,
    };
  }
  async componentDidMount() {
    const hasSeeHowItWorks = await getHasSeenHowItWorks();
    this._retrieveData();
    InteractionManager.runAfterInteractions(() => {
      // ...long-running synchronous task...
      console.log("Vishal : called when interaction happen");
      this.setState({ showNameAlert: true });
    });
    this.tabChangeListener = EventRegister.addEventListener(
      "openTab",
      (data) => {
        console.log("Vishal - fire openTab Today");
        console.log(data);
        console.log("Vishal - fire openTab Today 1");
        this.props.navigation.navigate(data);
      }
    );
    this.listener = EventRegister.addEventListener(
      "isChallengeJoined",
      (data) => {
        console.log("Vishal - fire isD10CompletedForToday");
        console.log(data);
        this.setState({
          joinedChallenge: true,
        });
      }
    );
    // Initial Paywall
    EventRegister.emit("paywallEvent", () => {});

    if (!hasSeeHowItWorks) {
      this.props.navigation.navigate("HowItWorks");
    }

    Spotify.isInitializedAsync()
      .then((result) => {
        if (!result) {
          // initialize spotify
          var spotifyOptions = {
            clientID: "844fd0f2a4ff452c9ce51f323ea667ff",
            sessionUserDefaultsKey: "SpotifySession",
            redirectURL: "lsfapp://spotify",
            scopes: [
              "user-read-private",
              "playlist-read",
              "playlist-read-private",
              "streaming",
            ],
            // "tokenSwapURL" : "https://lsf-development.firebaseapp.com:3000/swap",
            // "tokenRefreshURL" : "https://lsf-development.firebaseapp.com:3000/refresh"
          };
          Spotify.initialize(spotifyOptions)
            .then((result) => {
              // update UI state
              this.setState({ spotifyInitialized: result });
              // handle initialization
              // console.log('spotify has been initialized');
            })
            .catch((error) => {
              Alert.alert("Error", error.message);
            });
        } else {
          // update UI state
          this.setState({ spotifyInitialized: result });

          // handle logged in
          Spotify.isLoggedInAsync()
            .then((result) => {
              console.log("isLoggedInAsync: ", result);
              this.setState({ spotifyLoggedIn: result });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // this._retrievePlaylistData();

    this.props.screenProps.closeLoadingModal();

    // let handle = InteractionManager.createInteractionHandle();
    // console.log("called when interaction happen")
    // this.setState({ showNameAlert: true })
    // InteractionManager.clearInteractionHandle(handle);
  }
  componentDidUpdate(prevProps) {
    const { showHowItWorks: prevShowHowItWorks } = prevProps.screenProps.user;
    const { showHowItWorks } = this.props.screenProps.user;

    if (!prevShowHowItWorks && showHowItWorks) {
      this.props.navigation.navigate("HowItWorks");
    }
  }
  componentWillUnmount() {
    console.log("componentWillUnmount");

    if (this.tabChangeListener != undefined) {
      EventRegister.removeEventListener(this.tabChangeListener);
    }
    if (this.listener != undefined) {
      EventRegister.removeEventListener(this.listener);
    }
  }
  componentWillReceiveProps(props) {
    // const { weeklyWorkoutSchedule, weeklyProgram } = props.screenProps;
    // if (weeklyWorkoutSchedule && weeklyWorkoutSchedule.today) {
    // } else {
    //   this.getNewData(weeklyProgram);
    // }
    // console.log("componentWillReceiveProps called in today.js")
    // console.log(props);
    // const { joinedChallenge } = props.screenProps;
    // console.log("joinedChallenge : => " + joinedChallenge);
    // this.setState({ joinedChallenge });
  }

  getNewData = async (workoutsForWeek) => {
    var data = await getWeeklyWorkoutSchedule(workoutsForWeek || []);

    const { saveWeeklyWorkout } = this.props.screenProps;
    saveWeeklyWorkout(data);

    // return (dispatch) => {
    //   dispatch({
    //     type: UPDATE_WEEKLY_SCHEDULE,
    //     payload: { weeklyWorkoutSchedule: data },
    //   });
    // };

    // alert(JSON.stringify(data));
  };

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
  _retrieveData = async () => {
    console.log("Vishal : _retrieveData called");
    try {
      const value = await AsyncStorage.getItem("LASTNAME_POPUP");
      console.log("Vishal : value => ");
      console.log(value);
      if (value !== null) {
        // We have data!!
        this.setState({
          showNameAlertStoredValue: false,
        });
      } else {
        this.setState({
          showNameAlertStoredValue: true,
        });
      }
    } catch (error) {
      console.log(error.stack);
    }
  };
  renderNameAlert() {
    const { weeklyWorkoutSchedule, user } = this.props.screenProps;

    if (
      weeklyWorkoutSchedule &&
      weeklyWorkoutSchedule.today &&
      user.lastname == undefined &&
      this.state.showNameAlert &&
      this.state.showNameAlertStoredValue
    ) {
      this.setState({ showNameAlert: false });
      AsyncStorage.setItem("LASTNAME_POPUP", JSON.stringify(true));
      setTimeout(() => {
        Alert.alert(
          "",
          "Hey girlfriend! We need to update your profile to include your first and last name. Is now a good time for you to do that?",
          [
            { text: "Yes", onPress: this.redirectONProfilePage.bind(this) },
            { text: "No", onPress: () => console.log("Cancel Pressed!") },
          ],
          { cancelable: false }
        );
      }, 1000);
    }
    return null;
  }
  render() {
    const { completedWorkouts, weeklyWorkoutSchedule, challengeActive, goals } =
      this.props.screenProps;

    this.completedWorkoutsWeek = completedWorkouts;

    if (weeklyWorkoutSchedule && weeklyWorkoutSchedule.today) {
      return (
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              backgroundColor: "#fff",
              marginTop: headerHeight,
            }}
          >
            {this.renderThisWeek()}
            {this.renderSelfCareView()}
            {this.renderDaily10View()}
            <SweatStreak isForToday={true} />
            {this.renderChallengeView()}
            <View
              style={{
                width: "90%",
                height: 1,
                backgroundColor: "#ddd",
                marginLeft: "5%",
                marginTop: 20,
              }}
            />
            {this.renderDailyMotivationView()}
            <View
              style={{
                width: "90%",
                height: 1,
                backgroundColor: "#ddd",
                marginLeft: "5%",
                marginTop: 20,
              }}
            />
            {this.renderBottomButtons()}
            {this.manageScrollviewOffset()}
            {this.renderSelfcareModal()}
          </ScrollView>
          {this.renderWeek()}
          {this.renderHeader()}
          {this.renderGoalView()}
          {this.renderShare()}
          {this._renderDaily10Modals()}
          {this._renderHydrationTracker()}
          {this._renderJournalModals()}
          {this._renderExplainerModals()}
          {this._renderQuote()}
          {this._renderInviteFriend()}
          {this._renderNutritionPlanModal()}
          {this.renderNameAlert()}
          <InstagramShareModal
            shareImage={this.state.shareImage}
            visible={this.state.showInspoModal}
            quote={this.state.quote}
            onClose={() => this._closeInspoModal()}
            onPostSuccessful={() => console.log("post successful")}
          />
        </View>
      );
    } else {
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
  }
  _renderNutritionPlanModal() {
    const { nutritionPlanLink } = this.props.screenProps;

    return (
      <Modal
        animationType="slide"
        visible={this.state.showNutritionPlanModal}
        onRequestClose={() => {}}
      >
        <View style={{ flex: 1 }}>
          <Header
            leftComponent={
              <TouchableOpacity
                onPress={() => {
                  this.setState({ showNutritionPlanModal: false });
                }}
              >
                <Image source={require("./images/iconXPink.png")} />
              </TouchableOpacity>
            }
            centerComponent={{
              text: "NUTRITION PLANS",
              style: styles.headerTitle,
            }}
            backgroundColor={"#ffffff"}
            outerContainerStyles={{ borderBottomWidth: 0 }}
          />
          <WebView source={{ uri: nutritionPlanLink }} />
        </View>
      </Modal>
    );
  }
  increaseBottles = () => {
    this.setState({
      bottles: this.state.bottles + 30,
      bottleCount: this.state.bottleCount + 1,
    });

    if (this.state.bottleCount < 4) {
      {
        this._waveRect &&
          this._waveRect.setWaterHeight(this.state.bottles + 30);
      }
    }
  };
  decreaseBottles = () => {
    if (this.state.bottleCount === 0) {
      return;
    }
    this.setState({
      bottles: this.state.bottles - 30,
      bottleCount: this.state.bottleCount - 1,
    });

    if (this.state.bottleCount <= 4) {
      {
        this._waveRect &&
          this._waveRect.setWaterHeight(this.state.bottles - 30);
      }
    }
  };
  redirectONProfilePage() {
    this.props.navigation.navigate("EditProfile", {
      ...this.props.screenProps,
    });
    // this.props.navigation.navigate('Settings',{
    //             backToScreen: 'Today',
    //           })
    // setTimeout(() => {
    //   this.props.navigation.navigate("EditProfile", { ...this.props.screenProps})
    // }, 100)
  }
  spotifyLoginButtonWasPressed = () => {
    // log into Spotify
    Spotify.login()
      .then((result) => {
        this.setState({ spotifyLoggedIn: result });
      })
      .catch((error) => {
        // error
        Alert.alert("Error", error.message);
      });
  };
  spotifyFreeButtonPressed() {
    Linking.openURL("spotify://open");
  }
  closePlaylist = () => {
    const { currentPlaylist } = this.props.screenProps;
    this.setState(
      {
        showPlaylist: false,
      },
      () => this.setPlaylist(currentPlaylist)
    );
  };
  // _prepWeekdata(completed, workoutsForWeek) {
  //   return getWeeklyWorkoutSchedule(workoutsForWeek || []);
  // }
  _prepWeekdata(workoutsForWeek) {
    return getWeeklyWorkoutSchedule(workoutsForWeek || []);
  }
  _showInspiration() {
    captureRef(this.refs["snapshot"], {
      format: "jpg",
      quality: 0.8,
    }).then(
      (uri) =>
        this.setState({
          showInspoModal: true,
          showQuoteModal: true,
          shareImage: uri,
        }),
      (error) => alert("Oops, snapshot failed", error)
    );
  }
  _closeInspoModal() {
    this.setState({
      showInspoModal: false,
    });
  }
  _closeShareModal() {
    this.setState({
      showShareModal: false,
    });
  }
  setPlaylist = (playlist) => {
    if (this.state.showPlaylist === true) {
      this.setState({ showPlaylist: false });
    }

    this.setTrackList(playlist);
  };
  setTrackList = (playlist) => {
    const params = { Authorization: "playlist-read-private", limit: 50 };

    const basePrefix = "https://api.spotify.com/";
    const getTracks = playlist.tracks.href.replace(basePrefix, "");

    if (this.state.spotifyLoggedIn || this.state.spotifyInitialized) {
      Spotify.sendRequest(getTracks, "GET", params, true)
        .then((result) => {
          this.setState({
            playlist: playlist,
            trackList: result.items,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  renderShare() {
    const { showShareModal } = this.state;
    return (
      <View>
        <ShareModal
          visible={showShareModal}
          onClose={() => this._closeShareModal()}
        />
      </View>
    );
  }
  renderHydration() {
    const { bottles, bottleCount } = this.state;

    return (
      <View style={this.elevationShadowStyle(5)}>
        <View style={styles.hydrationHeading}>
          <Image
            style={{ width: "90%", resizeMode: "contain" }}
            source={require("./images/hydrationTracker.png")}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 60,
              width: 120,
              left: 25,
            }}
          >
            <TouchableOpacity onPress={this.decreaseBottles}>
              <Image
                style={{ height: "100%", resizeMode: "contain" }}
                source={require("./images/stepperDown.png")}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.waterContainer}>
            <Wave
              ref={(ref) => (this._waveRect = ref)}
              style={styles.wave}
              H={bottles}
              waveParams={[
                { A: 10, T: 180, fill: "#62c2ff" },
                { A: 15, T: 140, fill: "#0087dc" },
                { A: 20, T: 100, fill: "#1aa7ff" },
              ]}
              animated={true}
            />
            <View style={{ flex: 1, width: 85, height: 160 }}>
              <Image
                style={{
                  backgroundColor: "transparent",
                  width: "100%",
                  height: "100%",
                  resizeMode: "contain",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                source={require("./images/waterBottle.png")}
              />
              <View style={{ flex: 1, alignItems: "center", top: 6 }}>
                <Text
                  adjustsFontSizeToFit={true}
                  allowFontScaling={false}
                  style={styles.waterBottleText}
                >
                  {bottleCount != 0 ? bottleCount : ""}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 60,
              width: 120,
              right: 25,
            }}
          >
            <TouchableOpacity onPress={this.increaseBottles}>
              <Image
                style={{ height: "100%", resizeMode: "contain" }}
                source={require("./images/stepperUp.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 32,
          }}
          //onPress={() => EventRegister.emit("paywallEvent", this._openHydrationTrackerModal)}
          onPress={this._openHydrationTrackerModal}
        >
          <View
            style={{
              width: 150,
              height: 36,
              borderColor: "#f09ab8",
              borderRadius: 0,
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text allowFontScaling={false} style={styles.logButtonText}>
              LOG {bottleCount} BOTTLES
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  renderCurrentChallenge = () => {
    this.props.screenProps.startWorkout = this._startWorkout;
    this.props.screenProps.openDailySweatModal = this._openDailySweatModal;

    const {
      challengeFlag,
      lotsOfLoveChallenge,
      springSlimDownChallenge,
      currentChallengeImage,
      user,
      joinedChallenge,
    } = this.props.screenProps;
    // const { joinedChallenge } = this.state;
    console.log("joinedChallenge");
    console.log(joinedChallenge);

    console.log("latestChallenge");
    console.log(latestChallenge);

    console.log("current user data");
    console.log(user);

    return (
      <View style={this.elevationShadowStyle(5)}>
        <View style={[this.shadowTop(5), { flex: 1 }]}>
          <View style={styles.currentChallengeBox}>
            <Text allowFontScaling={false} style={styles.currentChallengeText}>
              CURRENT CHALLENGE
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              width: "100%",
              height: 150,
              backgroundColor: "#e16d92",
            }}
          >
            <Image
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                resizeMode: "contain",
              }}
              source={{ uri: currentChallengeImage }}
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              marginTop: 1,
              width: "100%",
              height: 80,
              backgroundColor: "#e16d92",
            }}
          >
            <TouchableOpacity
              style={{
                fleX: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => this._joinChallenge()}
            >
              <View style={styles.joinButtonBox}>
                <Text style={styles.joinText}>
                  {springSlimDownChallenge ? "START NOW" : "JOIN NOW"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  _joinChallenge = () => {
    console.log("_joinChallenge clicked");
    const { springSlimDownChallenge } = this.props.screenProps;
    console.log(springSlimDownChallenge);

    // // place a flag in the user object to show that they joined the challenge
    // if (!springSlimDownChallenge) {
    //   // save user email for tracking
    //   console.log("_joinChallenge clicked 2");
    //   // this.props.screenProps.flagChallenge();
    // }
    console.log("_joinChallenge clicked 3");
    this.props.navigation.navigate("ChallengeDashboard");
  };
  renderRow = (data) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontSize: 10, color: color.white }}>{"\u2022"}</Text>
        <Text style={styles.challengeBullet}>{data}</Text>
      </View>
    );
  };
  _selectPlaylist = () => {
    const {
      spotifyLoggedIn,
      spotifyAuthCancelled,
      authorizeSpotify,
      fetchPlaylistData,
      resetSpotifyAuthFlow,
    } = this.props.screenProps;
    if (spotifyAuthCancelled) {
      return resetSpotifyAuthFlow();
    }

    if (spotifyLoggedIn) {
      fetchPlaylistData().then(() => this.setState({ showPlaylist: true }));
    } else {
      // this.spotifyLoginButtonWasPressed();
      authorizeSpotify()
        .then(this._selectPlaylist)
        .catch((err) => Alert.alert(err));
    }
  };
  renderTodayMoves() {
    const { daily10 } = this.props.screenProps;

    if (daily10 !== null) {
      return (
        <View>
          <View style={styles.heading}>
            <Image source={require("./images/lsfDaily10.png")} />
          </View>
          <View
            style={{
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <View style={styles.pinkQuote}>
              <Text allowFontScaling={false} style={styles.quoteText}>
                Your daily 10 minute workout
              </Text>
            </View>
          </View>
          <View style={styles.scrollContainer}>
            <View style={styles.circleCell}>
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: 60,
                }}
              >
                {/* <Image style={{ width: 125, height: 125 }} source={{ url: daily10.move1ImageUrl }} /> */}
                <Video
                  style={{ height: 170, width: 155, top: -60, left: -25 }}
                  source={{ uri: daily10.move1ImageUrl }}
                  repeat={true}
                  resizeMode={"cover"}
                />
              </View>
            </View>
            <View style={styles.circleCell}>
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: 60,
                }}
              >
                {/* <Image style={{ width: 125, height: 125 }} source={{ uri: daily10.move2ImageUrl }} /> */}
                <Video
                  style={{ height: 170, width: 155, top: -60, left: -25 }}
                  source={{ uri: daily10.move2ImageUrl }}
                  repeat={true}
                  resizeMode={"cover"}
                />
              </View>
            </View>
            <View style={styles.circleCell}>
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: 60,
                }}
              >
                {/* <Image style={{ width: 125, height: 125 }} source={{ uri: daily10.move3ImageUrl }} /> */}
                <Video
                  style={{ height: 170, width: 155, top: -60, left: -25 }}
                  source={{ uri: daily10.move3ImageUrl }}
                  repeat={true}
                  resizeMode={"cover"}
                />
              </View>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={this._openDailySweatModal}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                margin: 14,
                top: height * 0.03,
              }}
            >
              <Image source={require("./images/todaysMovesButton.png")} />
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  }
  renderDaily10() {
    let { daily10 } = this.props.screenProps;

    // start/end of week millisecond timestamp
    const dayOfTheWeek = moment().format("dddd");

    return (
      <View style={this.elevationShadowStyle(5)}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fae8ee",
            top: 0,
            left: 0,
            width: "100%",
            height: 60,
          }}
        >
          <Image
            style={{ width: "90%", resizeMode: "contain" }}
            source={require("./images/daily10Header.png")}
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
            <View style={{ flex: 1, justifyContent: "center", top: 20 }}>
              <Text allowFontScaling={false} style={styles.ssuDOWHeaderText}>
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
            justifyContent: "center",
            backgroundColor: "#fae8ee",
            top: 0,
            left: 0,
            width: "100%",
            height: 70,
          }}
        >
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            activeOpacity={0.5}
            onPress={this._openDailySweatModal}
            disabled={!isEmpty(daily10) ? false : true}
          >
            <View style={styles.startButton}>
              <Text allowFontScaling={false} style={styles.startButtonText}>
                GET TODAY'S MOVES
              </Text>
            </View>
          </TouchableOpacity>
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
  reloadDaily10 = async () => {
    const { _fetchDaily10 } = this.props.screenProps;

    try {
      let daily10 = await _fetchDaily10();
    } catch (error) {
      console.log("error reloading daily 10 data");
    }
  };
  _openHydrationTrackerModal = () => {
    console.log("_openHydrationTrackerModal clicked");
    this.setState({
      showHydrationTracker: true,
    });
  };
  _closeHydrationTrackerModal = () => {
    console.log("HydrationTrackerModal");
    this.setState({ showHydrationTracker: false });
  };
  _openDailySweatModal = () => {
    this.setState({
      showDailySweatModal: true,
    });
    // this.setState({
    //   showJournalModal: true
    // });
  };
  _closeDailySweatModal = () => {
    console.log("close");
    this.setState({ showDailySweatModal: false });
    //this.setState({ showJournalModal: false });
  };
  _closeDaily10CompletionModal = () => {
    // const { joinedChallenge } = this.props.screenProps;
    // const { joinedChallenge } = this.state;
    try {
      if (
        this.props.screenProps.joinedChallenge ||
        this.state.joinedChallenge
      ) {
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
          name: "d10",
        });
        EventRegister.emit("isD10CompletedForToday", {
          createdAt,
          validPurchase,
          workoutName: "d10",
        });
      }
    } catch (ex) {}

    this.setState({
      showDailySweatCompletionModal: false,
    });
  };
  _renderJournalModals() {
    // const { showJournalModal} = this.state;
    // return (
    //   <View>
    //     <Journal
    //       visible={showJournalModal}
    //       onClose={this._closeDailySweatModal}
    //       navigation={this.props.navigation}
    //     />
    //   </View>
    // );
  }
  _closeExplainerModals = () => {
    console.log("_closeExplainerModals");
    this.setState({ showExplainerModals: false });
  };
  _renderExplainerModals() {
    const { showExplainerModals } = this.state;
    if (showExplainerModals) {
      console.log("showExplainerModals");
    }
    return (
      <View style={{ backgroundColor: "transparent" }}>
        <ExplainerScreen
          visible={showExplainerModals}
          onClose={this._closeExplainerModals}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
  _renderHydrationTracker() {
    const { showHydrationTracker } = this.state;
    return (
      <View>
        <HydrationTracker
          visible={showHydrationTracker}
          screenProps={this.props.screenProps}
          onClose={this._closeHydrationTrackerModal}
          animType="none"
        />
      </View>
    );
  }
  _shareSelectedSize() {
    console.log("_shareSelectedSize");
    var shareViewRef = this.snapshotStory;
    if (this.state.shareForSize == "snapshotSquare") {
      shareViewRef = this.snapshotSquare;
    }
    this._shareFor(shareViewRef);
  }
  _selectShareSize(shareViewRef) {
    console.log("_selectShareSize");
    console.log(shareViewRef);
    this.setState({
      shareForSize: shareViewRef,
    });
  }
  _renderQuote() {
    const { showQuoteModal } = this.state;
    const { quote } = this.props.screenProps;
    const containerWidth = width * 0.9 * 0.95;
    const innerContainerWidth = containerWidth * 0.45;
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
                            flex: 0.9,
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
                            allowFontScaling={true}
                            style={{
                              ...styles.modalHeaderText,
                              width: innerContainerWidth * 0.75,
                              color: "#fff",
                              fontWeight: "bold",
                              marginTop: 0,
                              marginBottom: 5,
                              fontSize: 18,
                              lineHeight: 30,
                              height: 25 * 5,
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
                  height: "85%",
                  flexDirection: "row",
                  marginTop: 20,
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
                    height: "75%",
                    marginTop: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 20,
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      height: "95%",
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
                            {quote}
                          </Text>
                        </ImageBackground>
                      </LinearGradient>
                    </View>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      height: "15%",
                      justifyContent: "flex-end",
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
              <TouchableOpacity
                style={{
                  width: "40%",
                  marginRight: 10,
                  marginLeft: "55%",
                  height: 40,
                  top: 20,
                  marginBottom: 0,
                  position: "absolute",
                }}
                onPress={() => this.hideQuoteModal()}
              >
                <Image
                  style={{
                    width: "90%",
                    marginRight: 25,
                    marginLeft: "80%",
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
              <TouchableOpacity
                style={{
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => this._shareSelectedSize()}
              >
                <Text
                  allowFontScaling={false}
                  style={{
                    width: "90%",
                    fontFamily: "SF Pro Text",
                    fontSize: 18,
                    fontStyle: "normal",
                    letterSpacing: 0,
                    textAlign: "center",

                    fontWeight: "bold",
                    color: "#fff",
                    // height: 30,
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
  _renderQuoteOld() {
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
                    ref="snapshot"
                    style={{
                      width: "92%",
                      height: "92%",
                      marginTop: 30,
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
              <TouchableOpacity onPress={() => this.hideQuoteModal()}>
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
    this.setState({
      showDailySweatModal: false,
      showDailySweatCompletionModal: true,
    });
  };
  addToCalendar = (title, startDateUTC) => {
    title = title != undefined ? title : "";

    const eventConfig = {
      title,
      startDate: utcDateToString(startDateUTC),
      endDate: utcDateToString(moment.utc(startDateUTC).add(1, "hours")),
      notes: "Love Sweat Fitness" + title,
    };

    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then((eventInfo) => {
        console.warn(JSON.stringify(eventInfo));
      })
      .catch((error) => {
        // handle error such as when user rejected permissions
        console.warn(error);
      });
  };
  renderGoals() {
    const {
      goals,
      achievements,
      historicalWeight,
      measurements,
      saveWeightGoal,
      saveWeight,
    } = this.props.screenProps;
    const { headerQuote, hightlightCardData } = this.props;
    return (
      <View
        style={[
          this.elevationShadowStyle(5),
          { flex: 1, alignItems: "center" },
        ]}
      >
        <View style={styles.highlightHeading}>
          <Text allowFontScaling={false} style={styles.headingText}>
            #GOALS
          </Text>
        </View>
        <View style={styles.highlightContainer}>
          <Goals
            horizontal={true}
            goals={goals}
            achievements={achievements}
            historicalWeight={historicalWeight}
            measurements={measurements || []}
            saveWeightGoal={saveWeightGoal}
            saveWeight={saveWeight}
          />
        </View>
      </View>
    );
  }
  _navigationLeftButtonPressed() {
    console.log("_navigationLeftButtonPressed");
    this.props.navigation.navigate("Settings", {
      backToScreen: "Today",
    });
  }
  _navigationRightButtonPressed() {
    console.log("_navigationRightButtonPressed");
    let showGoalView = !this.state.showGoalView;
    this.setState({ showGoalView });
  }
  _weekButtonPressed() {
    console.log("_weekButtonPressed");
    let showWeekOptionView = !this.state.showWeekOptionView;
    this.setState({ showWeekOptionView });
  }
  renderHeader() {
    const colors = [colorNew.lightPink, colorNew.darkPink];
    return (
      <View
        style={[
          {
            width: "100%",
            height: 100,
            position: "absolute",
            justifyContent: "flex-end",
          },
        ]}
      >
        <HomeHeader
          containerStyle={{ paddingBottom: 0 }}
          onRightPressed={this._navigationLeftButtonPressed.bind(this)}
        />
      </View>
    );
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
            marginTop: 100,
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
        item.flag
        // && day.getDay() == item.day
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
        item.flag
        // && day.getDay() == item.day
      ) {
        isSelfCareCompleted = true;
      }
    }
    return isSelfCareCompleted;
  }
  onLevelSelected = () => {
    console.log("onLevelSelected");
    this.props.navigation.navigate("SettingsLevel");
  };
  renderWeek() {
    const { level, currentWeek, completedWorkouts, weeklyWorkoutSchedule } =
      this.props.screenProps;
    const { completed } = weeklyWorkoutSchedule;
    var isSelfCareCompleted = this.checkIfSelfCareCompletedOrNot();
    let weekData = this.getWeekData();
    const { weekDayStyle } = styles;

    // alert("weekData: " + JSON.stringify(weekData));

    return (
      <View
        style={[
          {
            flexDirection: "column",
            width: "100%",
            marginTop: 100,
            position: "absolute",
          },
        ]}
      >
        <WeekView
          {...this.props}
          level={level}
          completed={weekData}
          currentWeek={currentWeek}
          isSelfCareCompleted={isSelfCareCompleted}
        />
        <WeekDropDown
          onLevelSelected={this.onLevelSelected}
          level={level}
          currentWeek={currentWeek}
          completedWorkouts={this.props.screenProps.completedWorkouts}
        />
      </View>
    );
  }
  renderWeekDayCellView(isSelected, text) {
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
        {isSelected ? (
          <Image
            source={day_check_roundec}
            resizeMode="cover"
            style={{ width: 25, height: 25, tintColor: "#fff" }}
          />
        ) : (
          <Image
            source={day_uncheck_roundec}
            resizeMode="cover"
            style={{ width: 25, height: 25, tintColor: "#fff" }}
          />
        )}
        <Text allowFontScaling={false} style={weekDayStyle}>
          {text}
        </Text>
      </View>
    );
  }
  renderWeekDayCellViewForGoal(isSelected) {
    const height_width = 12;
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
        {isSelected ? (
          <Image
            source={day_check_roundec}
            resizeMode="cover"
            style={{
              width: height_width,
              height: height_width,
              tintColor: colorNew.darkPink,
            }}
          />
        ) : (
          <Image
            source={day_check_roundec}
            resizeMode="cover"
            style={{
              width: height_width,
              height: height_width,
              tintColor: "#fff",
            }}
          />
        )}
      </View>
    );
  }
  _viewAllClicked() {
    // const { completedWorkouts, weeklyWorkoutSchedule, challengeActive } = this.props.screenProps;
    // let newParam = {completedWorkouts,weeklyWorkoutSchedule}
    let weekData = this.getWeekData();
    var workout = this.getSelfcareWorkoutForCurrentWeek();
    weekData.push(workout);
    weekData.sort(function (a, b) {
      return a.day > b.day;
    });
    let newParam = { weekData };
    this.props.navigation.navigate("WeekAtGlance", newParam);
  }
  getWeekData() {
    const { completedWorkouts, weeklyWorkoutSchedule, challengeActive } =
      this.props.screenProps;
    const { completed } = weeklyWorkoutSchedule;

    var weekData = [];
    var cw = [];

    if (completedWorkouts != undefined && completedWorkouts.length > 0) {
      cw = completedWorkouts.filter(
        (e) =>
          e.level.toLowerCase() === this.props.screenProps.level.toLowerCase()
      );
    }

    if (cw != undefined && cw.length > 0) {
      for (let [tag, item] of Object.entries(cw)) {
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
            // console.log(item);
            var day = new Date(item.createdAt);
            // console.log(day.getDay());
            // console.log(item.day);

            // alert(
            //   "flag: " +
            //     item.flag +
            //     "\nLevel: " +
            //     item.level.toLowerCase() +
            //     " == " +
            //     this.props.screenProps.level.toLowerCase()
            // );

            if (
              day != "Invalid Date" &&
              this.props.screenProps.currentWeek == item.week &&
              item.flag &&
              item.level.toLowerCase() ==
                this.props.screenProps.level.toLowerCase()
            ) {
              weekData.push({ ...item, isCompleted: true });
            } else {
              weekData.push({ ...item, isCompleted: false });
            }
          }
        }
      }
    }

    if (completed != undefined && completed.length > 0) {
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
            var day = new Date(item.createdAt);
            if (
              day != "Invalid Date" &&
              this.props.screenProps.currentWeek == item.week &&
              item.flag &&
              item.level.toLowerCase() ==
                this.props.screenProps.level.toLowerCase()
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

  addInArrayAfter(array, index, newItem) {
    return [...array.slice(0, index), newItem, ...array.slice(index)];
  }

  renderThisWeek() {
    const { completedWorkouts, weeklyWorkoutSchedule, challengeActive } =
      this.props.screenProps;
    const { completed } = weeklyWorkoutSchedule;
    var isSelfCareCompleted = this.checkIfSelfCareCompletedOrNot();

    let weekData = this.getWeekData();

    // console.log("weekData:=- " + JSON.stringify(weekData));

    // --------------------------------------
    // Code for 7th (Self Love) Workout - Start
    // var workout = this.getSelfcareWorkoutForCurrentWeek();
    // try {
    //   var i = weekData.findIndex((e) => e.day === 6);
    //   if (i === weekData.length - 1) {
    //     weekData.push(workout);
    //   } else {
    //     weekData = this.addInArrayAfter(weekData, i + 1, workout);
    //   }
    // } catch (ex) {
    //   weekData.push(workout);
    // }
    // Code for 7th (Self Love) Workout - End
    // --------------------------------------

    var completedWorkoutsCount = 0;
    for (let [tag, item] of Object.entries(weekData)) {
      if (item.isCompleted) {
        completedWorkoutsCount = completedWorkoutsCount + 1;
      }
    }

    // if (completedWorkoutsCount == 6) {
    // }

    if (isSelfCareCompleted) {
      completedWorkoutsCount = completedWorkoutsCount + 1;
    }

    const showExpandingBanner = false;

    // console.log("completedWorkoutsCount: " + completedWorkoutsCount);

    return (
      <View style={[{ flex: 1 }]}>
        <View style={{ width: "100%" }}>
          {showExpandingBanner && (
            <ExpandingBanner headerText={"SOME TITLE"} contentsHeight={150}>
              <View style={{ paddingHorizontal: 15 }}>
                <Text allowFontScaling={false}>Some text here</Text>
              </View>
            </ExpandingBanner>
          )}

          <View
            style={{ width: "100%", marginLeft: "5%", flexDirection: "row" }}
          >
            <View
              style={{
                width: "63%",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <Text
                allowFontScaling={false}
                style={{ ...styles.headingTextBlackBig, paddingLeft: 0 }}
              >
                My Weekly Plan
              </Text>
            </View>
            <View
              style={{
                width: "20%",
                marginLeft: -17,
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <TouchableOpacity
                style={{ justifyContent: "space-around", padding: 10 }}
                activeOpacity={0.9}
                onPress={() => this._viewAllClicked()}
              >
                <Text allowFontScaling={false} style={styles.viewallTextBlack}>
                  VIEW ALL
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text
            allowFontScaling={false}
            style={{
              ...styles.headingTextBlackBig,
              marginLeft: "5%",
              paddingLeft: 0,
              fontSize: 15,
              fontWeight: "normal",
            }}
          >
            {completedWorkoutsCount}/7 Completed
          </Text>
          <View
            style={{
              // width: "100%",
              width: Dimensions.get("screen").width,
              height: height * 0.3,
              marginTop: 10,
              marginBottom: 10,
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <FlatList
              data={weekData}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              scrollEnabled={true}
              extraData={this.state}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    width: 10,
                    height: "100%",
                    backgroundColor: "transparent",
                  }}
                />
              )}
              style={{
                // width: "100%",
                width: Dimensions.get("screen").width,
                backgroundColor: "#fff",
                padding: 0,
              }}
              renderItem={this.renderGridItem}
              keyExtractor={(item, idx) => item + idx}
            />
          </View>
        </View>
      </View>
    );
  }
  renderGridItem = ({ item, index }) => {
    /*const { completedWorkouts, weeklyWorkoutSchedule, challengeActive } = this.props.screenProps;
    var totalData = 0
    if (weeklyWorkoutSchedule.today) {
        totalData = totalData + 1
    }
    if (weeklyWorkoutSchedule.upcomming) 
    {
      var isContaintRest = false
      for (let [tag, item] of Object.entries(weeklyWorkoutSchedule.upcomming)) {
        if (item.primaryType == "Rest") 
        {
          isContaintRest = true
        }
      };
      if (isContaintRest) 
      {
        totalData = totalData + weeklyWorkoutSchedule.upcomming.length - 1
      }
      else
      {
        totalData = totalData + weeklyWorkoutSchedule.upcomming.length  
      }
      
    }
    var isCompleted = false;
    if (completedWorkouts.length > 0) 
    {
      var count = [];
      for (let [tag1, item1] of Object.entries(completedWorkouts)) {
        if (item1.primaryType != "Rest" && this.props.screenProps.currentWeek == item1.week) 
        {
          if (count.filter(e => e.description === item1.description).length == 0) {
            if (item1.week == item.week && item1.day == item.day && item.week == this.props.screenProps.currentWeek) {

              isCompleted = true;
            }
            count.push(item1)
          }
        }
      };
      totalData = totalData + count.length;
    }*/
    let isCompleted = item.isCompleted;
    let itemHeight = height * 0.3 * 0.7;
    let itemWidth = width * 0.65;
    // let countText = (index + 1) + "/" + totalData
    const { primaryTag, secondaryTag, rounds } = item;
    var countText = "";
    if (!(item.description == "Cardio Sweat Sesh")) {
      if (
        rounds != undefined &&
        primaryTag != undefined &&
        secondaryTag != undefined
      ) {
        if (primaryTag.length > 0 || secondaryTag.length > 0) {
          countText =
            rounds +
            " Circuit " +
            (primaryTag.length + secondaryTag.length) +
            " Exercise";
        }
      } else if (rounds != undefined) {
        countText = rounds + " Circuit 1 Exercise";
      } else {
        // console.log("Round not found")
      }
    }

    let uri;
    if (item && item.imageUrl != undefined) {
      uri = { uri: item.imageUrl };
    } else {
      uri = { uri: null };
    }
    const { onVideoLibraryPress } = this.props;
    const colors = ["#f2c9cf10", "#C8C7CC"];
    return (
      <View
        style={{
          backgroundColor: "#fff",
          width: itemWidth,
          height: height * 0.3,
        }}
      >
        <TouchableOpacity
          style={{ justifyContent: "space-around", padding: 10 }}
          activeOpacity={0.9}
          onPress={() => this._startWorkout(item)}
        >
          <View
            style={[
              this.shadowBottomForGrid(5),
              {
                alignItems: "center",
                justifyContent: "center",
                width: itemWidth,
                height: itemHeight,
                borderRadius: 10,
              },
            ]}
          >
            <View
              style={{
                alignItems: "flex-end",
                justifyContent: "flex-end",
                width: itemWidth,
                backgroundColor: "#ddd",
                height: itemHeight,
                overflow: "hidden",
                borderRadius: 10,
              }}
            >
              <ImageBackground
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                }}
                source={uri}
              >
                {isCompleted ? (
                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 0.95 }}
                    colors={colors}
                    style={{
                      alignItems: "flex-end",
                      justifyContent: "flex-end",
                      width: itemWidth,
                      backgroundColor: "transparent",
                      height: itemHeight,
                      overflow: "hidden",
                      borderRadius: 10,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "transparent",
                        height: 30,
                        borderRadius: 100,
                        margin: 10,
                        borderColor: "#transparent",
                        borderWidth: 0,
                      }}
                    >
                      <Image
                        style={{ padding: 7, marginTop: 5 }}
                        source={challenge_pink_mark_rounded}
                      />
                    </View>
                  </LinearGradient>
                ) : (
                  <View
                    style={{
                      backgroundColor: color.mediumPink,
                      height: 30,
                      borderRadius: 100,
                      margin: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                      // borderColor: "#fff",
                      // borderWidth: 2,
                    }}
                  >
                    <Text
                      allowFontScaling={true}
                      adjustsFontSizeToFit={true}
                      minimumFontScale={0.7}
                      numberOfLines={1}
                      ellipsizeMode={"tail"}
                      style={styles.thisWeekStartNow}
                    >
                      START NOW
                    </Text>
                  </View>
                )}
              </ImageBackground>
            </View>
          </View>
          <Text
            allowFontScaling={true}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.7}
            numberOfLines={1}
            ellipsizeMode={"tail"}
            style={styles.thisWeekTitleText}
          >
            {item.description}
          </Text>
          <Text
            allowFontScaling={true}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.7}
            numberOfLines={1}
            ellipsizeMode={"tail"}
            style={{ ...styles.thisWeekSubTitleText, color: color.mediumPink }}
          >
            {countText}
            <Text
              allowFontScaling={true}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.7}
              numberOfLines={1}
              ellipsizeMode={"tail"}
              style={styles.thisWeekSubTitleText}
            >
              {countText != "" ? " | " : ""}
            </Text>
            <Text
              allowFontScaling={true}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.7}
              numberOfLines={1}
              ellipsizeMode={"tail"}
              style={styles.thisWeekSubTitleText}
            >
              {item.time}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
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

    let weekData = this.getWeekData();
    var completedWorkoutsCount = 0;
    for (let [tag, item] of Object.entries(weekData)) {
      if (item.isCompleted) {
        completedWorkoutsCount = completedWorkoutsCount + 1;
      }
    }

    let isPreviousWorkoutCompleted = completedWorkoutsCount == 6 ? true : false;

    var isSelfCareCompleted = this.checkIfSelfCareCompletedOrNot();

    let updatedWorkout = {
      ...workout,
      isPreviousWorkoutCompleted,
      isCompleted:
        isSelfCareCompleted === undefined || isSelfCareCompleted === null
          ? false
          : isSelfCareCompleted,
    };
    return updatedWorkout;
  }
  renderSelfCareView() {
    const { weeklyWorkoutSchedule, completedWorkouts } = this.props.screenProps;
    var workout = this.getSelfcareWorkoutForCurrentWeek();

    // alert("SelfcareWorkout: " + JSON.stringify(workout));

    var selfCareImage = workout ? workout.imageUrl : "";
    var isSelfCareCompleted = this.checkIfSelfCareCompletedOrNot();
    const colors = ["#f2c9cf10", "#C8C7CC"];
    if (isSelfCareCompleted) {
      return (
        <View style={[{ flex: 1 }]}>
          <TouchableOpacity
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => this._openSelfcareModal(workout)}
          >
            <View
              style={[
                this.shadowBottomForGrid(5),
                {
                  width: "92%",
                  height: height * 0.3,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <View
                style={{
                  width: "100%",
                  height: height * 0.3,
                  marginTop: 10,
                  marginBottom: 10,
                  borderRadius: 20,
                  justifyContent: "flex-start",
                  alignItems: "center",
                  backgroundColor: "#bdbdbd",
                  overflow: "hidden",
                }}
              >
                <ImageBackground
                  imageStyle={{ opacity: 1.0, resizeMode: "stretch" }}
                  style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                  source={{ uri: selfCareImage }}
                >
                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 0.95 }}
                    colors={colors}
                    style={{
                      alignItems: "flex-end",
                      justifyContent: "flex-end",
                      width: "100%",
                      backgroundColor: "transparent",
                      height: "100%",
                      overflow: "hidden",
                      borderRadius: 10,
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        flex: 1,
                        height: height * 0.3 - 50,
                      }}
                    >
                      <Text
                        allowFontScaling={false}
                        style={{ ...styles.headingTextBlackBig, color: "#fff" }}
                      >
                        Self Care Day
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "transparent",
                        height: 30,
                        borderRadius: 100,
                        margin: 10,
                        borderColor: "#transparent",
                        borderWidth: 0,
                      }}
                    >
                      <Image
                        style={{ padding: 7, marginTop: 5 }}
                        source={challenge_pink_mark_rounded}
                      />
                    </View>
                  </LinearGradient>
                  <Text
                    allowFontScaling={false}
                    style={{ ...styles.headingTextBlackBig, color: "#fff" }}
                  >
                    Self Care Day
                  </Text>
                </ImageBackground>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={[{ flex: 1 }]}>
          <TouchableOpacity
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => this._openSelfcareModal(workout)}
          >
            <View
              style={[
                this.shadowBottomForGrid(5),
                {
                  width: "92%",
                  height: height * 0.3,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <View
                style={{
                  width: "100%",
                  height: height * 0.3,
                  marginTop: 10,
                  marginBottom: 10,
                  borderRadius: 20,
                  justifyContent: "flex-start",
                  alignItems: "center",
                  backgroundColor: "#bdbdbd",
                  overflow: "hidden",
                }}
              >
                <ImageBackground
                  imageStyle={{ opacity: 1.0, resizeMode: "cover" }}
                  style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                  source={{ uri: selfCareImage }}
                >
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text
                      allowFontScaling={false}
                      style={{ ...styles.headingTextBlackBig, color: "#fff" }}
                    >
                      Self Care Day
                    </Text>
                  </View>
                </ImageBackground>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  }
  renderDaily10View() {
    let { daily10 } = this.props.screenProps;
    return (
      <View style={[{ flex: 1 }]}>
        <View style={{ width: "100%" }}>
          <View
            style={{ width: "90%", marginLeft: "5%", flexDirection: "row" }}
          >
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <Text
                allowFontScaling={false}
                style={{ ...styles.headingTextBlackBig, paddingLeft: 10 }}
              >
                Your Daily 10
              </Text>
            </View>
          </View>
          <View
            style={[
              this.shadowBottomForGrid(5),
              {
                width: "90%",
                marginLeft: "5%",
                height: height * 0.15,
                marginTop: 20,
                marginBottom: 10,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 20,
              },
            ]}
          >
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff",
              }}
              activeOpacity={1}
              onPress={this._openDailySweatModal}
              disabled={!isEmpty(daily10) ? false : true}
            >
              <View
                style={{
                  width: "100%",
                  height: height * 0.15,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "flex-start",
                  borderRadius: 20,
                  overflow: "hidden",
                  flexDirection: "row",
                  borderWidth: 1,
                  borderColor: "#ddd",
                }}
              >
                <View
                  style={{
                    width: "40%",
                    height: "100%",
                    backgroundColor: "#ddd",
                    margintop: 1,
                    overflow: "hidden",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      marginLeft: 0,
                      overflow: "hidden",
                      alignItems: "center",
                    }}
                  >
                    <ImageBackground
                      style={{ width: "100%", height: "100%" }}
                      source={{
                        uri:
                          daily10.ssuPhoto != undefined
                            ? daily10.ssuPhoto
                            : null,
                      }}
                    ></ImageBackground>
                  </View>
                </View>
                <View
                  style={{
                    width: "60%",
                    height: "100%",
                    marginLeft: 1,
                    margintop: 1,
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      width: "62%",
                      height: "100%",
                      marginLeft: 10,
                      margintop: 1,
                      alignItems: "flex-start",
                    }}
                  >
                    <Text
                      allowFontScaling={false}
                      style={{
                        ...styles.viewallTextBlack,
                        paddingLeft: 0,
                        marginTop: 10,
                      }}
                    >
                      {daily10 ? daily10.move1Name : ""}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{
                        ...styles.viewallTextBlack,
                        paddingLeft: 0,
                        marginTop: 2,
                      }}
                    >
                      {daily10 ? daily10.move2Name : ""}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{
                        ...styles.viewallTextBlack,
                        paddingLeft: 0,
                        marginTop: 2,
                      }}
                    >
                      {daily10 ? daily10.move3Name : ""}
                    </Text>
                    {/*<Text allowFontScaling={false} style={{...styles.viewallTextBlack,paddingLeft:0,marginTop: 2}}>{daily10 ? daily10.move4Name : ""}</Text>*/}
                  </View>
                  <View
                    style={{
                      width: "32%",
                      height: "100%",
                      alignItems: "flex-end",
                      justifyContent: "flex-end",
                    }}
                  >
                    <TouchableOpacity
                      style={{ justifyContent: "center", alignItems: "center" }}
                      activeOpacity={0.5}
                      onPress={this._openDailySweatModal}
                      disabled={!isEmpty(daily10) ? false : true}
                    >
                      <View
                        style={{
                          width: "100%",
                          backgroundColor: colorNew.darkPink,
                          height: 30,
                          borderRadius: 100,
                          margin: 10,
                          borderColor: "#fff",
                          borderWidth: 2,
                        }}
                      >
                        <Text
                          allowFontScaling={true}
                          adjustsFontSizeToFit={true}
                          minimumFontScale={0.7}
                          numberOfLines={1}
                          ellipsizeMode={"tail"}
                          style={styles.thisWeekStartNow}
                        >
                          START NOW
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  renderChallengeView() {
    const nowUTC = "moment.utc()";

    const { latestChallenge, challengeActive, user } = this.props.screenProps;
    const {
      challengeFlag,
      lotsOfLoveChallenge,
      springSlimDownChallenge,
      joinedChallenge,
    } = this.props.screenProps;
    // const { challengeFlag, lotsOfLoveChallenge, springSlimDownChallenge } = this.props.screenProps;
    // const { joinedChallenge } = this.state;

    let challengeName = latestChallenge ? latestChallenge.challengeName : "";
    if (challengeActive == false) {
      return null;
    }
    const challangeText = challengeName + " is ";

    return (
      <View style={[{ flex: 1 }]}>
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              height: height * 0.12,
              marginTop: 10,
              marginBottom: 10,
              justifyContent: "flex-start",
              alignItems: "center",
              backgroundColor: colorNew.mediumPink,
              flexDirection: "row",
            }}
          >
            <View
              style={{
                width: "65%",
                height: "100%",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <Text
                allowFontScaling={true}
                style={{
                  ...styles.headingTextBlackBig,
                  color: "#fff",
                  fontSize: 14,
                  marginTop: 0,
                  width: "100%",
                }}
              >
                {challangeText}
                <Text
                  allowFontScaling={true}
                  style={{
                    ...styles.headingTextBlackBig,
                    color: "#fff",
                    fontSize: 14,
                    marginTop: 0,
                  }}
                >
                  HERE!
                </Text>
              </Text>
            </View>
            <View
              style={{
                width: "30%",
                height: "45%",
                margin: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SmallButtonAnimated onPress={() => this._joinChallenge()}>
                <Text
                  allowFontScaling={true}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.7}
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={{ ...styles.thisWeekStartNow, padding: 10 }}
                >
                  {joinedChallenge
                    ? "START THE CHALLENGE"
                    : "JOIN THE CHALLENGE"}
                </Text>
              </SmallButtonAnimated>
            </View>
          </View>
        </View>
      </View>
    );
  }
  renderDailyMotivationView() {
    let { lsfRollCall } = this.props.screenProps;
    let uri;
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
                Daily Dose
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
              height: height * 0.48,
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
              <View style={{ flex: 1, marginLeft: 10, overflow: "hidden" }}>
                <TouchableOpacity onPress={() => this._share(shareuri)}>
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
                      {/*<ImageBackground imageStyle={{resizeMode: 'cover'}} style={{width:"95%", height:"95%",margin:0,justifyContent:"center",alignItems:"center",backgroundColor:"#bcb",borderRadius:25}} source={uri}>
                <LinearGradient
                ref={snapshot => (this.snapshotRollCall = snapshot)}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={colors}
                style={{width:"90%", height:"95%",margin:5,justifyContent:"center",alignItems:"center",backgroundColor:"#bcb",borderRadius:25}}>
                  <View style={{width:"95%", height:"30%",marginTop:10,marginBottom:2,justifyContent:"center",alignItems:"center"}}>
                    <Text allowFontScaling={true} style={{...styles.headingTextBlackBig,fontWeight: "600",color:"#fff",fontSize: 17,marginTop: 0,width: "100%",paddingLeft: 0,textAlign: "center"}}>TODAY'S</Text>            
                    <Image source={require('./images/lsfHighlights.png')} resizeMode="contain" style={{height:25,width:"90%",tintColor:'#fff'}} />
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
                </LinearGradient>
                </ImageBackground>*/}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: "45%",
                  height: "95%",
                  marginTop: 0,
                  marginBottom: 5,
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
                    marginBottom: 5,
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
  renderBottomButton(img, title) {
    return (
      <View
        style={{
          justifyContent: "space-around",
          alignItems: "center",
          width: width * 0.85,
          height: 55,
          flexDirection: "row",
          borderWidth: 1,
          borderColor: "#ddd",
          margin: 10,
          borderRadius: 100,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => this._bottomButtonClick(title)}
          activeOpacity={1}
        >
          <View
            style={{
              width: "30%",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <Image
              source={img}
              resizeMode="contain"
              style={{ height: 25, width: 25 }}
            />
          </View>
          <View
            style={{
              width: "70%",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                ...styles.bottomButtonText,
                fontSize: 14,
                lineHeight: 20,
                marginLeft: 15,
                textAlign: "left",
              }}
            >
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  _shareFor(shareViewRef) {
    captureRef(shareViewRef, {
      format: "jpg",
      quality: 0.8,
    }).then(
      (uri) => this._share(uri),
      (error) => alert("Oops, snapshot failed", error)
    );
  }
  _share(uri) {
    this.setState({
      showInspoModal: true,
      showQuoteModal: false,
      shareImage: uri,
    });
  }
  _bottomButtonClick(title) {
    if (title == "MOTIVATE ME!") {
      this.showQuoteModal();
    } else if (title == "VIDEO LIBRARY") {
      this.props.navigation.navigate("VideoLibraryNew");
    } else if (title == "INVITE A FRIEND") {
      this.setState({ showInviteFriend: true });
    } else if (title == "SHOP LSF PLANS + GEAR") {
      Linking.openURL("https://my.lovesweatfitness.com");
    }
  }
  manageScrollviewOffset() {
    return (
      <View
        style={{
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
          marginBottom: headerHeight,
        }}
      ></View>
    );
  }
  renderBottomButtons() {
    return (
      <View
        style={{
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
          marginTop: 20,
        }}
      >
        {this.renderBottomButton(home_motivate_me, "MOTIVATE ME!")}
        {this.renderBottomButton(home_video_library, "VIDEO LIBRARY")}
        {/*this.renderBottomButton(home_invite_friend,"INVITE A FRIEND")*/}
        {this.renderBottomButton(home_shop, "SHOP LSF PLANS + GEAR")}
      </View>
    );
  }
  renderTodaysWorkout(today) {
    const nowUTC = moment.utc();

    let uri;

    if (today && today.imageUrl != undefined) {
      uri = { uri: today.imageUrl };
    } else {
      uri = { uri: null };
    }

    return (
      <View style={[this.elevationShadowStyle(5), { flex: 1 }]}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fae8ee",
            width: "100%",
            height: 60,
          }}
        >
          <Image
            style={{ width: "90%", height: 60, resizeMode: "contain" }}
            source={require("./images/sweatSesh.png")}
          />
        </View>
        <View style={{ width: "100%", height: 247.7 }}>
          <ImageBackground
            style={{ width: "100%", height: "100%" }}
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

            <View
              style={{ width: "100%", alignItems: "flex-end", marginRight: 40 }}
            >
              <TouchableOpacity
                style={{ height: 42, marginTop: 20, marginRight: 20 }}
                onPress={() => {
                  let description = "";

                  if (today && today.description != undefined) {
                    description = today.description;
                  }

                  this.addToCalendar(description, nowUTC);
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                >
                  <Image
                    style={{ width: 42, height: 42 }}
                    source={require("./images/calendarIcon.png")}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flex: 1,
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Text style={styles.descriptions}>
                {today && today.description != undefined
                  ? today.description.toUpperCase()
                  : "Today's Workout"}
              </Text>
            </View>
          </ImageBackground>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fae8ee",
            top: 0,
            left: 0,
            width: "100%",
            height: 70,
          }}
        >
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={() => this._startWorkout(today)}
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
  _nutritionLink = () => {
    this.setState({
      showNutritionPlanModal: true,
    });
  };
  renderNutritionPlans() {
    return (
      <View style={[this.elevationShadowStyle(5), styles.footer]}>
        <Text style={styles.footerHeading}>GET ULTIMATE RESULTS!</Text>
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            borderBottomWidth: 2,
            borderBottomColor: color.white,
          }}
          onPress={() => {
            this._nutritionLink();
          }}
        >
          <Text style={styles.footerSubHeading}>VIEW LSF NUTRITION PLANS</Text>
        </TouchableOpacity>
      </View>
    );
  }
  renderSelfcareModal() {
    const { showSelfCareModal, selfCareItem, showCompletionModal } = this.state;
    return (
      <View>
        <SelfCareLog
          visible={showSelfCareModal}
          onClose={this._closeSelfCareModal}
          onLogPressed={this._pushDataUpToState}
          itemData={
            selfCareItem ? Object.assign(selfCareItem, { isToday: true }) : null
          }
        />
        <CompletionModal
          start={showCompletionModal}
          title={"Self Care"}
          workout={
            selfCareItem
              ? Object.assign(selfCareItem, {
                  isToday: true,
                  description: "Self Care Day",
                })
              : null
          }
          screenAfterWorkout={"Today"}
          onStackComplete={this._onCompletionFlowEnd}
        />
      </View>
    );
  }
  _pushDataUpToState = (data) => {
    this.setState({
      selfLoveData: data,
      showCompletionModal: true,
      showSelfCareModal: false,
    });
  };
  _onCompletionFlowEnd = (screenName, props) => {
    console.log("_onCompletionFlowEnd : selfLoveData");
    const { selfLoveData } = this.state;
    this._saveSelfCareLog(selfLoveData);
    this.setState({ showCompletionModal: false, selfLoveData: null });

    if (screenName) {
      this.props.navigation.navigate(screenName, props);
    }
  };
  _openSelfcareModal = (item) =>
    this.setState({ showSelfCareModal: true, selfCareItem: item });

  _closeSelfCareModal = () => this.setState({ showSelfCareModal: false });

  _saveSelfCareLog = (data) => {
    console.log("_saveSelfCareLog called");
    console.log(data);
    User.saveSelfCareLog(data).catch((err) => console.log(err.stack));

    const { selfCareItem } = this.state;
    this.props.screenProps.saveCompletedWorkout(selfCareItem);
  };
  _logWaterBottles = () => {
    const { bottleCount, bottles } = this.state;
    const { saveBottleCount } = this.props.screenProps;

    if (bottles === 0 || bottleCount === 0) {
      alert("Nothing to log");
      return;
    }

    saveBottleCount(bottleCount);
    alert("Way to hydrate, babe!");

    // reset bottle count
    this.setState({
      bottles: 0,
      bottleCount: 0,
    });

    // reset water height
    {
      this._waveRect && this._waveRect.setWaterHeight(0);
    }
  };
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

    if (isComboDetailWorkout(primaryType, secondaryType)) {
      screen = "ComboDetail";
    } else if (isCircuitOnlyWorkout(primaryType, secondaryType)) {
      screen = "CircuitOnlyDetails";
    } else {
      screen = "CardioDetail";
    }
    const passedProps = {
      workout: { ...workout, isToday: true },
      openVideoModal: this.props.screenProps.openVideoModal,
      renderVideoModal: this.props.screenProps.renderVideoModal,
      navigationFunctions: {
        navigateToMenuTab: this._navigateToMenuTab,
      },
      screenAfterWorkout: screenAfterWorkout,
    };
    this.props.navigation.navigate(screen, passedProps);
  };
  _navigateToMenuTab = (screenName) => {
    // const screen = this._validateTabName(tabName);
    this.props.navigation.navigate(screenName);
  };
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
  shadowBottom(elevation) {
    return {
      elevation,
      shadowColor: "black",
      shadowOffset: { width: 0, height: 0.5 * (elevation + 15) },
      shadowOpacity: 0.3,
      shadowRadius: 0.8 * elevation,
      backgroundColor: "white",
    };
  }
  shadowBottomForGrid(elevation) {
    return {
      elevation,
      shadowColor: "#00000075",
      shadowOffset: { width: 0, height: 0.5 * (elevation + 7) },
      shadowOpacity: 0.2,
      shadowRadius: 0.5 * elevation,
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
} // End class

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
  headerText: {
    width: "100%",
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "900",
    fontStyle: "normal",
    letterSpacing: 2,
    textAlign: "center",
    color: "#ffffff",
    marginTop: 0,
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
    textShadowRadius: 1,
  },
  mainText: {
    width: "100%",
    height: 140,
    fontFamily: "SF Pro Text",
    fontSize: 30,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 140,
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
    marginTop: 0,
  },
  ssuHeaderText: {
    width: "100%",
    height: 52,
    fontFamily: "SF Pro Text",
    fontSize: 36,
    fontWeight: "900",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff",
    marginTop: 0,
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
  pinkQuote: {
    width: 335,
    height: 35,
    backgroundColor: color.navPink,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  ssuPinkQuote: {
    width: "100%",
    height: 70,
    backgroundColor: color.navPink,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  quoteText: {
    width: 249,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    textAlign: "center",
    color: color.textColor,
  },
  headingText: {
    width: 249,
    height: 30,
    fontFamily: "SF Pro Text",
    fontSize: 25,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 25,
    letterSpacing: 4,
    textAlign: "left",
    color: "#ec568f",
  },
  thisWeekTitleText: {
    width: "96%",
    fontFamily: "SF Pro Text",
    fontSize: 17,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 24,
    paddingLeft: 5,
    letterSpacing: 0,
    textAlign: "left",
    color: "#000",
    marginTop: 25,
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
  thisWeekSubTitleText: {
    width: "96%",
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    paddingLeft: 5,
    textAlign: "left",
    color: colorNew.bgGrey,
    marginTop: 20,
  },
  gridcontainer: {
    flex: 1,
    marginTop: 2,
    marginBottom: 2,
    backgroundColor: "#fff",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  headingTextBlack: {
    width: "90%",
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    paddingLeft: 20,
    color: "#000",
    marginTop: 20,
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
  dailySubtitleText: {
    width: "90%",
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "600",
    fontStyle: "normal",
    letterSpacing: 0.0,
    textAlign: "left",
    color: "#000",
    paddingLeft: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  bottomButtonText: {
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 15,
    color: color.mediumGrey,
    letterSpacing: 0.0,
    textAlign: "center",
  },
  highLightCard: {
    width: 335,
    height: 116,
    borderRadius: 6,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(207, 207, 207, 0.5)",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 12,
    shadowOpacity: 1,
  },
  startButton: {
    width: 220,
    height: 36,
    borderWidth: 2,
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
  ssuStartButton: {
    width: 190,
    height: 48,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  ssuStartButtonText: {
    width: 195,
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff",
  },
  heading: {
    width: "100%",
    alignItems: "center",
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
  },
  hydrationHeading: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "contain",
  },
  highlightHeading: {
    bottom: -10,
    marginTop: 10,
    marginLeft: 40,
    flex: 1,
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  highlightContainer: {
    flex: 1,
    flexDirection: "column",
    height: 170,
    width: width,
    alignItems: "space-between",
    justifyContent: "space-between",
  },
  scrollContainer: {
    flexDirection: "row",
    height: 160,
    marginTop: 0,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  circleCell: {
    width: 110,
    height: 110,
    borderRadius: 55.5,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(207, 207, 207, 0.5)",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowRadius: 16,
    shadowOpacity: 1,
  },
  mask: {
    width: width,
    height: 400,
    backgroundColor: "#f695a8",
    marginTop: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    backgroundColor: "transparent",
    width: "100%",
    marginTop: -40,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: color.black,
    marginTop: 20,
  },
  btnText: {
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff",
  },
  btn: {
    marginTop: 20,
    marginBottom: 30,
  },
  mainContent: {
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "600",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.white,
    marginTop: 80,
    width: width * 0.8,
    height: 120,
    lineHeight: 30,
  },
  signatureStyle: {
    fontFamily: "Northwell",
    fontSize: 40,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    justifyContent: "center",
    color: color.white,
    marginTop: 0,
  },
  logButtonText: {
    width: 172,
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
  waterBottleText: {
    width: 60,
    height: 64,
    fontFamily: "SF Pro Text",
    fontSize: 25,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 63.8,
    letterSpacing: 0,
    textAlign: "center",
    color: "#FFF",
    marginTop: 5,
    position: "absolute",
    bottom: 0,
  },
  spotifyLoginButton: {
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "green",
    overflow: "hidden",
    width: 200,
    height: 40,
    margin: 20,
  },
  spotifyLoginButtonText: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
  },
  trackListText: {
    width: 83,
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: color.black,
  },
  waterContainer: {
    flex: 1,
    marginVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  wave: {
    width: 60,
    aspectRatio: 1,
    overflow: "hidden",
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 0.5,
    height: "100%",
    borderRadius: 11,
  },
  footer: {
    width: "100%",
    backgroundColor: "#ec568f",
    height: 120,
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  footerHeading: {
    fontFamily: "SF Pro Text",
    fontSize: 22,
    letterSpacing: 2,
    fontWeight: "bold",
    fontStyle: "normal",
    textAlign: "center",
    color: color.white,
    height: 34,
  },
  footerSubHeading: {
    fontFamily: "SF Pro Text",
    fontSize: 18,
    letterSpacing: 2,
    fontStyle: "normal",
    textAlign: "center",
    color: color.white,
    paddingBottom: 3,
  },
  currentChallengeBox: {
    backgroundColor: "#e16d92",
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
  },
  currentChallengeText: {
    height: 16,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 4,
    textAlign: "center",
    color: "white",
  },
  joinButtonBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  joinText: {
    top: 1,
    letterSpacing: 3,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "bold",
    fontStyle: "normal",
    color: "white",
    padding: 10,
    borderColor: "white",
    borderWidth: 2,
  },
  headerTitle: {
    color: color.hotPink,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
  },
  weekDayStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "500",
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    fontStyle: "normal",
    color: "#fff",
    marginTop: 10,
  },
  highlightHeaderText: {
    color: "#ec568f",
    fontWeight: "bold",
    fontSize: 21,
  },
};
