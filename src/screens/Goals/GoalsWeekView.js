import React, { Component } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import { colorNew } from "../../modules/styles/theme";

import { launchImageLibrary } from "react-native-image-picker";
import ImagePicker from "react-native-image-picker";
import firebase from "react-native-firebase";

const levelWeeks = {
  Beginner: 8,
  Intermediate: 24,
  Advanced: 24,
};
export class GoalsWeekView extends Component {
  constructor(props) {
    super(props);

    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);

    var dates = [];
    var completed = props.completed;
    var isSelfCareCompleted = props.isSelfCareCompleted;
    var selfcareWorkout = this.getSelfCareWorkout();

    if (isSelfCareCompleted) {
      var day = new Date(selfcareWorkout.createdAt);
      dates.push(day.getDay());
    }

    if (completed) {
      completed.map((obj) => {
        var day = new Date(obj.createdAt);
        if (day != "Invalid Date") {
          // console.log(obj)
          if (
            this.props.screenProps.currentWeek == obj.week &&
            dates.includes(day.getDay()) == false &&
            this.props.screenProps.level.toLowerCase() ==
              obj.level.toLowerCase() &&
            obj.flag
          ) {
            dates.push(day.getDay());
          }
        }
      });
    }

    this.state = {
      image_uri: "",
      completedDates: dates,
    };
  }

  componentWillReceiveProps(props) {
    var dates = [];
    var completed = props.completed;
    var isSelfCareCompleted = props.isSelfCareCompleted;
    var selfcareWorkout = this.getSelfCareWorkout();

    if (isSelfCareCompleted) {
      var day = new Date(selfcareWorkout.createdAt);
      dates.push(day.getDay());
    }

    if (completed) {
      completed.map((obj) => {
        var day = new Date(obj.createdAt);
        if (day != "Invalid Date") {
          if (
            this.props.screenProps.currentWeek == obj.week &&
            dates.includes(day.getDay()) == false &&
            this.props.screenProps.level.toLowerCase() ==
              obj.level.toLowerCase() &&
            obj.flag
          ) {
            dates.push(day.getDay());
          }
        }
      });
    }

    this.setState({ completedDates: dates });
  }

  getSelfCareWorkout() {
    const { completedWorkouts, weeklyWorkoutSchedule } = this.props.screenProps;
    const { completed } = weeklyWorkoutSchedule;
    var workout = {};

    for (let [tag, item] of Object.entries(completedWorkouts)) {
      var day = new Date(item.createdAt);
      if (
        item.primaryType == "Rest" &&
        item.week == this.props.screenProps.currentWeek &&
        day != "Invalid Date" &&
        item.flag
        // && day.getDay() == item.day
      ) {
        workout = item;
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
        workout = item;
      }
    }
    return workout;
  }

  selectPhotoTapped() {
    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */

    const options = {
      title: "Add photo using below options",
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log("Response = ", response.uri);
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const source = { uri: response.uri };
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.uploadImage(response.uri)
          .then((url) => {
            const currentUser = firebase.auth().currentUser;
            firebase
              .database()
              .ref("users/" + currentUser.uid + "/avatar")
              .set(url)
              .then(() => {
                this.setState({
                  image_uri: url,
                  saveDisabled: false,
                });
              });
          })
          .catch((err) => {
            console.log(err.stack);
          });
      }
    });
  }

  uploadImage = (path, mime = "application/octet-stream") => {
    console.log(path);
    return new Promise((resolve, reject) => {
      const sessionId = new Date().getTime();
      const imageRef = firebase
        .storage()
        .ref("profileimages/")
        .child(sessionId + ".png");
      console.log(imageRef);
      return imageRef
        .put(path, { contentType: mime })
        .then(() => {
          return imageRef.getDownloadURL();
        })
        .then((url) => {
          console.log("uplaoded URL GoalsWeekView");
          console.log(url);
          resolve(url);
        })
        .catch((error) => {
          reject(error);
          console.log("Error uploading image: ", error);
        });
    });
  };

  // getDates = () => {
  //   const { weekData } = this.props;
  //   const dates = [];
  //   if (!weekData) {
  //     return dates;
  //   }

  //   weekData.forEach((obj) => {
  //     if (!obj.isCompleted) {
  //       return;
  //     }
  //     const day = new Date(obj.createdAt);
  //     if (day == "Invalid Date") {
  //       return;
  //     }

  //     // if (day.getDay() >= obj.day && this.props.screenProps.currentWeek == obj.week) {
  //     if (
  //       this.props.screenProps.currentWeek == obj.week &&
  //       dates.includes(day.getDay()) == false &&
  //       this.props.screenProps.level.toLowerCase() == obj.level.toLowerCase()
  //     ) {
  //       dates.push(day.getDay());
  //     }
  //   });

  //   return dates;
  // };

  renderWeekDayCellView = (day, text) => {
    const { weekDayStyle } = styles;

    var isSelected =
      this.state.completedDates.length > 0
        ? this.state.completedDates.includes(day)
        : false;

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
            source={require("./images/day_check_roundec.png")}
            resizeMode="cover"
            style={{ width: 20, height: 20 }}
          />
        ) : (
          <Image
            source={require("./images/day_uncheck_roundec.png")}
            resizeMode="cover"
            style={{ width: 20, height: 20 }}
          />
        )}
        <Text allowFontScaling={false} style={weekDayStyle}>
          {text}
        </Text>
      </View>
    );
  };

  render() {
    const { name, avatar, level } = this.props.screenProps;
    const { image_uri } = this.state;
    let newAvtar = image_uri != "" ? image_uri : avatar ? avatar : undefined;
    console.log("newAvtar in GoalsWeekView");
    console.log(newAvtar);
    const { nameStyle, levelStyle, weekStyle } = styles;
    const fistName = name.split(" ")[0];
    // const dates = this.getDates();

    // alert("weekData: " + JSON.stringify(this.state.completedDates));
    return (
      <View style={{ alignItems: "center", height: 120, width: "100%" }}>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            height: 100,
            width: "90%",
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            style={{ alignItems: "center", marginTop: 0, marginLeft: 0 }}
            onPress={this.selectPhotoTapped.bind(this)}
          >
            {newAvtar ? (
              <Image
                source={{ uri: newAvtar }}
                resizeMode="cover"
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  backgroundColor: "#b2b2b2",
                }}
              />
            ) : (
              <Image
                resizeMode="cover"
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  backgroundColor: "#fff",
                }}
                source={require("./images/avatar1.png")}
              />
            )}
          </TouchableOpacity>
          <View style={{ flex: 1, padding: 10, height: 100 }}>
            <View
              style={{
                width: "100%",
                height: "40%",
                backgroundColor: "#fff",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <View style={{ height: "100%", backgroundColor: "#fff" }}>
                <Text allowFontScaling={false} style={nameStyle}>
                  {fistName}
                </Text>
              </View>
              <View
                style={{
                  width: "45%",
                  height: "100%",
                  backgroundColor: "#fff",
                }}
              >
                <TouchableOpacity
                  onPress={() => this.props.levelButtonPressed()}
                  style={{
                    padding: 5,
                    margin: 5,
                    backgroundColor: colorNew.lightPink,
                    borderRadius: 15,
                    borderColor: colorNew.darkPink,
                    borderWidth: 1,
                    marginTop: -2,
                  }}
                >
                  <Text allowFontScaling={true} style={levelStyle}>
                    {level}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  height: "100%",
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text allowFontScaling={false} style={weekStyle}>
                  WEEK {this.props.screenProps.currentWeek}/{levelWeeks[level]}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: "100%",
                height: "60%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {this.renderWeekDayCellView(1, "M")}
              {this.renderWeekDayCellView(2, "T")}
              {this.renderWeekDayCellView(3, "W")}
              {this.renderWeekDayCellView(4, "T")}
              {this.renderWeekDayCellView(5, "F")}
              {this.renderWeekDayCellView(6, "S")}
              {this.renderWeekDayCellView(0, "S")}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  nameStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 20,
    textAlign: "left",
    fontStyle: "normal",
    color: colorNew.mediumPink,
    marginTop: 0,
  },
  levelStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "600",
    fontSize: 13,
    lineHeight: 15,
    textAlign: "center",
    fontStyle: "normal",
    color: colorNew.darkPink,
    marginTop: 0,
  },
  weekStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "500",
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    fontStyle: "normal",
    color: colorNew.mediumPink,
    marginTop: 0,
  },
});
