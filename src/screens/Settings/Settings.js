import React, { Component } from "react";
import {
  Platform,
  View,
  Text,
  Dimensions,
  SectionList,
  Modal,
  TouchableOpacity,
  Image,
  Linking,
  Switch,
} from "react-native";
import { ListItem } from "react-native-elements";
import { color, colorNew } from "../../modules/styles/theme";
import { SafeAreaView } from "react-navigation";
import { Subscriptions as Subscription } from "../../components/common";
import { SwitchPush as CustomSwitch } from "../../components/common";
import LinearGradient from "react-native-linear-gradient";
import {
  icon_fleminine_arm,
  ic_back_white,
  logo_white_love_seat_fitness,
} from "../../images";
import { ArmFlex } from "../../components/common/AnimatedComponents/ArmFlex";
import HowItWorksModal from "../Onboarding/Welcome/HowItWorksModal";

const { width, height } = Dimensions.get("screen");

const BEGINNER = "BEGINNER";
const INTERMEDIATE = "INTERMEDIATE";
const ADVANCED = "ADVANCED";

// var appSection = [
//   { name: "Contact Us", index: 3 },
//   { name: "FAQ", index: 4 },
//   { name: "Log Out Account", index: 5 }
// ]
var appSection = [
  {
    name: "Contact + Support",
    index: 3,
    avatar_url: require("./images/contact_support.png"),
  },
  { name: "FAQ", index: 4, avatar_url: require("./images/faq.png") },
  // { name: "Push Notifications", index: 5, avatar_url:require('./images/push_notification.png')},
  {
    name: "Get Started",
    index: 6,
    avatar_url: require("./images/get_started.png"),
  },
  {
    name: "Terms & Conditions / Privacy Policy",
    index: 7,
    avatar_url: require("./images/terms.png"),
  },
  {
    name: "Log Out Account",
    index: 8,
    avatar_url: require("./images/logout.png"),
  },
  {
    name: "Delete My Account",
    index: 9,
    avatar_url: require("./images/logout.png"),
  },
];

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.onPressRow = this.onPressRow.bind(this);
    this.state = {
      fitnessLevel: [],
      markedLevel: null,
      showLogoutModal: false,
      showDeleteUserModal: false,
      showSubscriptionsModal: false,
      showHowItWorks: false,
    };
  }

  _onCloseSubscriptionModalPressed = () => {
    console.log("close subscription modal!");
    this.setState({
      showSubscriptionsModal: false,
    });
  };

  _onDeleteUserCloseButtonPressed = () => {
    this.setState({
      showDeleteUserModal: false,
    });
  };

  _onDeleteUserHandler = () => {
    this.setState({
      showDeleteUserModal: true,
    });
  };

  _deleteUser = () => {
    this.setState(
      {
        showDeleteUserModal: false,
      },
      () => this.props.screenProps.onDeleteUser()
    );
  };

  _onCloseButtonPressed = () => {
    this.setState({
      showLogoutModal: false,
    });
  };

  _onLogoutHandler = () => {
    this.setState({
      showLogoutModal: true,
    });
  };

  _logout = () => {
    this.setState(
      {
        showLogoutModal: false,
      },
      () => this.props.screenProps.onLogout()
    );
  };

  onPressRow({ item }) {
    const { purchasePlatform } = this.props.screenProps;
    if (item.index === 0) {
      this.props.navigation.navigate("EditProfile", {
        ...this.props.screenProps,
      });
    } else if (item.index === 1) {
      this.props.navigation.navigate("SettingsLevel");
    } else if (item.index === 2) {
      if (purchasePlatform === "stripe") {
        Linking.openURL("https://lovesweatfitness.com/lsf-login-form");
      } else {
        this.props.navigation.navigate("SettingsSubscriptions", {
          ...this.props.screenProps,
        });
      }
    } else if (item.index === 3) {
      Linking.openURL("mailto:support@lovesweatfitness.com?subject=Feedback");
    } else if (item.index === 4) {
      this.props.navigation.navigate("SettingsFAQ");
    } else if (item.index === 6) {
      this.setState({ showHowItWorks: true });
    } else if (item.index === 7) {
      Linking.openURL("https://lovesweatfitness.com/terms-conditions");
    } else if (item.index === 8) {
      this._onLogoutHandler();
    } else if (item.index === 9) {
      this._onDeleteUserHandler();
    }
  }

  renderSectionHeader = ({ section }) => {
    const { index } = section.data[0];
    const onAndroid = Platform.OS === "android";
    const style = {
      backgroundColor: color.palePink,
      height: 40,
      justifyContent: "center",
      marginTop: index === 0 && onAndroid ? 20 : 0,
    };

    return (
      <View style={style}>
        <Text allowFontScaling={false} style={styles.sectionTitle}>
          {section.title}
        </Text>
      </View>
    );
  };

  onLevelSelected = (level) => {
    this.armFlex.animate();
    var levelName = "";
    switch (level) {
      case BEGINNER:
        console.log("BEGINNER selected");
        levelName = "Beginner";
        break;
      case INTERMEDIATE:
        console.log("INTERMEDIATE selected");
        levelName = "Intermediate";
        break;
      case ADVANCED:
        console.log("ADVANCED selected");
        levelName = "Advanced";
        break;
    }
    this.props.screenProps.saveLevel(levelName);
    this.setState({
      markedLevel: levelName,
    });
  };

  renderLevelButton = (level, currentLevel) => {
    const isSelected = currentLevel.toUpperCase() == level.toUpperCase();
    return (
      <TouchableOpacity
        style={
          isSelected ? styles.bubbleLevelSelected : styles.bubbleLevelDefault
        }
        onPress={() => this.onLevelSelected(level)}
      >
        <View>
          <Text
            style={
              isSelected
                ? styles.bubbleLevelText
                : styles.bubbleLevelTextDefault
            }
          >
            {level.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  renderItem = ({ item }) => {
    let avatar = null;
    if (item.avatar_url != "") {
      avatar =
        item.name === "Level Select" ? (
          <ArmFlex ref={(view) => (this.armFlex = view)} />
        ) : (
          <Image
            source={item.avatar_url}
            style={{ height: 20, width: 20, resizeMode: "contain" }}
          />
        );
    }
    const top_bottom_margin = 10;
    return (
      <View>
        <ListItem
          title={item.name}
          titleStyle={{
            width: "100%",
            height: 20,
            fontFamily: "SF Pro Text",
            fontSize: 12,
            fontWeight: "700",
            fontStyle: "normal",
            lineHeight: 20,
            letterSpacing: 0.5,
            color: color.black,
            marginTop: 0,
          }}
          avatar={avatar}
          subtitleStyle={{ color: "white" }}
          chevronColor={
            item.name === "Push Notifications" || item.name === "Level Select"
              ? "transparent"
              : color.lightGrey
          }
          chevron
          onPress={() => this.onPressRow({ item })}
          allowFontScaling={false}
          normalize={14}
          containerStyle={{
            borderBottomColor: "transparent",
            marginTop: top_bottom_margin,
            marginBottom: top_bottom_margin,
          }}
        />
        {item.plan === "Free" && item.purchasePlatform !== "stripe" ? (
          <TouchableOpacity
            style={{
              padding: 10,
              height: 25,
              width: "20%",
              left: 135,
              top: 10 + top_bottom_margin,
              position: "absolute",
              backgroundColor: color.mediumPink,
              borderRadius: 22,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={this._navigateToSubscriptionsScreen}
          >
            <View>
              <Text style={styles.bubbleText}>{item.plan}</Text>
            </View>
          </TouchableOpacity>
        ) : item.name === "Level Select" ? (
          <View
            style={{
              height: 25,
              width: width * 0.8 - 110,
              left: 120,
              top: 10 + top_bottom_margin,
              position: "absolute",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            {this.renderLevelButton(BEGINNER, item.level)}
            {this.renderLevelButton(INTERMEDIATE, item.level)}
            {this.renderLevelButton(ADVANCED, item.level)}
          </View>
        ) : item.name === "Push Notifications" ? (
          <View
            style={{
              height: 25,
              width: width * 0.8 - 155,
              left: 165,
              top: 10,
              position: "absolute",
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <CustomSwitch
              width={50}
              leftLabel="Off"
              rightLabel="On"
              onToggle={this._onSwitchToggled}
            />
          </View>
        ) : (
          <View></View>
        )}
        {item.index != 9 && (
          <View
            style={{
              backgroundColor: "#0004",
              height: 0.5,
              marginHorizontal: 15,
            }}
          />
        )}
      </View>
    );
  };

  _onSwitchToggled = (label) => {
    console.log(label);
  };
  _navigateToSubscriptionsScreen = () => {
    this.props.navigation.navigate("Subscriptions");
  };

  keyExtractor(item) {
    return item.name;
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
  /* shadowBottom(elevation) {
    return {
      elevation,
      shadowColor: 'black',
      shadowOffset: { width: 0, height:(0.5 * (elevation+15))},
      shadowOpacity: 0.3,
      shadowRadius: 0.8 * elevation,
      backgroundColor: 'white'
    }
  }*/
  shadowBottom(elevation) {
    return {
      elevation,
      shadowColor: "#00000095",
      shadowOffset: { width: 0, height: 0.5 * (elevation + 15) },
      shadowOpacity: 0.15,
      shadowRadius: 0.7 * elevation,
      backgroundColor: "white",
    };
  }
  renderSectionList() {
    const { userLevel, level, membership, purchasePlatform } =
      this.props.screenProps;
    //userLevel => level select

    // const subscriptionSection = [
    //   { name: membership || "Free", index: 2, purchasePlatform, avatar_url:require('./images/subscription.png')}
    // ];
    const subscriptionSection = [
      {
        name: "Subscription",
        index: 2,
        plan: membership || "Free",
        purchasePlatform,
        avatar_url: require("./images/subscription.png"),
      },
    ];
    const fitnessLevelHeader = {
      name: "Level Select",
      index: 1,
      level: userLevel || level,
      avatar_url: icon_fleminine_arm,
    };
    const accountLevel = {
      name: "Edit Profile",
      index: 0,
      avatar_url: require("./images/edit_profile.png"),
    };

    return (
      <View style={[this.shadowBottom(15), { ...styles.container }]}>
        <View style={{ width: "100%", height: "95%", marginTop: "5%" }}>
          <SectionList
            sections={[
              { title: "ACCOUNT", data: [accountLevel] },
              { title: "FITNESS LEVEL", data: [fitnessLevelHeader] },
              { title: "SUBSCRIPTION", data: subscriptionSection },
              { title: "APP", data: appSection },
            ]}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
          />
        </View>
      </View>
    );
  }

  renderSubscriptionModal() {
    return (
      <Modal
        visible={this.state.showSubscriptionsModal}
        animationType={"slide"}
        onRequestClose={() => ""}
      >
        <Subscription onClose={this._onCloseSubscriptionModalPressed} />
      </Modal>
    );
  }

  renderDeleteUserModal() {
    const { showDeleteUserModal } = this.state;

    return (
      <View style={styles.modalContainer}>
        <Modal
          visible={showDeleteUserModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => {
            console.log("Dialogue Closed");
          }}
        >
          <View style={[styles.window]}>
            <View style={styles.dialogue}>
              {/*<TouchableOpacity style={{ alignSelf: "flex-end", marginTop: 20, marginEnd: 10 }} onPress={this._onCloseButtonPressed}>
                <Image source={require("./images/iconCircleclose.png")} />
              </TouchableOpacity>*/}
              <Text
                allowFontScaling={false}
                style={[
                  styles.modalHeaderText,
                  { marginTop: 25, marginBottom: 25 },
                ]}
              >
                Are you sure?
              </Text>
              <Text allowFontScaling={false} style={styles.modalBodyText}>
                {
                  "Your account will be permanently deleted from Love Sweat Fitness.\nAnd if you have an active subscription, please cancel it first."
                }
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  width: "100%",
                  marginBottom: 20,
                }}
              >
                <TouchableOpacity onPress={this._deleteUser}>
                  <View style={[this.shadowBottom(2), styles.button1]}>
                    <Text allowFontScaling={false} style={styles.button1Text}>
                      YES, DO IT.
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this._onDeleteUserCloseButtonPressed}
                >
                  <View style={[this.shadowBottom(15), styles.button2]}>
                    <Text allowFontScaling={false} style={styles.button2Text}>
                      NO, WAIT.
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  renderLogoutModal() {
    const { showLogoutModal } = this.state;

    return (
      <View style={styles.modalContainer}>
        <Modal
          visible={showLogoutModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => {
            console.log("Dialogue Closed");
          }}
        >
          <View style={[styles.window]}>
            <View style={styles.dialogue}>
              {/*<TouchableOpacity style={{ alignSelf: "flex-end", marginTop: 20, marginEnd: 10 }} onPress={this._onCloseButtonPressed}>
                <Image source={require("./images/iconCircleclose.png")} />
              </TouchableOpacity>*/}
              <Text
                allowFontScaling={false}
                style={[
                  styles.modalHeaderText,
                  { marginTop: 25, marginBottom: 25 },
                ]}
              >
                Are you sure?
              </Text>
              <Text allowFontScaling={false} style={styles.modalBodyText}>
                You will be logged out of Love Sweat Fitness
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  width: "100%",
                  marginBottom: 20,
                }}
              >
                <TouchableOpacity onPress={this._logout}>
                  <View style={[this.shadowBottom(2), styles.button1]}>
                    <Text allowFontScaling={false} style={styles.button1Text}>
                      YES, DO IT.
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._onCloseButtonPressed}>
                  <View style={[this.shadowBottom(15), styles.button2]}>
                    <Text allowFontScaling={false} style={styles.button2Text}>
                      NO, WAIT.
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  render() {
    // console.log("Settings page render");
    // console.log("this.props.screenProps : " + this.props.screenProps);
    // for (let [tag, item] of Object.entries(this.props)) {
    //   console.log(tag)
    //   console.log(item)
    // }
    const { userLevel, level } = this.props.screenProps;
    // console.log("userLevel : " + userLevel);
    const colors = [colorNew.darkPink, colorNew.lightPink];
    if (userLevel || level) {
      return (
        <View
          style={{
            width: width,
            backgroundColor: "#fff",
            marginTop: 0,
            height: height,
          }}
        >
          <HowItWorksModal
            onDismiss={() => this.setState({ showHowItWorks: false })}
            visible={this.state.showHowItWorks}
          />
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={colors}
            style={styles.linearGradient}
          >
            <SafeAreaView forceInset={{ top: "always" }}>
              {this.renderSectionList()}
              {this.renderLogoutModal()}
              {this.renderDeleteUserModal()}
              {this.renderSubscriptionModal()}
            </SafeAreaView>
          </LinearGradient>
        </View>
      );
    }

    return null;
  }
}

const styles = {
  container: {
    width: "100%",
    height: "85%",
    marginTop: "1%",
    borderRadius: 40,
    marginTop: Platform.OS === "android" ? 10 : 40,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    width: 88,
    height: 15,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0.5,
    color: color.black,
    marginLeft: 18,
  },
  rowText: {
    width: 63,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    color: color.black,
  },
  membershipPill: {
    width: "30%",
    height: 25,
    borderRadius: 12.5,
    backgroundColor: color.mediumAqua,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 15,
    left: 200,
  },
  pillText: {
    width: 107,
    height: 15,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0.5,
    textAlign: "center",
    color: color.black,
  },
  modalContainer: {
    flex: 1,
  },
  window: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dialogue: {
    width: "90%",
    borderRadius: 50,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  modalHeaderText: {
    width: 126,
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
  },
  modalBodyText: {
    width: 281,
    height: 110,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
    marginTop: 5,
    marginBottom: 10,
  },
  button1: {
    width: 140,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colorNew.darkPink,
    justifyContent: "center",
    alignItems: "center",
  },
  button1Text: {
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink,
  },
  button2: {
    width: 140,
    height: 48,
    borderRadius: 100,
    backgroundColor: colorNew.darkPink,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    borderColor: "#fff",
    borderWidth: 0.5,
    shadowRadius: 15,
    shadowOpacity: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  linearGradient: {
    width: "100%",
    height: "100%",
    padding: "8%",
    paddingTop: Platform.select({
      ios: 100,
      android: 25,
    }),
  },
  bubbleText: {
    fontFamily: "SF Pro Text",
    fontSize: 8,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: 15,
    width: 107,
    height: 15,
    color: color.white,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  bubbleDefault: {
    padding: 10,
    height: 25,
    backgroundColor: "#fff",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  bubbleLevelText: {
    fontFamily: "SF Pro Text",
    fontSize: 7,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: 15,
    width: "90%",
    height: 15,
    color: color.white,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  bubbleLevelTextDefault: {
    fontFamily: "SF Pro Text",
    fontSize: 7,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: 15,
    width: "90%",
    height: 15,
    color: colorNew.bgGrey,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  bubbleLevelSelected: {
    padding: 4,
    height: 25,
    backgroundColor: color.mediumPink,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  bubbleLevelDefault: {
    padding: 4,
    height: 25,
    borderColor: colorNew.bgGrey,
    backgroundColor: "#fff",
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button2Text: {
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff",
    textAlign: "center",
  },
};
