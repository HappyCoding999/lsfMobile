import React, { Component } from "react";
import {
  View,
  ImageBackground,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  SectionList,
  ScrollView,
  Linking,
  Modal,
  Alert,
  FlatList,
  TouchableHighlight,
} from "react-native";
import { ListItem } from "react-native-elements";
import { AsyncStorage } from "react-native";
import { color, colorNew } from "../../modules/styles/theme";
import Goals from "../Profile/tabs/Goals/Goals";
import { EventRegister } from "react-native-event-listeners";
import { sortBy, uniqBy, isEmpty } from "lodash";
import moment from "moment";
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
import * as AddCalendarEvent from "react-native-add-calendar-event";
import {
  calendar_add_icon,
  goal_feel_hapier,
  logo_white_love_seat_fitness,
  goal_build_edurance,
  goal_eat_halthier,
  swap,
  week_plus_radius_square,
  day_uncheck_roundec,
  day_check_roundec,
  challenge_pink_mark_rounded,
  ic_back_white,
} from "../../images";
import { skipToNextWeek, saveLevel } from "../../actions";
import SelfCareLog from "../SelfCareLog";
import { connect } from "react-redux";
import { Dropdown } from "react-native-material-dropdown";

const { height, width } = Dimensions.get("window");

const itemRatio = 125 / 160;

const headerHeight = 160;

var fitnessLevels = [
  { name: "Beginner", description: "Just getting started and ready to rock!" },
  {
    name: "Intermediate",
    description: "Feeling strong and ready to take it up a notch!",
  },
  {
    name: "Advanced",
    description: "Crushing your daily sweat sesh and ready for more!",
  },
];

const utcDateToString = (momentInUTC) => {
  let s = moment.utc(momentInUTC).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  // console.warn(s);
  return s;
};

class WeekAtGlance extends Component {
  constructor(props) {
    super(props);
    this.renderGridItem = this.renderGridItem.bind(this);
    this.renderHeader = this.renderHeader.bind(this);

    this.state = {
      thisWeekData: [],
      selfLoveData: null,
      currentDay: null,
      showCompletionModal: false,
      showSelfCareModal: false,
      showGoalView: false,
      showLevelModal: false,
      quote:
        "Exercise is a celebration of what your body can do. Not a punishment for what you ate.",
    };
  }

  backToHome = () => {
    this.props.navigation.pop();
  };

  componentDidMount() {
    this.props.screenProps.closeLoadingModal();
  }

  _prepWeekdata(completed, workoutsForWeek) {
    return getWeeklyWorkoutSchedule(workoutsForWeek || []);
  }

  addToCalendar = (title) => {
    // console.log("addToCalendar");
    // return;
    const startDateUTC = moment.utc();
    title = title != undefined ? title : "";

    const eventConfig = {
      title,
      startDate: utcDateToString(startDateUTC),
      endDate: utcDateToString(moment.utc(startDateUTC).add(1, "hours")),
      notes: "Love Sweat Fitness " + title,
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

  renderWeekView() {
    const { showWeekOptionView } = this.state;
    if (showWeekOptionView) {
      return (
        <View
          style={{
            overflow: "hidden",
            width: "100%",
            flex: 1,
            marginTop: 160,
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
                overflow: "hidden",
              },
            ]}
          >
            <WeekDropDownOptionView />
          </View>
        </View>
      );
    } else {
      return null;
    }
  }

  renderSelfcareModal() {
    const { showSelfCareModal, selfCareItem, showCompletionModal } = this.state;
    console.log("renderSelfcareModal : selfCareItem");
    console.log(selfCareItem);
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
          screenAfterWorkout={"Today"}
          onStackComplete={this._onCompletionFlowEnd}
        />
      </View>
    );
  }

  _closeSelfCareModal = () => this.setState({ showSelfCareModal: false });

