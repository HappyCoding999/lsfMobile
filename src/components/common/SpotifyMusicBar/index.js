import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Image, Text, Dimensions, ImageBackground, TouchableOpacity, Animated, Easing, 
  ScrollView, FlatList, Platform } from "react-native";
import { AsyncStorage } from 'react-native';
import Spotify from "rn-spotify-sdk"
import { setCurrentPlaylistTracks } from "../../../actions";
import { color,colorNew } from "../../../modules/styles/theme"

const { height, width } = Dimensions.get('window');

const IPHONE12_H = 844;
const IPHONE12_Max = 926;
const IPHONE12_Mini = 780;

class SpotifyMusicBar extends Component {
  constructor(props) {
    super(props);

    this._toggle = this._toggle.bind(this)

    this.state = {
      animatedY: new Animated.Value(240 - (240 * .3)),
      rotateValue: new Animated.Value(0),
      expanded: false,
      isPlaying: false,
      isFirstPlay: true,
      showControls: false,
      tracks: [],
      currentTrack: null,
    };
  }

  componentDidMount() {
    this._retrievePlaylistData()
  }

  componentWillUnmount() {
    Spotify.setPlaying(false).catch(err => console.log(err.stack));
  }

  _retrievePlaylistData = async () => {
    const { currentPlaylist } = this.props;
    if (currentPlaylist !== null) {
      this.setTrackList(currentPlaylist);
    }

    if (currentPlaylist && currentPlaylist.uri) {
      Spotify.playURI(currentPlaylist.uri, 0, 0)
        .then(() => {
          this.setState({
            isFirstPlay: false,
            isPlaying: true,
          })
          Spotify.addListener('trackChange', (message) => {
            if (!message.error) {
              console.log(message)
              this.setState({
                currentTrack: message.metadata.currentTrack
              })
            }
          })
        })
        .catch(err => console.log(err.stack));
    }
  }

  setTrackList = playlist => {
    const params = { Authorization: "playlist-read-private", limit: 50 }
    const basePrefix = "https://api.spotify.com/"
    const getTracks = playlist.tracks.href.replace(basePrefix, "")

    Spotify.sendRequest(getTracks, 'GET', params, true).then(result => {
      this.props.setCurrentPlaylistTracks(result.items);
      this.setState({
        tracks: result.items
      })
    }).catch(err => {
      console.log(err)
    });
  }

