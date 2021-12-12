import React, { Component } from "react";
import {  View, Text, TextInput, Dimensions } from "react-native";
import { color } from "../../../../modules/styles/theme";
import { GradientSlider, CircledWord, LargeButton, Switch } from "../../../../components/common";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const { width } = Dimensions.get("window");


export default class extends Component {
  constructor(props) {
    super(props);

    this.placeHolderText = "Like what weights did you use? How long did it take you? How are you feeling about your fitness journey? Whatever you want to remember babe!";
    this.sliderValues = {
      effort: 0.5,
      felt: 0.5
    };
    this.moods = {};
    this.cares = {};
    this.sore = "heck yes";
    this.notes = "";
    this.slider1Moving = false;
    this.slider2Moving = false;
    this.state = {
      scrollEnabled: true
    };
  }

  shouldComponentUpdate(_, nextState) {
    const { scrollEnabled: prevScrollableState } = this.state;
    const { scrollEnabled: nextScrollableState } = nextState;

    return prevScrollableState !== nextScrollableState;
  }

  render() {
    const { 
      container, 
      rowContainer, 
      header, 
      text, 
      sliderText,
      textBox,
      largeButton
    } = styles;

    const { scrollEnabled } = this.state;

    return (
        <KeyboardAwareScrollView contentContainerStyle={container} scrollEnabled={scrollEnabled}>
          <Text allowFontScaling={false} style={header}>Sweat Log</Text> 

          <Text allowFontScaling={false} style={text}>How hard you worked:</Text>
          <GradientSlider 
            width={327} 
            onMove={this._onSliderChange("effort")}  
            leftIcon="nosweat" 
            rightIcon="sweat" 
            onRelease={this._onSliderRelease("effort")}
          />
          <View style={{...rowContainer, width: 327}}>
            <Text allowFontScaling={false} style={sliderText}>No sweat</Text>
            <Text allowFontScaling={false} style={sliderText}>Killed it!</Text>
          </View>

          <Text allowFontScaling={false} style={text}>How it felt:</Text>
          <GradientSlider 
            width={327} 
            onMove={this._onSliderChange("felt")} 
            leftIcon="sad" 
            rightIcon="happy" 
            onRelease={this._onSliderRelease("felt")}
          />
          <View style={{...rowContainer, width: 327}}>
            <Text allowFontScaling={false} style={sliderText}>Real hard</Text>
            <Text allowFontScaling={false} style={sliderText}>Amazing!</Text>
          </View>

          <Text allowFontScaling={false} style={text}>How's your mood babe?</Text>

          {this._renderMoods()}

          <Text allowFontScaling={false} style={text}>Are you sore?</Text>

          <Switch width={200} leftLabel="HECK YES" rightLabel="NOT YET" onToggle={this._onSwitchToggled}/>

          <Text allowFontScaling={false} style={text}>How are you self caring today?</Text>

          {this._renderSelfCare()}

          <Text allowFontScaling={false} style={text}>Anything else  you want to note about today's sweat sesh?</Text>

          <TextInput style={textBox} multiline={true} placeholder={this.placeHolderText} onChangeText={this._onTextInputChange} />

          <LargeButton containerStyle={largeButton} onPress={this._onLogItPressed}>
            LOG IT
          </LargeButton>
        </KeyboardAwareScrollView>
    );
  }

  _renderMoods() {
    const moodRow = {
      ...styles.rowContainer, 
      justifyContent: "space-evenly",
      marginBottom: 20,
      marginTop: 20,
      width: "90%"
    };

    return (
      <View>
        <View style={moodRow}>
          <CircledWord  word="HAPPY" onCircled={this._onMoodCircled("happy")}/>
          <CircledWord  word="SAD" onCircled={this._onMoodCircled("sad")}/>
        </View>
        <View style={moodRow}>
          <CircledWord  word="EXCITED" onCircled={this._onMoodCircled("excited")}/>
          <CircledWord  word="ANNOYED" onCircled={this._onMoodCircled("annoyed")}/>
        </View>
        <View style={moodRow}>
          <CircledWord  word="TIRED" onCircled={this._onMoodCircled("tired")}/>
          <CircledWord  word="STRESSED" onCircled={this._onMoodCircled("stressed")}/>
        </View>
      </View>
    );
  }