  _onCompletionFlowEnd = (screenName, props) => {
    const { selfLoveData } = this.state;
    console.log("selfLoveData");
    this._saveSelfCareLog(selfLoveData);
    this.setState({ showCompletionModal: false, selfLoveData: null });
    if (screenName) this.props.navigation.navigate(screenName, props);
  };
  render() {
    console.log("WeekAtGlance Render");
    let weekData = this.props.navigation.state.params.weekData;
    console.log("workout : " + weekData);
    if (weekData) {
      return (
        <ScrollView style={{ backgroundColor: "#fff", height: height }}>
          <View style={{ backgroundColor: "#fff", flex: 1, height: height + 500 }}>
            {/* {this.renderHeader()} */}
            {/* {this.renderWeek()} */}
            {this.renderThisWeek(weekData)}
            {this.renderGoalView()}
            {this.renderWeekView()}
            {this._renderLevelModal()}
            {this.renderSelfcareModal()}
          </View>
        </ScrollView>
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
  _renderLevelModal() {
    return (
      <Modal
        animationType="slide"
        visible={this.state.showLevelModal}
        transparent={true}
        onRequestClose={() => {}}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "#ffffff",
          }}
        >
          {this.renderSectionList()}
        </View>
      </Modal>
    );
  }
  keyExtractor(item) {
    return item.name;
  }
  renderSectionHeader = ({ section }) => <View></View>;
  onPressRow = (item) => {
    // User.saveLevel(item.name);
    this.props.saveLevel(item.name);
    this.setState({
      showLevelModal: false,
    });
  };
  renderItem = ({ item }) => {
    return (
      <View>
        <ListItem
          title={item.name}
          titleStyle={styles.titleStyle}
          subtitleStyle={styles.subtitleStyle}
          subtitle={item.description}
          chevronColor="black"
          chevron
          onPress={() => this.onPressRow(item)}
          containerStyle={{ borderBottomColor: color.lightGrey }}
        />
      </View>
    );
  };
  renderSectionList() {
    return (
      <View style={{ height: "100%" }}>
        <SectionList
          sections={[{ title: "", data: fitnessLevels }]}
          renderSectionHeader={this.renderSectionHeader}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />
      </View>
    );
  }
  _navigationLeftButtonPressed() {
    console.log("_navigationLeftButtonPressed");
    this.props.navigation.pop();
  }
  _navigationRightButtonPressed() {
    console.log("_navigationRightButtonPressed");
    let showGoalView = !this.state.showGoalView;
    this.setState({ showGoalView });
  }
  renderHeader() {
    return (
      <View style={[{ width: "100%", height: 120 }]}>
        <GradientHeader
          onLeftPress={this._navigationLeftButtonPressed.bind(this)}
          onRightPress={this._navigationRightButtonPressed.bind(this)}
        />
      </View>
    );
  }
  _weekButtonPressed() {
    console.log("_weekButtonPressed");
    let showWeekOptionView = !this.state.showWeekOptionView;
    this.setState({ showWeekOptionView });
  }
  renderWeek() {
    const { weekDayStyle } = styles;
    let weekData = this.props.navigation.state.params.weekData;
    const { level, currentWeek, completedWorkouts, weeklyWorkoutSchedule } =
      this.props.screenProps;
    return (
      <View style={[{ width: "100%", height: 60, flexDirection: "row" }]}>
        <WeekViewForHeader
          level={level}
          completed={weekData}
          currentWeek={currentWeek}
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
  renderThisWeek(weeklyWorkoutSchedule) {
    var weekData = weeklyWorkoutSchedule;
    // if (weeklyWorkoutSchedule.today) {
    //     const { today } = weeklyWorkoutSchedule;
    //     weekData.push(today);
    // }
    // if (weeklyWorkoutSchedule.upcomming)
    // {
    //   for (let [tag, item] of Object.entries(weeklyWorkoutSchedule.upcomming)) {
    //     // if (item.primaryType != "Rest")
    //     // {
    //       weekData.push(item);
    //     // }
    //   };
    // }
    return (
      <View
        style={[
          {
            flex: 1,
            height: height,
            // height: height - headerHeight,
          },
        ]}
      >
        <View style={{ width: "100%" }}>
          <View
            style={{
              // flex: 2,
              height: 80,
              // marginLeft: 20,
              flexDirection: "row",
              justifyContent: "flex-start",
              backgroundColor: "#ee90af",
            }}
          >
            <View
              style={{
                justifyContent: "flex-end",
                alignItems: "flex-end",
                marginRight: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 10,
                  paddingBottom: 20,
                }}
                activeOpacity={0.9}
                onPress={this.backToHome}
              >
                {/* <Text allowFontScaling={false} style={styles.viewallTextBlack}>
                  HOME
                </Text> */}
                <Image
                  source={ic_back_white}
                  style={{ height: 20, width: 30 }}
                  resizeMode={"contain"}
                />
              </TouchableOpacity>
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
                  ...styles.headingTextBlackBig,
                  fontSize: 20,
                  paddingLeft: 0,
                  color: "white",
                }}
              >
                {"This Week's Schedule"}
                {/* {"My Weekly Plan"} */}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              // height: "100%",
              // height: 60,
              flexDirection: "row",
              backgroundColor: "#b2b2b2",
            }}
          >
            <FlatList
              data={weekData}
              numColumns={2}
              scrollEnabled={false}
              style={{ width: "100%", backgroundColor: "#fff", padding: 0 }}
              contentContainerStyle={styles.gridcontainer}
              renderItem={this.renderGridItem}
              ListFooterComponent={this.render_footer}
              keyExtractor={(item, idx) => item + idx}
            />
          </View>
        </View>
      </View>
    );
  }
  render_footer = () => {
    const colors = [colorNew.gradientsPinkStart, colorNew.gradientsPinkEnd];
    console.log("render_footer");
    const { level } = this.props.screenProps;
    console.log(level);
    var footer_View = (
      <View style={styles.header_footer_style}>
        {/*<View style={{ marginTop: 30,marginBottom:30 }}>
        <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={colors}
        style={styles.linearGradient}>
        <TouchableHighlight
          style={styles.buttonStyle}
          onPress={this.onLogin}
          underlayColor={'#ee90af'}>
          <Text allowFontScaling={false} style={styles.buttonText}>Set Reminders</Text>
        </TouchableHighlight>
        </LinearGradient>
      </View>*/}
        <View style={{ marginTop: 10 }} />
        <View
          style={{ width: "100%", flex: 1, backgroundColor: colorNew.darkPink }}
        >
          <Text
            allowFontScaling={false}
            style={{ ...styles.headingTextBlackBig, color: "#fff" }}
          >
            Your Plan
          </Text>
          <View
            style={{
              width: "100%",
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            <TouchableHighlight
              style={{
                ...styles.buttonStyle,
                height: 35,
                width: "40%",
                backgroundColor: "#fff",
              }}
              onPress={this.props.skipToNextWeek}
              underlayColor={"#ee90af"}
            >
              <Text
                allowFontScaling={false}
                style={{
                  ...styles.buttonText,
                  color: colorNew.textPink,
                  fontSize: 10,
                  fontWeight: "normal",
                }}
              >
                SKIP TO NEXT WEEK
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{
                ...styles.buttonStyle,
                height: 35,
                width: "40%",
                backgroundColor: "#fff",
              }}
              onPress={this.showLevelChangeModal.bind(this)}
              underlayColor={"#ee90af"}
            >
              <Text
                allowFontScaling={false}
                style={{
                  ...styles.buttonText,
                  color: colorNew.textPink,
                  fontSize: 10,
                  fontWeight: "normal",
                }}
              >
                LEVEL {level.toUpperCase()}
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );

    return footer_View;
  };
  showLevelChangeModal() {
    console.log("showInfo");
    this.setState({
      showLevelModal: true,
    });
  }
  hideLevelChangeModal() {
    console.log("hideInfo");
    this.setState({
      showLevelModal: false,
    });
  }
  renderGridItem = ({ item, index }) => {
    let itemWidth = width * 0.44;
    let itemHeight = itemWidth * itemRatio;
    const { completedWorkouts, weeklyWorkoutSchedule, challengeActive } =
      this.props.screenProps;
    let weekData = this.props.navigation.state.params.weekData;
    console.log("workout : " + weekData);
    var totalData = weekData.length;
    // if (weeklyWorkoutSchedule.today) {
    //     totalData = totalData + 1
    // }
    // if (weeklyWorkoutSchedule.upcomming)
    // {
    //   var isContaintRest = false
    //   for (let [tag, item] of Object.entries(weeklyWorkoutSchedule.upcomming)) {
    //     if (item.primaryType == "Rest")
    //     {
    //       isContaintRest = true
    //     }
    //   };
    //   // if (isContaintRest)
    //   // {
    //   //   totalData = totalData + weeklyWorkoutSchedule.upcomming.length - 1
    //   // }
    //   // else
    //   // {
    //     totalData = totalData + weeklyWorkoutSchedule.upcomming.length
    //   // }
    // }
    let countText = index + 1 + "/" + weekData.length;
    let uri;

    if (item && item.imageUrl != undefined) {
      uri = { uri: item.imageUrl };
    } else {
      uri = { uri: null };
    }
    console.log("Vishal => Check item for completed flag :");
    console.log(item);

    let isCompleted = item.isCompleted;
    const colors = ["#f2c9cf10", "#C8C7CC"];

    const { onVideoLibraryPress } = this.props;
    return (
      <View
        style={{
          backgroundColor: "#fff",
          width: itemWidth,
          height: itemHeight * 1.5,
          marginLeft: 10,
          marginTop: index == 0 || index == 1 ? 10 : 2,
        }}
      >
        <TouchableOpacity
          style={{ justifyContent: "space-around", padding: 10 }}
          activeOpacity={0.9}
          onPress={() => this._startWorkout(item)}
        >
          <View
            style={[
              this.shadowBottom(5),
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
                  justifyContent: "flex-start",
                }}
                source={uri}
              >
                {isCompleted ? (
                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 0.95 }}
                    colors={colors}
                    style={{
                      width: "100%",
                      height: "100%",
                      alignItems: "flex-end",
                      justifyContent: "flex-start",
                      backgroundColor: "transparent",
                      overflow: "hidden",
                    }}
                  >
                    <TouchableOpacity
                      style={{ height: 40, marginTop: 10, marginRight: 10 }}
                      onPress={() => {
                        let description = "";
                        if (item.description != undefined) {
                          description = item.description;
                        }
                        this.addToCalendar(description);
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "transparent",
                          height: "100%",
                          width: "100%",
                        }}
                      >
                        <Image
                          style={{ width: 25, height: 25 }}
                          source={week_plus_radius_square}
                        />
                      </View>
                    </TouchableOpacity>
                    <View
                      style={{
                        position: "absolute",
                        right: -5,
                        bottom: 0,
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
                  <TouchableOpacity
                    style={{ height: 40, marginTop: 10, marginRight: 10 }}
                    onPress={() => {
                      let description = "";
                      if (item.description != undefined) {
                        description = item.description;
                      }
                      this.addToCalendar(description);
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "transparent",
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <Image
                        style={{ width: 25, height: 25 }}
                        source={week_plus_radius_square}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </ImageBackground>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: itemWidth,
              height: 35,
              justifyContent: "flex-start",
              alignItems: "center",
              marginTop: 25,
              overflow: "hidden",
            }}
          >
            <Text
              allowFontScaling={false}
              adjustsFontSizeToFit={false}
              minimumFontScale={0.7}
              numberOfLines={1}
              ellipsizeMode={"tail"}
              style={{
                ...styles.thisWeekTitleTextNew,
                fontSize: 12,
                paddingLeft: 0,
                marginTop: 0,
              }}
            >
              {item.description}
            </Text>
            {/*<View style={{ height: 25, justifyContent: 'center',alignItems:"center", marginLeft: 10, width: 30,marginTop: 10,marginRight:10}}>
              <Image style={{ height: '70%', resizeMode: 'contain' }} source={swap} />
            </View>*/}
          </View>
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
              {" "}
              | {item.time}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderGoalView() {
    const { showGoalView } = this.state;
    if (showGoalView) {
      let weekData = this.props.navigation.state.params.weekData;
      return (
        <View
          style={[
            this.shadowBottom(5),
            {
              width: "100%",
              marginTop: 100,
              position: "absolute",
              backgroundColor: colorNew.lightPink,
              justifyContent: "flex-end",
            },
          ]}
        >
          <GoalViewForHeader {...this.props} completed={weekData} />
          {/*<GoalViewForHeader />*/}
        </View>
      );
    } else {
      return null;
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

  _pushDataUpToState = (data) => {
    this.setState({
      selfLoveData: data,
      showCompletionModal: true,
      showSelfCareModal: false,
    });
  };

  _openSelfcareModal = (item) =>
    this.setState({ showSelfCareModal: true, selfCareItem: item });

  _startWorkout = (workout, screenAfterWorkout) => {
    return;
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
      screenAfterWorkout != undefined ? "ChallengeDashboard" : "My Week";

    let screen;

    if (isComboDetailWorkout(primaryType, secondaryType)) {
      screen = "ComboDetail";
    } else if (isCircuitOnlyWorkout(primaryType, secondaryType)) {
      screen = "CircuitOnlyDetails";
    } else {
      screen = "CardioDetail";
    }
    console.log("screen:", screen);

    const passedProps = {
      workout: { ...workout, isToday: true },
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
  dropDownContainer: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    paddingTop: 30,
    backgroundColor: "#307ecc",
    padding: 16,
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
  gridcontainer: {
    width: width,
    marginTop: 2,
    backgroundColor: "#fff",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
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
  thisWeekTitleTextNew: {
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
    fontSize: 10,
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
    height: 28,
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
  header_footer_style: {
    width: width,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonStyle: {
    width: 315,
    height: 48,
    borderRadius: 100,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    width: "90%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    color: "#ffffff",
  },
  linearGradient: {
    width: 315,
    height: 55,
    borderRadius: 100,
    backgroundColor: "color.mediumPink",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  highlightHeaderText: {
    color: "#ec568f",
    fontWeight: "bold",
    fontSize: 21,
  },
};

const mapDispatchToProps = {
  skipToNextWeek,
  saveLevel,
};

export default connect(null, mapDispatchToProps)(WeekAtGlance);
