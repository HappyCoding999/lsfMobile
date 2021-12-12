import React, { Component } from "react";
import { View, Image, Text, FlatList, TouchableHighlight, Dimensions, TouchableOpacity, Modal } from "react-native";
import { AsyncStorage } from 'react-native';
import { color } from "../../../../modules/styles/theme"
import firebase from "react-native-firebase"
import { EventRegister } from "react-native-event-listeners";

const { width } = Dimensions.get("window");

export default class VideoLibraryDetail extends Component {
  state = {
    videoList: [],
    showVideoModal: false,
    videoUrl: "",
    showFavoriteModal: false,
    showDeleteModal: false
  };

  favoriteArray = [];
  itemRef = [];

  _onCloseButtonPressed = () => {
    this.setState({
      showFavoriteModal: false,
      showDeleteModal: false,
    })
  }

  async removeItem() {
    try {
      await AsyncStorage.removeItem('FAVORITE_VIDEOS');
      return true;
    }
    catch (exception) {
      return false;
    }
  }

  componentDidMount() {
    this._retrieveVideoData();
  }

  _retrieveVideoData = async () => {

    const { videoListTitle,VideoSubCategory } = this.props.navigation.state.params
    console.log("Check 1");
    console.log(videoListTitle);
    console.log(VideoSubCategory);
    let ref = firebase.database().ref("videos");
    let title = '';
    if (VideoSubCategory == undefined) {
        title = videoListTitle 
    }
    else
    {
      title = VideoSubCategory
    }
    console.log("Check 2");
    console.log(title)
    if (title !== "FAVORITES") {

      ref.orderByChild("subcategory").equalTo(title).once('value').then((snapshot) => {

        const fbObject = snapshot.val();
        const newArr = Object.values(fbObject);

        this.setState({
          videoList: newArr.reverse()
        });
      });
    }

    this._retrieveFavorites();
  }

  _retrieveFavorites = async () => {

    const { videoListTitle } = this.props.navigation.state.params

    try {

      let value = await AsyncStorage.getItem('FAVORITE_VIDEOS');

      if (value !== null) {

        this.favoriteArray = JSON.parse(value);

        if (videoListTitle == 'FAVORITES') {
          this.setState({
            videoList: this.favoriteArray.reverse()
          })
        }
      }
    } catch (error) {
      console.log('error getting favorite video data', error)

    }
  }

  _saveToFavorites = async () => {

    this.setState({ showFavoriteModal: false })
    this.favoriteArray.push(this.itemRef)
    this.itemRef = [];

    try {
      await AsyncStorage.setItem('FAVORITE_VIDEOS', JSON.stringify(this.favoriteArray));
    } catch (error) {
      // Error saving data
      console.log(error)
    }
  }

  _deleteFromFavorites = async () => {
    this.setState({ showDeleteModal: false })
    let favCopy = this.favoriteArray;
    this.favoriteArray = favCopy.filter(video => video.videoName !== this.itemRef.videoName)
    this.itemRef = [];

    const { videoListTitle } = this.props.navigation.state.params

    if (videoListTitle === "FAVORITES") {
      this.setState({
        videoList: this.favoriteArray
      })
    }

    try {
      await AsyncStorage.setItem('FAVORITE_VIDEOS', JSON.stringify(this.favoriteArray));
    } catch (error) {
      // Error saving data
      console.log(error)
    }
  }

  _favoriteVideo = (item) => {
    this.itemRef = item;
    this.setState({ showFavoriteModal: true })
  }

  _removeFromFavorites = (item) => {
    this.itemRef = item;
    this.setState({ showDeleteModal: true })
  }

  _renderDeleteModal() {

    const { showDeleteModal } = this.state;

    return (
      <View style={styles.modalContainer}>
        <Modal
          visible={showDeleteModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => { console.log("Dialogue Closed") }}>
          <View style={styles.window}>
            <View style={styles.dialogue}>
              <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: -20, marginEnd: -10 }} onPress={this._onCloseButtonPressed}>
                <Image source={require("./images/iconCircleclose.png")} />
              </TouchableOpacity>
              <Text allowFontScaling={false} style={styles.modalHeaderText}>Remove from your favorites?</Text>
              <Text allowFontScaling={false} style={styles.modalBodyText}>Are you sure you want to remove this video from your favorites?</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
                <TouchableOpacity
                  onPress={this._deleteFromFavorites}>
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