  _renderSelfCare() {
    const careRow = {
      ...styles.rowContainer,
      justifyContent: "space-evenly",
      marginBottom: 20,
      marginTop: 20,
      width: "90%"
    };

    return (
      <View>
        <View style={careRow}>
          <CircledWord word="EXERCISE" onCircled={this._onSelfCareCircled("exercise")}/>
          <CircledWord word="FRIEND TIME" onCircled={this._onSelfCareCircled("friend time")}/>
        </View>
        <View style={careRow}>
          <CircledWord word="TREAT" onCircled={this._onSelfCareCircled("treat")}/>
          <CircledWord word="FACE MASK" onCircled={this._onSelfCareCircled("face mask")}/>
        </View>
        <View style={careRow}>
          <CircledWord word="NEW OUTFIT" onCircled={this._onSelfCareCircled("new outfit")} />
          <CircledWord word="TIME OUTSIDE" onCircled={this._onSelfCareCircled("time outside")} />
        </View>
      </View>
    );
  }

  _onSliderChange = label => val => {
    if (label === "effort") {
      this.slider1Moving = true;
    } else {
      this.slider2Moving = true;
    }

    this.sliderValues[label] = val;

    this.setState({
      scrollEnabled: !this.slider1Moving && !this.slider2Moving
    });
  };

  _onSliderRelease = label => () => {
    if (label === "effort") {
      this.slider1Moving = false;
    } else {
      this.slider2Moving = false;
    }

    this.setState({
      scrollEnabled: !this.slider1Moving && !this.slider2Moving
    });
  }

  _onMoodCircled = mood => () => {
    if (this.moods[mood]) {
      this.moods[mood] = false;
    } else {
      this.moods[mood] = true;
    }
  };

  _onSelfCareCircled = name => () => {
    if (this.cares[name]) {
      this.cares[name] = false;
    } else {
      this.cares[name] = true;
    }
  };

  _onSwitchToggled = label => {
    this.sore = label;
  };

  _onTextInputChange = (val) => {
    this.notes = val;
  };

  _onLogItPressed = () => {
    const { logButtonPressed } = this.props;
    const {
      sliderValues,
      moods,
      cares,
      sore,
      notes
    } = this;

    const mood = Object.keys(moods).reduce((result, mood) => {
      if (moods[mood]) {
        return [...result, mood];
      }
      return result;
    }, []).join(",");

    const selfCare = Object.keys(cares).reduce((result, care) => {
      if (cares[care]) {
        return [...result, care];
      }
      return result;
    }, []).join(",");

    logButtonPressed({
      effort: sliderValues.effort,
      felt: sliderValues.felt,
      mood,
      selfCare,
      sore,
      notes
    });
  }
}

const styles = {
  container: {
    justifyContent: "center",
    backgroundColor: "white",
    marginTop: 30,
    alignItems: "center",
    width: width
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  header: {
    fontFamily: "Northwell",
    fontSize: 72,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.hotPink,
    width: "100%"
  },
  text: {
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: color.black,
    marginTop: 24,
    marginBottom: 15,
    alignSelf: "flex-start",
    marginLeft: 24,
    lineHeight: 22
  },
  sliderText: {
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: color.mediumGrey
  },
  textBox: {
    width: "90%",
    height: 120,
    backgroundColor: 'rgba(222, 222, 232, .27)',
    borderColor: color.darkGrey,
    borderWidth: 1,
    borderRadius: 5,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 44,
    letterSpacing: 0,
    color: color.darkGrey,
    padding: 20,
    paddingTop: 10

  },
  largeButton: {
    marginBottom: 40,
    marginTop: 20
  }
}