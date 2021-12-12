import React, { Component } from "react";
import { EventRegister } from "react-native-event-listeners";
import { InteractionManager, View, Text, Image, TouchableOpacity, SectionList, Dimensions, ImageBackground, FlatList, Modal } from "react-native";
import { getFeaturedChallenges, getBonusChallenges } from "../../../../DataStore";
import { LoadingComponent } from "../../../../components/common";
import { color } from '../../../../modules/styles/theme'
import { WebView } from 'react-native-webview';
import { Header } from 'react-native-elements';
import moment from 'moment';
import { last } from 'lodash';

const { width } = Dimensions.get("window");


class SweatChallenges extends Component {

  state = {
    featuredChallenges: null,
    bonusChallenges: null,
    showSignUpModal: false,
    featuredImageLink: null
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this._fetchFeaturedChallenges();
      this._fetchBonusChallenges();
    });
  }

  _fetchFeaturedChallenges() {
    getFeaturedChallenges()
      .then(featuredChallenges => {
        this.setState({ 
          featuredChallenges,
          featuredImageLink: last(featuredChallenges).featuredImageLink
        });
      });
  }

  _fetchBonusChallenges() {
    getBonusChallenges()
      .then(bonusChallenges => this.setState({ bonusChallenges }));
  }

  render() {
    const { featuredChallenges: featured, bonusChallenges: challenges } = this.state;

    if (featured === null || challenges === null) { return <LoadingComponent />; }

    if (challenges.length > 0) {
      return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>

          <SectionList
            contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}
            sections={[
              { title: "FEATURED CHALLENGE", data: [featured] },
              { title: "DAILY BONUS SWEATS", data: [challenges] }
            ]}
            keyExtractor={(item, idx) => item + idx}
            renderSectionHeader={({ section }) => {

              if (section.title === "FEATURED CHALLENGE") {
                return (
                  <View style={styles.sectionHeader}>
                    <Image source={require("./images/timeTitleCopy.png")} />
                  </View>
                );
              } else if (section.title === "DAILY BONUS SWEATS") {
                return (
                  <View style={styles.sectionHeader}>
                    <Image source={require("./images/timeTitleCopy2.png")} />
                  </View>
                );
              }
            }}

            renderItem={this._renderItem}
          />

          {this.renderSignUpModal()}
        </View>
      );
    }
  }

  renderSignUpModal() {
    return (
      <Modal animationType='slide' visible={this.state.showSignUpModal} onRequestClose={() => {}}>
        <View style={{ flex: 1 }}>
          <Header 
            leftComponent={
              <TouchableOpacity onPress={() => {
                this.setState({ showSignUpModal: false })
              }}>
                <Image source={require("./images/iconXPink.png")} />
              </TouchableOpacity>
            }
            centerComponent={{ text: '', style: styles.headerTitle }} 
            backgroundColor={"#ffffff"}
            outerContainerStyles={{ borderBottomWidth: 0 }}
          />
          <WebView 
            source={{ uri: this.state.featuredImageLink }} 
          />
        </View>
      </Modal>
    )
  }

  _linkToChallengeDashOrWebview = (featured) => {

    // check to see if challenge is active
    const { challengeActive } = this.props.screenProps;

    // if there currently is a challenge, navigate to challenge dash otherwise link to a web view
    if (challengeActive) {
      return this.props.navigation.navigate('ChallengeDashboard');
    } else {
      this.setState({
        showSignUpModal: true
      })
    }
  }

  _renderItem = ({ item, section }) => {

    const { bonusChallenges: challenges } = this.state;

    if (section.title === "FEATURED CHALLENGE") {

      // get the latest featured challenge from the db
      const featured = last(item);

      return (
        <TouchableOpacity
          activeOpacity={.9}
          onPress={() => this._linkToChallengeDashOrWebview(featured)}>
          <View style={{ width: width * .90, height: 250, backgroundColor: 'white' }}>
            <Image style={{ width: "100%", height: "100%", resizeMode: 'contain' }} source={{ uri: featured.featuredImageUrl }} />
          </View>
        </TouchableOpacity>
      );
    } else

      return (
        <FlatList
          data={challenges}
          numColumns={2}
          contentContainerStyle={styles.gridcontainer}
          renderItem={this.renderGridItem}
          keyExtractor={(item, idx) => item + idx}
        />
      );
  }

  onButtonPressed = workoutChallenge => {
    const { exercisesInCircuit, title } = workoutChallenge;
    const tags = exercisesInCircuit.split(",").map(e => parseInt(e));
    const passedProps = {
      ...workoutChallenge,
      tags
    };

    this.props.navigation.navigate("BonusChallenge", passedProps);
  }

  renderGridItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ justifyContent: "space-around", padding: 10 }}
        activeOpacity={.9}
        onPress={() => EventRegister.emit("paywallEvent", () => this.onButtonPressed(item))}>
        <View style={{ width: 152, backgroundColor: "#ddd", height: 100, overflow: "hidden" }}>
          <ImageBackground style={{ width: "100%", height: 100 }} source={{ uri: item.featureImageUrl }} />
        </View>
        <Text allowFontScaling={true} adjustsFontSizeToFit={true} minimumFontScale={.70} numberOfLines={1} ellipsizeMode={"tail"} style={styles.gridText}>{item.title.toUpperCase()}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = {
  titleText: {
    width: "100%",
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "900",
    fontStyle: "normal",
    letterSpacing: 2,
    textAlign: "center",
    color: color.lightPink,
    marginTop: 30,
    textShadowColor: color.hotPink
  },
  thumbnailText: {
    width: "100%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    textAlign: "center",
    color: color.black,
    marginTop: 8
  },
  sectionHeader: {
    width: width,
    height: 65,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  list: {
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: 'column',
    width: width,
    backgroundColor: "#ddd"
  },
  gridcontainer: {
    width: "100%",
    height: 500,
    backgroundColor: "#333",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  gridText: {
    width: "96%",
    height: 19,
    fontFamily: "SF Pro Text",
    fontSize: 13,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    color: color.darkGrey,
    marginTop: 8
  },
  headerTitle: {
    color: color.hotPink,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold"
  }
}

export { SweatChallenges };