import React, { Component } from 'react';
import { InteractionManager, View, Text, Image, ImageBackground, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import { Header } from 'react-native-elements';
import moment from 'moment';
import Video from 'react-native-video';
import { LoadingComponent } from "../../components/common";
import { getDaily10 } from "../../DataStore";
import { isEmpty } from "lodash";

// components
import { color } from "../../modules/styles/theme";
import { endScreens } from './dynamicEndscreens';
import closeButton from './images/iconXPink.png';
import CompletionModal from '../Workouts/CompletionModalStack/Completion';

const { height, width } = Dimensions.get('window');

export default class extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loggedDays: [],
      showChallengeBonusModal: false,
      showCompletionModal: false,
      displayImage: false,
      weekNum: 0,
      totalWeeks: 0
    }

  }

  componentDidMount() {
    let handle = InteractionManager.createInteractionHandle();

    this.loggedDays();
    this._findCurrentWeekOfChallenge();

    InteractionManager.clearInteractionHandle(handle);
  }

  loggedDays() {
    var day;
    var dates = [];

    const { lotsOfLoveChallenges, challengeFlag, springSlimDownChallenges } = this.props.screenProps;

    if (springSlimDownChallenges != null) {

      springSlimDownChallenges.map(obj => {

        day = new Date(obj.createdAt)

        if (moment(day).isSame(new Date(), 'isoWeek')) {
          dates.push(day.getDay())
        }

      });

      this.setState({
        loggedDays: [...this.state.loggedDays, ...dates]
      });
    }
  }

  render() {

    const { weeklyWorkoutSchedule } = this.props.screenProps;

    if (weeklyWorkoutSchedule && weeklyWorkoutSchedule.today) {
      const { today } = weeklyWorkoutSchedule;

      return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <ScrollView>
            {this.renderBanner()}
            {this.renderWeeklyChallengeCount()}
            {this.renderCalendarWeek()}
            {this.renderSweatSesh(today)}
            {this.renderChallengeDaily10()}
            {this.renderBonus()}
            {this.renderLogMyWorkoutButton()}
          </ScrollView>
          {this._renderChallengeBonusModal()}
          {this._renderCompletionModal()}
        </View>
      );
    }

    return (
      <View style={{ width, flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LoadingComponent />
      </View>
    );
  }

  renderBanner() {

    const { challengeBanner } = this.props.screenProps.latestChallenge;

    return (
      <View style={styles.bannerContainer}>
        <Image style={styles.banner} source={{ uri: challengeBanner }} />
      </View>
    )
  }

  renderWeeklyChallengeCount() {

    const { weekNum, totalWeeks } = this.state;

    return (
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.weekText}>WEEK </Text>
          <Text style={{ fontFamily: "SF Pro Text", fontSize: 28, fontStyle: "normal", textAlign: "center", color: '#ec568f'}}>{weekNum}</Text>
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
    let start = moment(challengeStartDate).startOf('isoWeek').valueOf();
    let end = moment(challengeEndDate).endOf('isoWeek').valueOf();

    // starting with the beginning of the challenge week, loop by adding a full week of miliseconds 
    // and check to see if the current week time is still greater than or equal to the week iteration
    // this will tally the weeks you're on.
    for (let weekIteration = start; weekIteration <= end; weekIteration += weekInMiliseconds) {

      totalWeeks++;

      if (weekIteration <=  currentWeek) {
        weekNum++;
      }
    }

    this.setState({
      weekNum: weekNum,
      totalWeeks: totalWeeks
    });
  }

  renderCalendarWeek() {

    let d = new Date();
    let today = d.getDay();

    return (
      <View style={{ flex: 1, width: "100%", height: 90, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}>
        <View style={{ flexDirection: "row", width: "90%", justifyContent: "space-evenly" }}>

          <TouchableOpacity activeOpacity={.6} onPress={this.props.onDayPressed}>
            <View style={{ flexDirection: "column" }}>
              <View style={styles.calendar}>
                {this.state.loggedDays.includes(1) ?
                <Image style={{position: "absolute", top: 5, left: 6}} source={require('./images/star.png')}/> : <View></View>}
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text allowFontScaling={false} style={styles.weekDay(today, 1)}>
                  MON
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={.6} onPress={this.props.onDayPressed}>
            <View style={{ flexDirection: "column" }}>
              <View style={styles.calendar}>
                {this.state.loggedDays.includes(2) ?
                <Image style={{position: "absolute", top: 5, left: 6}} source={require('./images/star.png')}/> : <View></View>}
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text allowFontScaling={false} style={styles.weekDay(today, 2)}>
                  TUE
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={.6} onPress={this.props.onDayPressed}>
            <View style={{ flexDirection: "column" }}>
              <View style={styles.calendar}>
                {this.state.loggedDays.includes(3) ?
                <Image style={{position: "absolute", top: 5, left: 6}} source={require('./images/star.png')}/> : <View></View>}
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text allowFontScaling={false} style={styles.weekDay(today, 3)}>
                  WED
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={.6} onPress={this.props.onDayPressed}>
            <View style={{ flexDirection: "column" }}>
              <View style={styles.calendar}>
                {this.state.loggedDays.includes(4) ?
                <Image style={{position: "absolute", top: 5, left: 6}} source={require('./images/star.png')}/> : <View></View>}
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text allowFontScaling={false} style={styles.weekDay(today, 4)}>
                  THU
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={.6} onPress={this.props.onDayPressed}>
            <View style={{ flexDirection: "column" }}>
              <View style={styles.calendar}>
                {this.state.loggedDays.includes(5) ?
                <Image style={{position: "absolute", top: 5, left: 6}} source={require('./images/star.png')}/> : <View></View>}
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text allowFontScaling={false} style={styles.weekDay(today, 5)}>
                  FRI
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={.6} onPress={this.props.onDayPressed}>
            <View style={{ flexDirection: "column" }}>
              <View style={styles.calendar}>
                {this.state.loggedDays.includes(6) ?
                <Image style={{position: "absolute", top: 5, left: 6}} source={require('./images/star.png')}/> : <View></View>}
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text allowFontScaling={false} style={styles.weekDay(today, 6)}>
                  SAT
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={.6} onPress={this.props.onDayPressed}>
            <View style={{ flexDirection: "column" }}>
              <View style={styles.calendar}>
                {this.state.loggedDays.includes(0) ?
                <Image style={{position: "absolute", top: 5, left: 6}} source={require('./images/star.png')}/> : <View></View>}
              </View>
              <View style={{ alignItems: 'center' }}>
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
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 0.5 * (-elevation) },
      shadowOpacity: 0.3,
      shadowRadius: 0.8 * elevation,
      backgroundColor: 'white'
    }
  }

  renderSweatSesh(today) {

    const nowUTC = moment.utc();

    let uri;

    if (today && today.imageUrl != undefined) {
      uri = { uri: today.imageUrl }
    } else {
      uri = { uri: null }
    }

    return (
      <View style={[this.elevationShadowStyle(5), { marginTop: 20, flex: 1, flexDirection: 'column' }]}>
        <View style={{ flex: 1, backgroundColor: '#fae8ee', width: '100%', height: 60 }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image style={{ width: 180, resizeMode: 'contain' }} source={require('./images/sweatSesh.png')} />
          </View>
        </View>
        <ImageBackground style={{ flex: 1, width: "100%", height: 247.7 }} source={uri}>
          <View style={{ position: "absolute", backgroundColor: "rgba(147, 122, 132, 0.20)", top: 0, left: 0, width: "100%", height: "100%" }}></View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={styles.descriptions}>
              { (today && today.description != undefined) ? today.description.toUpperCase() : 'Today\'s Workout'}
            </Text>
          </View>
        </ImageBackground>
        <View style={{ flex: 1, backgroundColor: '#fae8ee', width: '100%', height: 70 }}>
          <TouchableOpacity
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={() => this.props.screenProps.startWorkout(today, 'ChallengeDashboard')}
          >
            <View style={styles.startButton}>
              <Text allowFontScaling={false} style={styles.startButtonText}>START TODAY'S WORKOUT</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderChallengeDaily10() {

    let { daily10 } = this.props.screenProps;

    // start/end of week millisecond timestamp
    const dayOfTheWeek = moment().format('dddd');

    return (
      <View style={this.elevationShadowStyle(5)}>
        <View style={this.shadowTop(5)}>
          <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: 60, backgroundColor: '#f09ab8' }}>
            <Image style={{ width: '80%', resizeMode: 'contain' }} source={require('./images/challengeDaily10.png')} />
          </View>
          <ImageBackground style={{ width: "100%", height: 255 }} source={{ uri: ( daily10.ssuPhoto != undefined ? daily10.ssuPhoto : null ) }}>

            <View style={{ position: "absolute", backgroundColor: "rgba(147, 122, 132, 0.20)", top: 0, left: 0, width: "100%", height: "100%" }}></View>

            {
              !isEmpty(daily10) ?
                <View style={{ flex: 1, justifyContent: 'center', top: 30 }}>
                  <Text allowFontScaling={false} style={styles.DOWHeaderText}>{dayOfTheWeek.toUpperCase()}</Text>
                </View>
              :
                <View style={{ flex: 1, justifyContent: 'center', top: 20 }}>
                  <TouchableOpacity onPress={this.reloadDaily10}>
                    <Text allowFontScaling={false} style={[{...styles.ssuDOWHeaderText}, { fontSize: 22, color: 'white' }]}>Press to reload</Text>
                  </TouchableOpacity>
                </View>
            }

          </ImageBackground>
          <View style={{ flex: 1, width: '100%', height: 70, backgroundColor: '#f09ab8' }}>
            <TouchableOpacity
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              activeOpacity={0.5}
              onPress={this.props.screenProps.openDailySweatModal}
              disabled={!isEmpty(daily10) ? false : true}
            >
              <View style={styles.daily10Button}>
                <Text allowFontScaling={false} style={styles.daily10ButtonText}>GET TODAY'S MOVES</Text>
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
      console.log('error reloading daily 10 data');
    }
  }

  renderBonus() {

    const { 
      challengeBonusText,
      challengeBonusButtonText,
      challengeBonusPicture,
      challengeBonusSectionData
    } = this.props.screenProps;

    const { reps, exerciseVideo, exercise, description, type } = challengeBonusSectionData;

    const exerciseVideoUri = exerciseVideo != undefined ? exerciseVideo : 'https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/Challenge%20Bonus%20Section%20Videos%2FBooty%20Challenge%202019%2F1-SingleLegSquat_Booty19.mp4?alt=media&token=8397e714-64c4-4556-9274-9cbd79b550dd' ;

    return (
      <View style={[this.elevationShadowStyle(5), { flex: 1, alignItems: 'center', backgroundColor: '#fae8ee', width: '100%' }]}>
        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 10 }}>
          <Image style={{  width: 110, resizeMode: 'contain' }} source={require('./images/bonus.png')} />
          <Text style={styles.bonusMessage}>{challengeBonusText.toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: 260 }}>
          {
            type != 'picture' ?
            <Video
              source={{ uri: exerciseVideoUri }}
              style={{ width: '120%', height: '100%'}}
              repeat={true}
              resizeMode={'contain'}
            /> 
            :
            <Image style={{ width: '100%', height: '100%', resizeMode: 'stretch' }} source={{ uri: exerciseVideoUri }} />
          }
        </View>
        {
          exercise ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fae8ee', width: '100%', height: 40 }}>
              <Text style={styles.bonusText}>{exercise}</Text>
              <Text style={styles.bonusText}>{reps}</Text>
            </View>
          :
          null
        }
      </View>
    )
  }

  _renderChallengeBonusModal = () => {

    const { challengeBonusButtonLink } = this.props.screenProps;
    const { showChallengeBonusModal } = this.state;

    return (
      <Modal animationType='slide' visible={showChallengeBonusModal} onRequestClose={() => {}}>
        <View style={{ flex: 1 }}>
          <Header 
            leftComponent={
              <TouchableOpacity onPress={() => {
                this.setState({ showChallengeBonusModal: false })
              }}>
                <Image source={require("./images/iconXPink.png")} />
              </TouchableOpacity>
            }
            centerComponent={{ text: 'BONUS', style: styles.headerTitle }} 
            backgroundColor={"#ffffff"}
            outerContainerStyles={{ borderBottomWidth: 0 }}
          />
          <WebView 
            source={{ uri: challengeBonusButtonLink }} 
          />
        </View>
      </Modal>
    );
  }

  renderLogMyWorkoutButton() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 20, width: '100%', height: 160, backgroundColor: 'white' }}>
        <View style={{ height: 60 }}>
          <TouchableOpacity
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: 240 }}
            activeOpacity={0.5}
            onPress={() => this._logWorkout()}
          >
            <Image style={{ height: 120, width: 280, resizeMode: 'contain' }} source={require('./images/logMyWorkout.png')} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _logWorkout = () => {
    const createdAt = Date.now();
    const today = new Date(createdAt);
    const { validPurchase } = this.props.screenProps;

    this.setState({ 
      showCompletionModal: true
    })

    if (this.state.loggedDays.includes(today.getDay())) {

      console.log('This day\'s workout as already been logged.');

    } else {

      this.props.screenProps.saveChallengeWorkout({createdAt, validPurchase})
      .then(() => {
        // set state for star to show up
        this.loggedDays();
      });
    }
  }

  _renderCompletionModal = () => {

    const { showCompletionModal } = this.state;
    const { endScreens } = this.props.screenProps.latestChallenge;
    const esIndex = this.state.weekNum;

    let endScreen = (endScreens[esIndex] != undefined) ? 
      { uri: endScreens[esIndex] } :
      require('./images/lol_end_screens-01.jpg');

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
  }

  _closeCompletionModal = () => {
    this.setState({
      showCompletionModal: false
    })
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
}

