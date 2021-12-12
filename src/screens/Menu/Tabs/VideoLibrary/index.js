import React, { Component } from "react";
import {
  InteractionManager,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { color, colorNew } from "../../../../modules/styles/theme";
import firebase from "react-native-firebase";

class VideoLibrary extends Component {
  constructor() {
    super();
    this.state = {
      featured: null,
      categories: null,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      firebase
        .database()
        .ref("youtubeCategories")
        .once("value")
        .then((snapshot) => {
          const fbObject = snapshot.val();
          const newArr = Object.values(fbObject);
          const featured = newArr.filter(
            (obj) => obj.categoryName === "Featured"
          );

          newArr.splice(
            newArr.findIndex((obj) => obj.categoryName === "Featured"),
            1
          );

          this.setState({
            featured: featured,
            categories: newArr,
          });
        })
        .catch((err) => console.log(err.stack));
    });
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: "#fff",
          alignItems: "center",
          height: "100%",
        }}
      >
        <View
          style={{
            backgroundColor: colorNew.bgGrey,
            alignItems: "center",
            height: 300,
            width: "100%",
          }}
        ></View>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <View
            style={{
              flexDirection: "column",
              padding: 11,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("VideoSubCategory", {
                  videoListTitle: "CATEGORIES",
                })
              }
            >
              <Image source={require("./images/thumbnailWorkouts.png")} />
            </TouchableOpacity>
            <Text allowFontScaling={false} style={styles.titleText}>
              WORKOUTS
            </Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              padding: 11,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("VideoLibraryDetail", {
                  videoListTitle: "Education",
                })
              }
            >
              <Image source={require("./images/thumbnailEducation.png")} />
            </TouchableOpacity>
            <Text allowFontScaling={false} style={styles.titleText}>
              EDUCATION
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <View
            style={{
              flexDirection: "column",
              padding: 11,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("YoutubeCategories", {
                  categories: this.state.categories,
                  featured: this.state.featured,
                })
              }
            >
              <Image source={require("./images/thumbnailYoutube.png")} />
            </TouchableOpacity>
            <Text allowFontScaling={false} style={styles.titleText}>
              YOUTUBE
            </Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              padding: 11,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("VideoLibraryDetail", {
                  videoListTitle: "FAVORITES",
                })
              }
            >
              <Image source={require("./images/thumbnailFavorites.png")} />
            </TouchableOpacity>
            <Text allowFontScaling={false} style={styles.titleText}>
              YOUR FAVORITES
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  titleText: {
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
    marginTop: 8,
  },
};

export { VideoLibrary };
