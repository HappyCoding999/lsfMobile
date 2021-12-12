import React, { Component } from "react";
import { View, ImageBackground, Image, Text, TouchableOpacity, Dimensions, ScrollView, Linking, Modal, Alert, FlatList, Animated, TouchableHighlight } from "react-native";
import { AsyncStorage } from 'react-native';
import { color } from "../../modules/styles/theme";
import Goals from "../Profile/tabs/Goals/Goals";
import { User, getDaily10 } from "../../DataStore";
import { EventRegister } from "react-native-event-listeners";
import { sortBy, uniqBy, isEmpty } from "lodash";
import InstagramShareModal from "../InstagramShareModal"
import ShareModal from "../ShareModal"
import DailySweat from "../Daily10/DailySweat";
import DailySweatCompletion from "../Daily10/DailySweatCompletion";
import HydrationTracker from "../HydrationTracker";
import Journal from "../Journal";
import SelfCareLog from "../SelfCareLog";
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment';
import { captureRef } from "react-native-view-shot";
import Spotify from 'rn-spotify-sdk';
import Playlists from "../Workouts/Playlists"
import Video from "react-native-video"
import Wave from "react-native-waveview"
import { LoadingComponent } from "../../components/common";
import { getWeeklyWorkoutSchedule } from "../../utils";
import Svg, { Text as SvgText, TSpan } from "react-native-svg";
import ChallengeDashboard from '../ChallengeDashboard';
import { WebView } from 'react-native-webview';
import { Header } from 'react-native-elements';
import CompletionModal from '../Workouts/CompletionModalStack'

const { height, width } = Dimensions.get("window");


const utcDateToString = (momentInUTC) => {
  let s = moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  // console.warn(s);
  return s;
};


export default class extends Component {
  constructor(props) {

    super(props);


    this.state = {
      currentDay: null,
      bottles: 0,
      bottleCount: 0,
      quote: "Exercise is a celebration of what your body can do. Not a punishment for what you ate.",
      showInspoModal: false,
      showShareModal: false,
      // showJournalModal: false,
      showDailySweatModal: false,
      showHydrationTracker: false,
      showDailySweatCompletionModal: false,
      showSelfCareModal: false,
      shareImage: "",
      spotifyInitialized: false,
      spotifyLoggedIn: false,
      playlist: "",
      showPlaylist: false,
      trackList: [],
      showNutritionPlanModal: false,
      showCompletionModal: false,
      selfLoveData: null
    };
  }