  _renderMusicInfo() {
    if (this.props.currentPlaylist && this.state.currentTrack) {

      imageurl = this.state.currentTrack.albumCoverArtURL

      return (
        <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: "center", width: width * .88, height: 100, top: -35 }}>
          {this.state.isPlaying ?
            <TouchableOpacity
              onPress={() => this.musicButtonPressed(false)}>
              <Image source={require("./images/musicButtonPause.png")} resizeMode={"contain"} style={{width:30,height:30,tintColor:'#fff'}} />
            </TouchableOpacity>
            :
            <TouchableOpacity
              onPress={() => this.musicButtonPressed(true)}>
              <Image source={require("./images/musicButtonPlay.png")} resizeMode={"contain"} style={{width:30,height:30,tintColor:'#fff'}} />
            </TouchableOpacity>
          }
          {/*<Image style={styles.playlistBox} resizeMode={"cover"} source={{ uri: imageurl }} />*/}
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.playlistNameText} numberOfLines={1} ellipsizeMode="tail">{this.state.currentTrack.name}</Text>
            <Text style={styles.playlistNameText1} numberOfLines={1} ellipsizeMode="tail">{this.state.currentTrack.artistName} songs</Text>
          </View>
          <View style={{width:"18%",height:40,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
          <TouchableOpacity
            onPress={() => Spotify.skipToPrevious().catch(err => console.log(err.stack))}>
            <Image style={{tintColor:"#fff"}} source={require("./images/musicButtonPreviousSmall.png")} resizeMode={"contain"} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Spotify.skipToNext().catch(err => console.log(err.stack))}>
            <Image style={{tintColor:"#fff"}}  source={require("./images/musicButtonNextSmall.png")} resizeMode={"contain"} />
          </TouchableOpacity>
          </View>  
        </View>
      );
    }
  }

  _renderMusicControls() {
    return (
      <View style={{ width: width, justifyContent: 'center', alignItems: 'center', top: -20 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: width * .40 }}>
          <TouchableOpacity
            onPress={() => Spotify.skipToPrevious().catch(err => console.log(err.stack))}>
            <Image source={require("./images/musicButtonPrevious.png")} resizeMode={"contain"} />
          </TouchableOpacity>
          {this.state.isPlaying ?
            <TouchableOpacity
              onPress={() => this.musicButtonPressed(false)}>
              <Image source={require("./images/musicButtonPause.png")} resizeMode={"contain"} />
            </TouchableOpacity>
            :
            <TouchableOpacity
              onPress={() => this.musicButtonPressed(true)}>
              <Image source={require("./images/musicButtonPlay.png")} resizeMode={"contain"} />
            </TouchableOpacity>
          }
          <TouchableOpacity
            onPress={() => Spotify.skipToNext().catch(err => console.log(err.stack))}>
            <Image source={require("./images/musicButtonNext.png")} resizeMode={"contain"} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    var bottomMargin = 0
    if (Platform.OS === 'ios' && (height === IPHONE12_H) || (height === IPHONE12_Max) || (height === IPHONE12_Mini)) {
      bottomMargin = 25
    }
    if (this.props.currentPlaylist) {
      const { showControls } = this.state;
      const rotate = this.state.rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
      });
      console.log("width")
      console.log(width)
      
      return (
        <View style={{...styles.container, height:this.state.expanded ? 300 : 130,bottom : bottomMargin}}>
          <Animated.View style={{ backgroundColor: "transparent", width: width, transform: [{ translateY: this.state.expanded ? this.state.animatedY : 0 }] }}>
            <ImageBackground style={styles.ImageBackgroundContainer}
              source={require("./images/musicBar.png")}>
              <View style={{ width: "100%", flexDirection: 'row', justifyContent: 'flex-end'}}>
                <TouchableOpacity
                  onPress={this._toggle}
                  style={{ width: 65, height: 50, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', zIndex: 10,marginRight: Platform.OS === "ios" ? width <= 375 ? 3 : "4%" : "3%"}}>
                  <Animated.Image style={{ alignSelf: 'center',tintColor:"white", transform: [{ rotate: rotate }] }} source={require('./images/arrow-up-tab.png')} />
                </TouchableOpacity>
              </View>
              <View style={{ width: width, height: 400,backgroundColor:colorNew.darkPink, justifyContent: "flex-start", alignItems: "center" }}>
                {
                  showControls ? this._renderMusicControls() : this._renderMusicInfo()
                }
                <View style={{ flex: 1 }}>
                  <FlatList
                    style={{ flex: 1, marginBottom: 200 }}
                    data={this.state.tracks}
                    keyExtractor={(item, index) => item + index}
                    ItemSeparatorComponent={() => <View style={{ width: "90%", height: 1, backgroundColor: '#ddd' }} />}
                    renderItem={({ item, index }) =>
                      <TouchableOpacity
                        style={{ width: width * .90 }}
                        onPress={() => console.log(item)}>
                        <View style={styles.rowContainer}>
                          <Text style={styles.playlistNameText} allowFontScaling={false} numberOfLines={1} ellipsizeMode={"tail"}>{index + 1}. {item.track.name}</Text>
                        </View>
                      </TouchableOpacity>
                    }
                  />
                </View>
              </View>
            </ImageBackground>

          </Animated.View>
        </View>
      );
    }
    return null;
  }

  // _playTrackRow = (item) => {
  //   Spotify.playURI(item.track.uri, 0, 0)
  //   .catch(error => console.log(error.stack))
  // }

  musicButtonPressed = isPlaying => {
    if (this.state.isFirstPlay) {
      this.setState({
        isFirstPlay: false,
        isPlaying: isPlaying
      })
      if (this.playlistData.uri) {
        Spotify.playURI(this.playlistData.uri, 0, 0)
          .catch(err => console.log(err.stack));
      }
    } else {
      Spotify.setPlaying(isPlaying).catch(err => console.log(err.stack));
      this.setState({
        isPlaying: isPlaying
      })

    }
  }

  _toggle() {

    this.state.rotateValue.setValue(this.state.expanded ? 1 : 0);

    Animated.timing(
      this.state.rotateValue,
      {
        toValue: this.state.expanded ? 0 : 1,
        duration: 200,
        easing: Easing.linear
      }
    ).start();

    Animated.spring(
      this.state.animatedY,
      {
        toValue: this.state.expanded ? (240 - (240 * .3)) : 0,
        friction: 6
      }
    ).start();

    this.setState({
      expanded: !this.state.expanded
    });

  }
}

const styles = {
  container: {
    height: 300,
    width: "100%",
    backgroundColor: "transparent",
  },
  ImageBackgroundContainer: {
    width: width,
    height: 120,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  playlistBox: {
    width: 60,
    height: 60,
    borderRadius: 1.8,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(207, 207, 207, 0.5)",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowRadius: 12,
    shadowOpacity: 1,
    backgroundColor: "orange"
  },
  playlistNameText: {
    width: 180,
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: 22,
    textAlign:"center",
    letterSpacing: 0,
    color: "#fff"
  },
  playlistNameText1: {
    width: 180,
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 22,
    textAlign:"center",
    letterSpacing: 0,
    color: "#fff"
  },
  rowContainer: {
    flex: 1,
    width: "90%",
    height: 50,
    justifyContent: "center",
    alignItems: "flex-start"
  }

}

const mapStateToProps = ({ appData }) => ({
  currentPlaylist: appData.currentPlaylist
});

const ConnectedSpotifyMusicBar = connect(mapStateToProps, { setCurrentPlaylistTracks })(SpotifyMusicBar);

export { SpotifyMusicBar, ConnectedSpotifyMusicBar };