  _renderFavoriteModal() {

    const { showFavoriteModal } = this.state;

    return (
      <View style={styles.modalContainer}>
        <Modal
          visible={showFavoriteModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => { console.log("Dialogue Closed") }}>
          <View style={styles.window}>
            <View style={styles.dialogue}>
              <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: -20, marginEnd: -10 }} onPress={this._onCloseButtonPressed}>
                <Image source={require("./images/iconCircleclose.png")} />
              </TouchableOpacity>
              <Text allowFontScaling={false} style={styles.modalHeaderText}>Add to favorites?</Text>
              <Text allowFontScaling={false} style={styles.modalBodyText}>Are you sure you want to add this video to your favorites?</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
                <TouchableOpacity
                  onPress={this._onCloseButtonPressed}>
                  <View style={styles.button2}>
                    <Text allowFontScaling={false} style={styles.button2Text}>NO, WAIT</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this._saveToFavorites}>
                  <View style={styles.button1}>
                    <Text allowFontScaling={false} style={styles.button1Text}>YES, DO IT</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  _renderItem = ({ item, separators }) => {

    const isFavorite = this.favoriteArray.some(video => video.videoName === item.videoName)

    return (
      <TouchableHighlight
        onPress={() => this._checkVideoPaywall(item)}
        underlayColor={color.lightGrey}>
        <View style={styles.cellContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={{ width: width, height: width }}
              source={{ uri: item.thumbnailUrl }}
              resizeMode="cover" />
            <TouchableOpacity
              underlayColor={"transparent"}
              style={{ position: "absolute", width: 50, height: 50, right: 0, bottom: 0 }}
              onPress={isFavorite ? () => this._removeFromFavorites(item) : () => this._favoriteVideo(item)}>
              <View>
                {isFavorite ?
                  <Image style={{ width: 32, height: 32 }} source={require('./images/iconHeartFilled.png')} resizeMode={"contain"} />
                  :
                  <Image style={{ width: 32, height: 32 }} source={require('./images/iconHeart.png')} resizeMode={"contain"} />
                }
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "column", marginTop: 20, width: width * .90 }}>
            <Text allowFontScaling={false} style={styles.primaryText}>{item.videoName}</Text>
            <Text allowFontScaling={false} style={styles.secondaryText}>{item.videoDescription}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    const { videoUrl, thumbnailUrl, videoName, videoDescription, duration } = this.state;
    const { screenProps } = this.props;
    console.log('render in video library');
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.videoList}
          renderItem={this._renderItem}
          ItemSeparatorComponent={({ highlighted }) => (
            <View style={styles.separator} />
          )}
          keyExtractor={(item, index) => item + index}
        />
        {screenProps.renderVideoModal(videoUrl, thumbnailUrl, videoName, videoDescription, duration)}
        {this._renderFavoriteModal()}
        {this._renderDeleteModal()}
      </View>
    );
  }
  _checkVideoPaywall = (item) => {
    console.log('_checkVideoPaywall video library VideoLibraryDetail');
    console.log(item);
    const { isFree, videoUrl, thumbnailUrl, videoName, videoDescription, duration } = item

    if (isFree) {
      return this._showVideoFullScreen(videoUrl, thumbnailUrl, videoName, videoDescription, duration)();
    } else {
      return EventRegister.emit("paywallEvent", this._showVideoFullScreen(videoUrl, thumbnailUrl, videoName, videoDescription, duration));
    }
  }
 
  _showVideoFullScreen = (videoUrl, thumbnailUrl, videoName, videoDescription, duration) => () => {
    const { screenProps } = this.props;
    this.setState({
      videoUrl, thumbnailUrl, videoName, videoDescription, duration
    }, () => screenProps.openVideoModal(videoUrl, thumbnailUrl, videoName, videoDescription, duration));
  }
}

const styles = {
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  cellContainer: {
    width: width,
    height: width + 100,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  imageContainer: {
    width: "100%",
    height: width,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -24
  },
  primaryText: {
    width: "100%",
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    color: color.black
  },
  secondaryText: {
    width: "90%",
    height: 44,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: color.black
  },
  separator: {
    width: "80%",
    height: 1,
    backgroundColor: "#ddd",
    marginLeft: 24
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
    width: "100%",
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
    width: 200,
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