const styles = {
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 0,
    height: 0.8 * height,
    width: 0.9 * width
  },
  bannerContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  banner: {
    resizeMode: 'contain',
    width: '90%',
    height: 200
  },
  weekText: {
    fontFamily: "SF Pro Text",
    fontSize: 28,
    fontStyle: "normal",
    textAlign: "center",
    color: color.mediumGrey
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
      color: '#f09ab8'
    }

    if (today == dayNumber) {
      style.textDecorationLine = 'underline';
    }

    return style;
  },
  calendar: {
    width: 40,
    height: 40,
    backgroundColor: '#fae8ee',
    borderRadius: 20,
    marginTop: 7,
    borderWidth: 1,
    borderColor: '#f09ab8'
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
    textShadowOffset:{width: 2, height: 2},
    textShadowRadius: 10,
  },
  startButton: {
    width: 220,
    height: 36,
    borderWidth: 1.8,
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
  lsfDailyHeader: {
    color: '#fff',
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
    flexWrap: 'wrap',
    flexShrink: 1
  },
  daily10Button: {
    width: 220,
    height: 36,
    borderWidth: 2,
    borderRadius: 0,
    borderColor: '#fff',
    backgroundColor: '#f09ab8',
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
    color: '#fff'
  },
  bonusMessage: {
    fontFamily: 'Sofia Pro',
    fontSize: 20,
    color: '#ec568f',
    fontWeight: '900'
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
    color: '#f09ab8'
  },
  logWorkoutButton: {
    width: 220,
    height: 52,
    borderColor: '#fff',
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
    color: '#fff'
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
    textShadowRadius: 2
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
  closeImgContainerStyle: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    top: 10,
    left: 10
  },
  headerTitle: {
    color: color.hotPink,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold"
  }
};