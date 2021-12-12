import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, SectionList, Dimensions, ImageBackground, FlatList, Linking } from "react-native";
import { color } from '../../../../modules/styles/theme'

const { width } = Dimensions.get("window");

export default class YoutubeCategories extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showWorkoutInProgressModal: false,
      showCompletionModal: false,
      bonusOverviewData: {
        title: null,
        exercisename: null,
        description: null,
        imageUrl: null
      },
      exercises: null
    }
  }

  _navigateToYoutube = (item) => {

    var safari = item.videoUrl;
    var youtubeApp = item.videoUrl.replace("https://youtu.be/", "youtube://")

    Linking.canOpenURL(youtubeApp).then(supported => {
      if (supported){
        Linking.openURL(youtubeApp)
      }else {
        Linking.openURL(safari)
      }
    }).catch(err => console.log(err))
  }

  onButtonPressed = category => {

    this.props.navigation.navigate("YoutubeList", {videoListTitle: category.categoryName, categoryId: category.categoryId });
  }

  renderGridItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ justifyContent: "space-around", padding: 10 }}
        activeOpacity={.9}
        onPress={() => this.onButtonPressed(item)}>
        <View style={{ width: 152, backgroundColor: "#ddd", height: 100, overflow: "hidden" }}>
          <ImageBackground style={{ width: "100%", height: 100 }} source={{ uri: item.thumbnailImageUrl }} />
        </View>
        <Text allowFontScaling={true} adjustsFontSizeToFit={true} minimumFontScale={.80} numberOfLines={1} ellipsizeMode={"tail"} style={styles.gridText}>{item.categoryName.toUpperCase()}</Text>
      </TouchableOpacity>
    );
  }

  render() {

    const {categories, featured} = this.props.navigation.state.params;

    if (categories) {
      return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>

          <SectionList
            contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}
            sections={[
              { title: "FEATURED VIDEO", data: featured },
              { title: "CATEGORIES", data: [categories] }
            ]}
            keyExtractor={(item, idx) => item + idx}
            renderSectionHeader={({ section }) => {

              if (section.title === "FEATURED VIDEO") {
                return (
                  <View style={styles.sectionHeader}>
                    {/* <Image source={require("./images/timeTitleCopy.png")} /> */}
                    <Text style={styles.headerText}>FEATURED VIDEO</Text>
                  </View>
                );
              } else if (section.title === "CATEGORIES") {
                return (
                  <View style={styles.sectionHeader}>
                    {/* <Image source={require("./images/timeTitleCopy2.png")} /> */}
                    <Text style={styles.headerText}>CATEGORIES</Text>
                  </View>
                );
              }
            }}

            renderItem={({ item, section }) => {

              if (section.title === "FEATURED VIDEO") {

                return (
                  <TouchableOpacity
                    activeOpacity={.9}
                    onPress={() => this._navigateToYoutube(item)}>
                    <View style={{ width: width * .90, height: 250, backgroundColor: color.lightPink }}>
                      <ImageBackground style={{ width: "100%", height: "100%" }} resizeMode="cover" source={{ uri: item.thumbnailImageUrl }} />
                    </View>
                  </TouchableOpacity>
                )
              } else

                return (

                  <FlatList
                    data={categories}
                    numColumns={2}
                    contentContainerStyle={styles.gridcontainer}
                    renderItem={this.renderGridItem}
                    keyExtractor={(item, idx) => item + idx}
                  />
                );
            }}
          />
        </View>
      );
    }

    return null;

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
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0,
    textAlign: "center",
    color: color.darkGrey,
    marginTop: 8
  },
  headerText: {
    width: "100%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: "center",
    color: color.hotPink,
    marginTop: 8
  }
}