  render() {

    const { completedWorkouts, weeklyWorkoutSchedule, challengeActive } = this.props.screenProps;
    this.completedWorkoutsWeek = completedWorkouts;

    if (weeklyWorkoutSchedule && weeklyWorkoutSchedule.today) {
      const { today } = weeklyWorkoutSchedule;

      return (
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
          <ScrollView>
            {this.renderTodaysWorkout(today)}
            {this.renderGoals()}
            {this.renderDaily10()}
            {challengeActive ? this.renderCurrentChallenge() : null}
            {/*{this.renderJams()}*/}
            {/*{this.renderLSFHighlights()}*/}
            {this.renderHydration()}
            {this.renderNutritionPlans()}
            {this.renderInspiration()}
            {this.renderSelfcareModal()}
          </ScrollView>
          {this.renderShare()}
          {this._renderDaily10Modals()}
          {this._renderHydrationTracker()}
          {this._renderJournalModals()}
          {this._renderNutritionPlanModal()}
        </View>
      );
    }

    return (
      <View style={{ width, flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LoadingComponent />
      </View>
    );
  }

  _renderNutritionPlanModal() {

    const { nutritionPlanLink } = this.props.screenProps;

    return (
      <Modal animationType='slide' visible={this.state.showNutritionPlanModal} onRequestClose={() => {}}>
        <View style={{ flex: 1 }}>
          <Header 
            leftComponent={
              <TouchableOpacity onPress={() => {
                this.setState({ showNutritionPlanModal: false })
              }}>
                <Image source={require("./images/iconXPink.png")} />
              </TouchableOpacity>
            }
            centerComponent={{ text: 'NUTRITION PLANS', style: styles.headerTitle }} 
            backgroundColor={"#ffffff"}
            outerContainerStyles={{ borderBottomWidth: 0 }}
          />
          <WebView 
            source={{ uri: nutritionPlanLink }} 
          />
        </View>
      </Modal>
    )
  }

  increaseBottles = () => {

    this.setState({
      bottles: this.state.bottles + 30,
      bottleCount: this.state.bottleCount + 1
    })

    if (this.state.bottleCount < 4) {
      { this._waveRect && this._waveRect.setWaterHeight(this.state.bottles + 30) }
    }

  }

  decreaseBottles = () => {
    if (this.state.bottleCount === 0) {
      return;
    }
    this.setState({
      bottles: this.state.bottles - 30,
      bottleCount: this.state.bottleCount - 1
    })

    if (this.state.bottleCount <= 4) {
      { this._waveRect && this._waveRect.setWaterHeight(this.state.bottles - 30) }
    }
  }

  componentDidMount() {
    Spotify.isInitializedAsync().then((result) => {
      if (!result) {
        // initialize spotify
        var spotifyOptions = {
          "clientID": "844fd0f2a4ff452c9ce51f323ea667ff",
          "sessionUserDefaultsKey": "SpotifySession",
          "redirectURL": "lsfapp://spotify",
          "scopes": ["user-read-private", "playlist-read", "playlist-read-private", "streaming"],
          // "tokenSwapURL" : "https://lsf-development.firebaseapp.com:3000/swap",
          // "tokenRefreshURL" : "https://lsf-development.firebaseapp.com:3000/refresh"
        };
        Spotify.initialize(spotifyOptions).then((result) => {
          // update UI state
          this.setState({ spotifyInitialized: result });
          // handle initialization
          // console.log('spotify has been initialized');
        }).catch((error) => {
          Alert.alert("Error", error.message);
        });
      } else {
        // update UI state  
        this.setState({ spotifyInitialized: result });

        // handle logged in
        Spotify.isLoggedInAsync().then((result) => {
          console.log('isLoggedInAsync: ', result)
          this.setState({ spotifyLoggedIn: result });

        }).catch((err) => { console.log(err) });
      }
    }).catch((err) => { console.log(err) });

    // this._retrievePlaylistData();

    this.props.screenProps.closeLoadingModal();
  }

  spotifyLoginButtonWasPressed = () => {
    // log into Spotify
    Spotify.login().then((result) => {
      this.setState({ spotifyLoggedIn: result });
    }).catch((error) => {
      // error
      Alert.alert("Error", error.message);
    });
  }

  spotifyFreeButtonPressed() {

    Linking.openURL('spotify://open')

  }

  closePlaylist = () => {
    const { currentPlaylist } = this.props.screenProps;
    this.setState({
      showPlaylist: false
    }, () => this.setPlaylist(currentPlaylist))
  }

  _prepWeekdata(completed, workoutsForWeek) {
    return getWeeklyWorkoutSchedule(workoutsForWeek || []);
  }

  _showInspiration() {

    this.setState({
            showShareModal: true
          })

    // captureRef(this.refs["snapshot"], {
    //   format: "jpg",
    //   quality: 0.8
    // })
    //   .then(
    //     uri =>
    //       this.setState({
    //         showInspoModal: true,
    //         shareImage: uri
    //       }),
    //     error => alert("Oops, snapshot failed", error)
    //   );


  }

  _closeInspoModal() {
    this.setState({
      showInspoModal: false
    })
  }
  _closeShareModal() {
    this.setState({
      showShareModal: false
    })
  }

  setPlaylist = (playlist) => {

    if (this.state.showPlaylist === true) {
      this.setState({ showPlaylist: false })
    }

    this.setTrackList(playlist)

  }


  setTrackList = (playlist) => {
    const params = { Authorization: "playlist-read-private", limit: 50 }

    const basePrefix = "https://api.spotify.com/"
    const getTracks = playlist.tracks.href.replace(basePrefix, "")

    if (this.state.spotifyLoggedIn || this.state.spotifyInitialized) {
      Spotify.sendRequest(getTracks, 'GET', params, true).then((result) => {
        this.setState({
          playlist: playlist,
          trackList: result.items
        })
      }).catch(err => {
        console.log(err)
      });
    }
  }
  renderShare() {
    const { showShareModal } = this.state;
    console.log('renderShare')
    console.log(showShareModal)
    return (
      <View>
        <ShareModal
          visible={showShareModal}
          onClose={() => this._closeShareModal()}
        />
      </View>
    );
  }
  renderInspiration() {

    const { showInspoModal } = this.state;
    const { quote, challengeActive } = this.props.screenProps;

    return (
      <View style={[this.shadowTop(5), { marginTop: 20, marginBottom: 0, flexDirection: "column", justifyContent: "center", alignItems: "center" }]}>
        <InstagramShareModal
          shareImage={this.state.shareImage}
          visible={showInspoModal}
          quote={quote ? quote : this.state.quote}
          onClose={() => this._closeInspoModal()}
          onPostSuccessful={() => console.log("post successful")}
        />
        <View ref="snapshot" style={styles.mask}>
          {
            challengeActive ? 
            <ImageBackground
              style={styles.img}
              source={require("./images/lol_quote.png")}
              imageStyle={{ resizeMode: 'contain' }}>
              <Text allowFontScaling={false} style={styles.mainContent}>{quote ? quote : this.state.quote}</Text>
              <Text allowFontScaling={false} style={styles.signatureStyle}>Xo,{"\n"}Katie</Text>
            </ImageBackground>
            :
            <ImageBackground
              style={styles.img}
              source={require("./images/sleighQuoteBG.jpeg")}
              imageStyle={{ resizeMode: 'contain' }}>
              <Text allowFontScaling={false} style={styles.mainContent}>{quote ? quote : this.state.quote}</Text>
              <Text allowFontScaling={false} style={styles.signatureStyle}>Xo,{"\n"}Katie</Text>
            </ImageBackground>
          }
        </View>
        <TouchableOpacity
          style={{ marginTop: -60 }}
          activeOpacity={.8}
          onPress={() => this._showInspiration()}>
          <View style={{ justifyContent: "center", alignItems: "center", marginTop: 10, marginBottom: 10, borderRadius: 20, borderWidth: 2, borderColor: 'white', height: 40, width: 160 }}>
            <Text style={{ fontFamily: "SF Pro Text", fontSize: 15, color: 'white', fontWeight: 'bold' }}>SHARE THE LOVE</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderLSFHighlights() {

    return (
      <View style={[this.elevationShadowStyle(5), { flex: 1, width: '100%', height: 220 }]}>
        <View style={{ width: '100%', justifyContent: 'center', marginLeft: 20, height: 50 }}>
          <Image style={{ width: '70%', resizeMode: 'contain' }} source={require('./images/lsfHighlights.png')} />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fae8ee'}}>

            <View style={{ flex: 4, left: 20, top: 30 }}>
              <Text style={styles.highlightHeaderText}>New Receipe On The Blog</Text>
              <Text style={{}}>A healthy take on your favorite - PIZZA! You'll never go back to delivery after this!</Text>
            </View>
            <View style={{ flex: 1, height: 50, }}>
              <Image style={{ height: '100%', resizeMode: 'contain' }} source={require('./images/highlightsArrow.png')} />
            </View>

        </View>
      </View>
    )
  }

  renderHydration() {

    const { bottles, bottleCount } = this.state;

    return (
      <View style={this.elevationShadowStyle(5)}>
        <View style={styles.hydrationHeading}>
          <Image style={{ width: '90%', resizeMode: 'contain' }} source={require("./images/hydrationTracker.png")} />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", textAlign: "center", width: "100%" }}>
          <View style={{ justifyContent: "center", alignItems: "center", height: 60, width: 120, left: 25 }}>
            <TouchableOpacity onPress={this.decreaseBottles}>
              <Image style={{ height: '100%', resizeMode: 'contain' }} source={require("./images/stepperDown.png")} />
            </TouchableOpacity>
          </View>
          <View style={styles.waterContainer} >
            <Wave
              ref={ref => this._waveRect = ref}
              style={styles.wave}
              H={bottles}
              waveParams={[
                { A: 10, T: 180, fill: '#62c2ff' },
                { A: 15, T: 140, fill: '#0087dc' },
                { A: 20, T: 100, fill: '#1aa7ff' },
              ]}
              animated={true}
            />
            <View style={{ flex: 1, width: 85, height: 160 }}>
              <Image
                style={{ backgroundColor: 'transparent', width: '100%', height: '100%', resizeMode: 'contain', justifyContent: "center", alignItems: "center" }}
                source={require("./images/waterBottle.png")}
              />
              <View style={{ flex: 1, alignItems: 'center', top: 6 }}>
                <Text adjustsFontSizeToFit={true} allowFontScaling={false} style={styles.waterBottleText}>
                  {bottleCount != 0 ? bottleCount : ''}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center", height: 60, width: 120, right: 25 }}>
            <TouchableOpacity onPress={this.increaseBottles}>
              <Image style={{ height: '100%', resizeMode: 'contain' }} source={require("./images/stepperUp.png")} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={{ alignItems: "center", justifyContent: "center", marginTop: 32 }}
          //onPress={() => EventRegister.emit("paywallEvent", this._openHydrationTrackerModal)}
          onPress={this._openHydrationTrackerModal}
        >
          <View style={{ width: 150, height: 36, borderColor: '#f09ab8', borderRadius: 0, borderWidth: 2, justifyContent: "center", alignItems: "center", marginBottom: 20 }}>
            <Text allowFontScaling={false} style={styles.logButtonText}>LOG {bottleCount} BOTTLES</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderTrackList() {

    const trackList = (this.state.trackList && this.state.trackList.length) ? this.state.trackList : this.props.screenProps.trackList;

    if (trackList) {
      return (
        <View style={{ width: 200, height: 200, marginTop: 20 }}>
          <FlatList
            data={trackList}
            keyExtractor={(item, index) => item + index}
            ItemSeparatorComponent={() => <View style={{ width: 200, height: 1, backgroundColor: '#ddd' }} />}
            renderItem={({ item, index }) =>
              <View style={{ height: 50, justifyContent: "center", alignItems: "flex-start" }}>
                <Text allowFontScaling={false} numberOfLines={1} ellipsizeMode={"tail"}>{index + 1}  {item.track.name}</Text>
              </View>}
          />
        </View>
      );
    } else {
      return (
        <View></View>
      );
    }
  }

  renderPlaylistInfo() {

    const { currentPlaylist: playlist } = this.props.screenProps;


    if (playlist) {
      return (
        <View style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start" }}>
          {this.renderTrackList()}
        </View>
      );
    } else {
      return (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <Text>NO PLAYLIST SELECTED</Text>
        </View>
      );
    }
  }

  renderSpotifyButtons() {


    const { spotifyInitialized } = this.state;
    const { spotifyLoggedIn } = this.props.screenProps;


    if (spotifyInitialized || spotifyLoggedIn) {
      return (
        <View style={{ width: 200, height: 200, justifyContent: 'center', alignItems: "center", flexDirection: "column" }}>
          {this.renderPlaylistInfo()}
        </View>
      );
    } else {
      return (
        <View style={{ width: 200, height: 200, flexDirection: "column", justifyContent: "center", alignItems: "flex-start" }}>
          <TouchableOpacity
            onPress={this.spotifyFreeButtonPressed}>
            <View style={{ justifyContent: "flex-start", alignItems: "center", flexDirection: "row", width: 150 }}>
              <Image style={{ width: 40, height: 40, margin: 20 }} source={require("./images/spotify-icon-green.png")} resizeMode={"contain"} />
              <Text>Spotify Free</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.spotifyLoginButtonWasPressed}>
            <View style={{ justifyContent: "flex-start", alignItems: "center", flexDirection: "row", width: 150 }}>
              <Image style={{ width: 40, height: 40, margin: 20 }} source={require("./images/spotify-icon-green.png")} resizeMode={"contain"} />
              <Text>Spotify Premium</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  }

  renderJams = () => {
    return (
      <View>
        <View style={styles.heading}>
          <Image source={require("./images/timeTitle.png")} />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <Image style={{ marginLeft: 20 }} source={require("./images/illustrationSweatjams.png")} />
          {this.renderSpotifyButtons()}
        </View>
        <TouchableOpacity
          style={{ alignItems: "center", justifyContent: "center", marginTop: 32 }}
          onPress={() => EventRegister.emit("paywallEvent", this._selectPlaylist)}>
          <View style={{ width: 220, height: 36, borderColor: color.textColor, borderRadius: 18, borderWidth: 2, justifyContent: "center", alignItems: "center" }}>
            <Text allowFontScaling={false} style={styles.logButtonText}>SELECT A PLAYLIST</Text>
          </View>
        </TouchableOpacity>
        <Modal
          visible={this.state.showPlaylist}
          animationType={"slide"}
          onRequestClose={() => ""} >
          {/* <Playlists action={this.closePlaylist} onRowPressed={playlist => this.setPlaylist(playlist)} /> */}
          <Playlists action={this.closePlaylist} />
        </Modal>
      </View>
    );
  }

  renderCurrentChallenge = () => {
    this.props.screenProps.startWorkout = this._startWorkout;
    this.props.screenProps.openDailySweatModal = this._openDailySweatModal;

    const { challengeFlag, lotsOfLoveChallenge, springSlimDownChallenge, joinedChallenge, currentChallengeImage } = this.props.screenProps;

    return (
      <View style={this.elevationShadowStyle(5)}>
        <View style={[this.shadowTop(5), { flex: 1 }]}>
          <View style={styles.currentChallengeBox}>
            <Text allowFontScaling={false} style={styles.currentChallengeText}>CURRENT CHALLENGE</Text>
          </View>
          <View style={{ flex: 1, width: '100%', height: 150, backgroundColor: '#e16d92' }}>
            <Image style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'contain' }} source={{ uri: currentChallengeImage }} />
          </View>
          <View style={{ flex: 1, justifyContent: 'center', marginTop: 1, width: '100%', height: 80, backgroundColor: '#e16d92' }}>
            <TouchableOpacity 
              style={{ fleX: 1, justifyContent: 'center', alignItems: 'center'  }}
              onPress={() => this._joinChallenge()}
            >
              <View style={styles.joinButtonBox}>
                <Text style={styles.joinText}>{springSlimDownChallenge ? 'START NOW' : 'JOIN NOW'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  _joinChallenge = () => {
    console.log("_joinChallenge");
    this.props.navigation.navigate('OutsideWorkout')
    return;

    const { springSlimDownChallenge } = this.props.screenProps;

    // place a flag in the user object to show that they joined the challenge
    if (!springSlimDownChallenge) {
      // save user email for tracking
      this.props.screenProps.flagChallenge();
    }

    this.props.navigation.navigate('ChallengeDashboard')
  }

  renderRow = (data) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <Text style={{ fontSize: 10, color: color.white }}>{'\u2022'}</Text>
        <Text style={styles.challengeBullet}>{data}</Text>
      </View>
    );
  }

  _selectPlaylist = () => {
    const { spotifyLoggedIn, spotifyAuthCancelled, authorizeSpotify, fetchPlaylistData, resetSpotifyAuthFlow } = this.props.screenProps;
    if (spotifyAuthCancelled) {
      return resetSpotifyAuthFlow();
    }

    if (spotifyLoggedIn) {
      fetchPlaylistData()
        .then(() => this.setState({ showPlaylist: true }));
    } else {
      // this.spotifyLoginButtonWasPressed();
      authorizeSpotify()
        .then(this._selectPlaylist)
        .catch((err) => Alert.alert(err));
    }
  }

  renderTodayMoves() {
    const { daily10 } = this.props.screenProps;

    if (daily10 !== null) {
      return (
        <View>
          <View style={styles.heading}>
            <Image source={require("./images/lsfDaily10.png")} />
          </View>
          <View style={{ justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
            <View style={styles.pinkQuote}>
              <Text allowFontScaling={false} style={styles.quoteText}>Your daily 10 minute workout</Text>
            </View>
          </View>
          <View style={styles.scrollContainer}>
            <View style={styles.circleCell}>
              <View style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                borderRadius: 60
              }}>
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
              <View style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                borderRadius: 60
              }}>
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
              <View style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                borderRadius: 60
              }}>
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
          <TouchableOpacity activeOpacity={0.5} onPress={this._openDailySweatModal}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", margin: 14, top: height * .03 }}>
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
    const dayOfTheWeek = moment().format('dddd');

    return (
      <View style={this.elevationShadowStyle(5)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fae8ee', top: 0, left: 0, width: "100%", height: 60 }}>
          <Image style={{ width: '90%', resizeMode: 'contain' }} source={require('./images/daily10Header.png')} />
        </View>
        <ImageBackground style={{ width: "100%", height: 255 }} source={{ uri: ( daily10.ssuPhoto != undefined ? daily10.ssuPhoto : null ) }}>

          <View style={{ position: "absolute", backgroundColor: "rgba(147, 122, 132, 0.20)", top: 0, left: 0, width: "100%", height: "100%" }}></View>
          {
            !isEmpty(daily10) ?
              <View style={{ flex: 1, justifyContent: 'center', top: 20 }}>
                <Text allowFontScaling={false} style={styles.ssuDOWHeaderText}>{dayOfTheWeek.toUpperCase()}</Text>
              </View>
            :
              <View style={{ flex: 1, justifyContent: 'center', top: 20 }}>
                <TouchableOpacity onPress={this.reloadDaily10}>
                  <Text allowFontScaling={false} style={[{...styles.ssuDOWHeaderText}, { fontSize: 22, color: 'white' }]}>Press to reload</Text>
                </TouchableOpacity>
              </View>
          }

        </ImageBackground>
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#fae8ee', top: 0, left: 0, width: "100%", height: 70 }}>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            activeOpacity={0.5}
            onPress={this._openDailySweatModal}
            disabled={!isEmpty(daily10) ? false : true}
          >
            <View style={styles.startButton}>
              <Text allowFontScaling={false} style={styles.startButtonText}>GET TODAY'S MOVES</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  reloadDaily10 = async () => {
    console.log('reloading daily 10')

    const { _fetchDaily10 } = this.props.screenProps;

    try {

      let daily10 = await _fetchDaily10();

    } catch (error) {
      console.log('error reloading daily 10 data');
    }
  }

  _openHydrationTrackerModal = () => {
    console.log("_openHydrationTrackerModal clicked")
    this.setState({
      showHydrationTracker: true
    });
  }
  _closeHydrationTrackerModal = () => {
    console.log("HydrationTrackerModal")
    this.setState({ showHydrationTracker: false });
  }
  _openDailySweatModal = () => {
    this.setState({
      showDailySweatModal: true
    });
    // this.setState({
    //   showJournalModal: true
    // });
    
  }

  _closeDailySweatModal = () => {
    console.log("close")
    this.setState({ showDailySweatModal: false });
    //this.setState({ showJournalModal: false });
  }

  _closeDaily10CompletionModal = () => {
    this.setState({
      showDailySweatCompletionModal: false
    });
  };
  _renderJournalModals() 
  {
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
  
  _renderHydrationTracker() {
    const { showHydrationTracker} = this.state;
    console.log("_renderHydrationTracker - showHydrationTracker")
    console.log(showHydrationTracker)
    return (
      <View>
        <HydrationTracker
          visible={showHydrationTracker}
          onClose={this._closeHydrationTrackerModal}
          animType="none"
        />
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
        move4: null
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
      endScreens
    } = daily10;

    return {
      move1: { imgUrl: move1ImageUrl, name: move1Name, reps: move1Reps },
      move2: { imgUrl: move2ImageUrl, name: move2Name, reps: move2Reps },
      move3: { imgUrl: move3ImageUrl, name: move3Name, reps: move3Reps },
      move4: { imgUrl: move4ImageUrl, name: move4Name, reps: move4Reps },
      endScreen: endScreens
    };
  }

  _onDaily10Done = () => {
    this.setState({
      showDailySweatModal: false,
      showDailySweatCompletionModal: true
    });
  }

  addToCalendar = (title, startDateUTC) => {

    title = (title != undefined ? title : '')

    const eventConfig = {
      title,
      startDate: utcDateToString(startDateUTC),
      endDate: utcDateToString(moment.utc(startDateUTC).add(1, 'hours')),
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
    const { goals, achievements, historicalWeight, measurements, saveWeightGoal, saveWeight } = this.props.screenProps;
    const { headerQuote, hightlightCardData } = this.props

    return (
      <View style={ [this.elevationShadowStyle(5), { flex: 1, alignItems: "center" }]}>
        <View style={styles.highlightHeading}>
          <Text allowFontScaling={false} style={styles.headingText}>#GOALS</Text>
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


  renderTodaysWorkout(today) {

    const nowUTC = moment.utc();

    let uri;

    if (today && today.imageUrl != undefined) {
      uri = { uri: today.imageUrl }
    } else {
      uri = { uri: null }
    }

    return (
      <View style={[this.elevationShadowStyle(5), { flex: 1 }]}>
        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fae8ee', width: "100%", height: 60}}>
          <Image style={{ width: '90%', height: 60, resizeMode: 'contain' }} source={require('./images/sweatSesh.png')} />
        </View>
        <View style={{ width: '100%', height: 247.7 }}>
          <ImageBackground style={{ width: "100%", height: '100%' }} source={uri}>
            <View style={{ position: "absolute", backgroundColor: "rgba(147, 122, 132, 0.20)", top: 0, left: 0, width: "100%", height: "100%" }}></View>

            <View style={{ width: '100%', alignItems: 'flex-end', marginRight: 40}}>
              <TouchableOpacity
                style={{ height: 42, marginTop: 20, marginRight: 20 }}
                onPress={() => {

                  let description = '';

                  if (today && today.description != undefined) {
                    description = today.description;
                  }

                  this.addToCalendar(description, nowUTC)
                }}>
                <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "flex-end" }}>
                  <Image style={{ width: 42, height: 42 }} source={require("./images/calendarIcon.png")} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
              <Text style={styles.descriptions}>
                { (today && today.description != undefined) ? today.description.toUpperCase() : 'Today\'s Workout'}
              </Text>
            </View>

          </ImageBackground>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fae8ee', top: 0, left: 0, width: "100%", height: 70 }}>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={() => this._startWorkout(today)}
          >
            <View style={styles.startButton}>
              <Text allowFontScaling={false} style={styles.startButtonText}>START TODAY'S WORKOUT</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _nutritionLink = () => {
    this.setState({
      showNutritionPlanModal: true
    })
  }

  renderNutritionPlans() {
    return (
      <View style={[this.elevationShadowStyle(5), styles.footer]}>
        <Text style={styles.footerHeading}>GET ULTIMATE RESULTS!</Text>
        <TouchableOpacity 
          style={{ justifyContent: 'center', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: color.white }}
          onPress={() => {this._nutritionLink()}}
        >
          <Text style={styles.footerSubHeading}>VIEW LSF NUTRITION PLANS</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderSelfcareModal() {
    const { showSelfCareModal, selfCareItem, showCompletionModal } = this.state;

    return (
      <View>
        <SelfCareLog
          visible={showSelfCareModal}
          onClose={this._closeSelfCareModal}
          onLogPressed={this._pushDataUpToState}
          itemData={selfCareItem ? Object.assign(selfCareItem, { isToday: true }) : null}
        />
        <CompletionModal
          start={showCompletionModal}
          title={'Self Care'}
          screenAfterWorkout={'Today'}
          onStackComplete={this._onCompletionFlowEnd}
        />
      </View>
    );
  }

  _pushDataUpToState = (data) => {
    this.setState({ selfLoveData: data, showCompletionModal: true, showSelfCareModal: false })
  }

  _onCompletionFlowEnd = (screenName, props) => {

    const { selfLoveData } = this.state;

    this._saveSelfCareLog(selfLoveData)
    this.setState({ showCompletionModal: false, selfLoveData: null })

    if (screenName) this.props.navigation.navigate(screenName, props);
  }

  _openSelfcareModal = item => this.setState({ showSelfCareModal: true, selfCareItem: item });

  _closeSelfCareModal = () => this.setState({ showSelfCareModal: false });

  _saveSelfCareLog = data => {
    User.saveSelfCareLog(data)
      .catch(err => console.log(err.stack));

    const { selfCareItem } = this.state;

    this.props.screenProps.saveCompletedWorkout(selfCareItem);
  }

  _logWaterBottles = () => {
    const { bottleCount, bottles } = this.state;
    const { saveBottleCount } = this.props.screenProps;

    if (bottles === 0 || bottleCount === 0) {
      alert("Nothing to log")
      return
    }

    saveBottleCount(bottleCount);
    alert('Way to hydrate, babe!');

    // reset bottle count
    this.setState({
      bottles: 0,
      bottleCount: 0
    })

    // reset water height
    { this._waveRect && this._waveRect.setWaterHeight(0) }

  }

  _startWorkout = (workout, screenAfterWorkout) => {

    console.log("_startWorkout");
    console.log(workout)
    console.log(screenAfterWorkout)
    if (workout == undefined || workout == null) {
      return Alert.alert('Trouble Loading Your Workout', 'Please re-load your app.')
    }

    const { primaryType: primaryType, secondaryType: secondaryType } = workout;

    if (primaryType === "Rest") {
      console.log("self love!")
      return this._openSelfcareModal(workout);
    }

    screenAfterWorkout = (screenAfterWorkout != undefined) ? 'ChallengeDashboard' : 'My Week';

    let screen;

    if (isComboDetailWorkout(primaryType, secondaryType)) {
      screen = "ComboDetail";
    } else if (isCircuitOnlyWorkout(primaryType, secondaryType)) {
      screen = "CircuitOnlyDetails";
    } else {
      screen = "CardioDetail";
    }
    console.log('screen:', screen)

    const passedProps = {
      workout: { ...workout, isToday: true },
      navigationFunctions: {
        navigateToMenuTab: this._navigateToMenuTab
      },
      screenAfterWorkout: screenAfterWorkout
    };

    this.props.navigation.navigate(screen, passedProps);
  }

  _navigateToMenuTab = (screenName) => {
    // const screen = this._validateTabName(tabName);
    this.props.navigation.navigate(screenName);
  }

  shadowTop(elevation) {
    return {
      elevation,
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 0.5 * (-elevation) },
      shadowOpacity: 0.3,
      shadowRadius: 0.8 * elevation,
      backgroundColor: 'white'
    }
  }

  elevationShadowStyle(elevation) {
    return {
      marginTop: 20,
      elevation,
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 0.5 * elevation },
      shadowOpacity: 0.3,
      shadowRadius: 0.8 * elevation,
      backgroundColor: 'white'
    }
  }
} // End class

function isCircuitOnlyWorkout(primaryType, secondaryType) {
  return (
    primaryType === "Circuit"
    &&
    secondaryType === "Circuit"
  );
}

function isComboDetailWorkout(primaryType, secondaryType) {
  return (
    primaryType === "Circuit"
    &&
    secondaryType === "MISS Cardio" || secondaryType === "LISS Cardio" || secondaryType === "HIIT Cardio"
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
    marginTop: 0
  },
  descriptions: {
    fontFamily: "SF Pro Text",
    fontSize: 32,
    lineHeight: 32,
    fontWeight: "900",
    fontStyle: "normal",
    letterSpacing: 2,
    textAlign: "center",
    color: '#FFF',
    marginTop: 40,
    marginBottom: 20,
    textShadowColor: color.hotPink,
    textShadowRadius: 1
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
    marginTop: 0
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
    marginTop: 0
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
    marginTop: 10
  },
  pinkQuote: {
    width: 335,
    height: 35,
    backgroundColor: color.navPink,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20
  },
  ssuPinkQuote: {
    width: "100%",
    height: 70,
    backgroundColor: color.navPink,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20
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
    color: color.textColor
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
    color: '#ec568f'
  },
  highLightCard: {
    width: 335,
    height: 116,
    borderRadius: 6,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(207, 207, 207, 0.5)",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowRadius: 12,
    shadowOpacity: 1
  },
  startButton: {
    width: 220,
    height: 36,
    borderWidth: 2,
    borderRadius: 0,
    borderColor: '#f09ab8',
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
    color: '#f09ab8'
  },
  ssuStartButton: {
    width: 190,
    height: 48,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
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
    color: "#ffffff"
  },
  heading: {
    width: "100%",
    alignItems: "center",
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center"
  },
  hydrationHeading: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain'
  },
  highlightHeading: {
    bottom: -10,
    marginTop: 10,
    marginLeft: 40,
    flex: 1,
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-end"
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
      height: 7
    },
    shadowRadius: 16,
    shadowOpacity: 1,
  },
  mask: {
    width: width,
    height: 400,
    backgroundColor: '#f695a8',
    marginTop: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  img: {
    backgroundColor: "transparent",
    width: '100%',
    marginTop: -40,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: color.black,
    marginTop: 20
  },
  btnText: {
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff"
  },
  btn: {
    marginTop: 20,
    marginBottom: 30
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
    width: width * .80,
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
    marginTop: 0
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
    color: '#f09ab8'
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
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: 'green',
    overflow: 'hidden',
    width: 200,
    height: 40,
    margin: 20,
  },
  spotifyLoginButtonText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
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
    color: color.black
  },
  waterContainer: {
    flex: 1,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: "hidden"
  },
  wave: {
    width: 60,
    aspectRatio: 1,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    position: "absolute",
    bottom: 0.5,
    height: "100%",
    borderRadius: 11
  },
  footer: {
    width: "100%",
    backgroundColor: '#ec568f',
    height: 120,
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  footerHeading: {
    fontFamily: "SF Pro Text",
    fontSize: 22,
    letterSpacing: 2,
    fontWeight: "bold",
    fontStyle: "normal",
    textAlign: "center",
    color: color.white,
    height: 34
  },
  footerSubHeading: {
    fontFamily: "SF Pro Text",
    fontSize: 18,
    letterSpacing: 2,
    fontStyle: "normal",
    textAlign: "center",
    color: color.white,
    paddingBottom: 3
  },
  currentChallengeBox: {
    backgroundColor: '#e16d92',
    width: "100%", 
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1
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
    color: 'white'
  },
  joinButtonBox: {
    justifyContent: "center",
    alignItems: "center"
  },
  joinText: {
    top: 1,
    letterSpacing: 3,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 'bold',
    fontStyle: "normal",
    color: 'white',
    padding: 10,
    borderColor: 'white',
    borderWidth: 2
  },
  headerTitle: {
    color: color.hotPink,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold"
  },
  highlightHeaderText: {
    color: '#ec568f',
    fontWeight: 'bold',
    fontSize: 21
  }
}

