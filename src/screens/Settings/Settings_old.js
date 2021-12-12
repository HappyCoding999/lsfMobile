import React, { Component } from "react";
import { Platform, View, Text, Dimensions, SectionList, Modal, TouchableOpacity, Image, Linking } from "react-native";
import { ListItem } from "react-native-elements"
import { color } from "../../modules/styles/theme";
import { SafeAreaView } from "react-navigation"
import { Subscriptions as Subscription } from "../../components/common"


const { width } = Dimensions.get('screen');

var appSection = [
  { name: "Contact Us", index: 3 },
  { name: "FAQ", index: 4 },
  { name: "Log Out Account", index: 5 }
]

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.onPressRow = this.onPressRow.bind(this)
    this.state = {
      fitnessLevel: [],
      showLogoutModal: false,
      showSubscriptionsModal: false
    };
  }

  _onCloseSubscriptionModalPressed = () => {
    console.log("close subscription modal!");
    this.setState({
      showSubscriptionsModal: false
    })
  }

  _onCloseButtonPressed = () => {
    this.setState({
      showLogoutModal: false
    })
  }

  _onLogoutHandler = () => {
    this.setState({
      showLogoutModal: true
    })
  }

  _logout = () => {
    this.setState({
      showLogoutModal: false
    }, () => this.props.screenProps.onLogout());
  }

  onPressRow({ item }) {
    const { purchasePlatform } = this.props.screenProps;

    if (item.index === 0) {
      this.props.navigation.navigate("EditProfile", { ...this.props.screenProps })
    } else if (item.index === 1) {
      this.props.navigation.navigate('SettingsLevel');
    } else if (item.index === 2) {
      if (purchasePlatform === "stripe") {
        Linking.openURL("https://lovesweatfitness.com/lsf-login-form");
      } else {
        this.props.navigation.navigate('SettingsSubscriptions')
      }
    } else if (item.index === 3) {

      Linking.openURL("mailto:support@lovesweatfitness.com?subject=Feedback");

    } else if (item.index === 4) {
      this.props.navigation.navigate('SettingsFAQ')
    } else if (item.index === 5) {
      this._onLogoutHandler()
    }
  }

  renderSectionHeader = ({ section }) => {
    const { index } = section.data[0];
    const onAndroid = Platform.OS === "android";
    const style = {
      backgroundColor: color.palePink,
      height: 40,
      justifyContent: "center",
      marginTop: index === 0 && onAndroid ? 20 : 0
    };

    return (
      <View style={style}>
        <Text allowFontScaling={false} style={styles.sectionTitle}>{section.title}</Text>
      </View>
    );
  };

  renderItem = ({ item }) => (

    <View>
      <ListItem
        title={item.name}
        titleStyle={{
          width: "100%",
          height: 40,
          fontFamily: "SF Pro Text",
          fontSize: 14,
          fontWeight: "bold",
          fontStyle: "normal",
          lineHeight: 20,
          letterSpacing: 0.5,
          color: color.black,
          marginTop: 30
        }}
        subtitleStyle={{ color: 'white' }}
        chevronColor={color.black}
        chevron
        onPress={() => this.onPressRow({ item })}
        allowFontScaling={false}
        normalize={14}
        containerStyle={{ borderBottomColor: color.lightGrey }}

      />
      {item.name === "Free" && item.purchasePlatform !== "stripe" ?
        <TouchableOpacity
          style={styles.membershipPill}
          onPress={this._navigateToSubscriptionsScreen}
        >
          <View>
            <Text style={styles.pillText}>RESTORE
            </Text>
          </View>
        </TouchableOpacity>
        :
        <View></View>
      }
    </View>
  );

  _navigateToSubscriptionsScreen = () => {
    this.props.navigation.navigate("Subscriptions")
  }

  keyExtractor(item) {
    return item.name
  }

  renderSectionList() {
    const { userLevel, membership, purchasePlatform } = this.props.screenProps;
    const subscriptionSection = [
      { name: membership || "Free", index: 2, purchasePlatform }
    ];
    const fitnessLevelHeader = {
      name: userLevel,
      index: 1
    };
    const accountLevel = {
      name: "Edit Profile",
      index: 0
    }

    return (
      <View style={styles.container}>
        <SectionList
          sections={[
            { title: "ACCOUNT", data: [accountLevel] },
            { title: "FITNESS LEVEL", data: [fitnessLevelHeader] },
            { title: "SUBSCRIPTION", data: subscriptionSection },
            { title: "APP", data: appSection }
          ]}
          renderSectionHeader={this.renderSectionHeader}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor} />
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
        <Subscription
          onClose={this._onCloseSubscriptionModalPressed} />
      </Modal>
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
          onRequestClose={() => { console.log("Dialogue Closed") }}>
          <View style={styles.window}>
            <View style={styles.dialogue}>
              <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: -20, marginEnd: -10 }} onPress={this._onCloseButtonPressed}>
                <Image source={require("./images/iconCircleclose.png")} />
              </TouchableOpacity>
              <Text allowFontScaling={false} style={styles.modalHeaderText}>Are you sure?</Text>
              <Text allowFontScaling={false} style={styles.modalBodyText}>You will be logged out of Love Sweat Fitness</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
                <TouchableOpacity
                  onPress={this._logout}>
                  <View style={styles.button1}>
                    <Text allowFontScaling={false} style={styles.button1Text}>YES, DO IT</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this._onCloseButtonPressed}>
                  <View style={styles.button2}>
                    <Text allowFontScaling={false} style={styles.button2Text}>NO, WAIT</Text>
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
    const { userLevel } = this.props.screenProps;

    if (userLevel) {
      return (
        <View style={{ width: width, backgroundColor: "#fff", marginTop: 40 }}>
          <SafeAreaView forceInset={{ top: "always" }}>
            {this.renderSectionList()}
            {this.renderLogoutModal()}
            {this.renderSubscriptionModal()}
          </SafeAreaView>
        </View>
      );
    }

    return null;
  }

}

const styles = {
  container: {
    width: "100%",
    backgroundColor: "#fff"
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
    marginLeft: 18
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
    color: color.black
  },
  membershipPill: {
    width: 124,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: color.mediumAqua,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 35,
    left: 200

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
    color: color.black
  },
  modalContainer: {
    flex: 1,
  },
  window: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  dialogue: {
    width: "90%",
    height: 272,
    backgroundColor: "#fff",
    alignItems: "center"
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
    color: color.black
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
    marginTop: 12
  },
  button1: {
    width: 140,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: color.mediumPink,
    justifyContent: "center",
    alignItems: "center"
  },
  button1Text: {
    width: 80,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink
  },
  button2: {
    width: 140,
    height: 48,
    borderRadius: 100,
    backgroundColor: color.mediumPink,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button2Text: {
    width: 73,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff",
    textAlign: "center"

  }



}

