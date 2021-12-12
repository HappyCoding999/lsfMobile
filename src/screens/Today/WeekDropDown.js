import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { skipToNextWeek, restartLevel } from "../../actions";
import { colorNew } from "../../modules/styles/theme";

class WeekDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownVisible: false,
      rotateValue: new Animated.Value(1),
    };
  }

  onToggleDropDown = () => {
    const { dropdownVisible: currentDropdownVisible, rotateValue } = this.state;
    const dropdownVisible = !currentDropdownVisible;

    Animated.timing(rotateValue, {
      toValue: dropdownVisible ? 0 : 1,
      duration: 200,
      easing: Easing.linear,
    }).start();

    this.setState({ dropdownVisible });
  };

  onJumpToNextWeek = () => {
    this.onToggleDropDown();
    this.props.skipToNextWeek();
  };

  onRestartLevel = () => {
    this.onToggleDropDown();
    this.props.restartLevel(this.props.completedWorkouts);
  };

  render() {
    const {
      container,
      header,
      weekButton,
      headerText,
      carrotStyle,
      dropdownContainer,
      actionButton,
      actionText,
    } = styles;
    const { currentWeek, level } = this.props;
    const { dropdownVisible } = this.state;

    const rotate = this.state.rotateValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"],
    });

    return (
      <View style={container}>
        <View style={header}>
          <TouchableOpacity style={weekButton} onPress={this.onToggleDropDown}>
            <Text allowFontScaling={false} style={headerText}>
              WEEK {currentWeek}
            </Text>
            <Animated.Image
              style={[carrotStyle, { transform: [{ rotate: rotate }] }]}
              source={require("../../components/common/SpotifyMusicBar/images/arrow-up-tab.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.onLevelSelected}>
            <Text allowFontScaling={false} style={headerText}>
              {level ? level.toUpperCase() : ""}
            </Text>
          </TouchableOpacity>
        </View>
        {dropdownVisible && (
          <View style={dropdownContainer}>
            <TouchableOpacity
              style={actionButton}
              onPress={this.onJumpToNextWeek}
              activeOpacity={0.5}
            >
              <Text allowFontScaling={false} style={actionText}>
                Jump to Next Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={actionButton}
              onPress={this.onRestartLevel}
              activeOpacity={0.5}
            >
              <Text allowFontScaling={false} style={actionText}>
                Restart Level
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    overflow: "visible",
  },
  header: {
    width: "100%",
    height: 35,
    backgroundColor: "#FCF0F2",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  weekButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: "#E37095",
    fontWeight: "500",
    fontSize: 14,
  },
  carrotStyle: {
    marginLeft: 10,
    height: 10,
    width: 10,
    tintColor: "#E37095",
    marginTop: 2,
  },
  dropdownContainer: {
    backgroundColor: "#FCF0F2",
    position: "absolute",
    top: 35,
    left: 0,
    right: 0,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
    height: 40,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E37095",
    margin: 10,
    borderRadius: 100,
  },
  actionText: {
    fontFamily: "SF Pro Text",
    fontSize: 25,
    fontStyle: "normal",
    fontSize: 14,
    width: "100%",
    color: "#E37095",
    textAlign: "center",
  },
});

export default connect(null, { skipToNextWeek, restartLevel })(WeekDropDown);
