import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import { EventRegister } from "react-native-event-listeners";
import AudioSession, {
  AudioOptions,
  AudioCategories,
} from "react-native-audio-session";
import {
  clearPlaylistData,
  authorizeSpotify,
  fetchPlaylistData,
  resetSpotifyAuthFlow,
} from "../../actions";
import { color } from "../../modules/styles/theme";
import Playlists from "../../screens/Workouts/Playlists";

class MusicButtons extends Component {
  state = {
    showPlaylistModal: false,
    currentPlaylist: null,
  };

  render() {
    const { rowContainer, musicBtn, smallButtonText } = styles;

    return (
      <View style={rowContainer}>
        <TouchableOpacity
          onPress={() =>
            EventRegister.emit("paywallEvent", this._onPlaylistButtonPressed)
          }
        >
          <View style={musicBtn}>
            <Text allowFontScaling={false} style={smallButtonText}>
              LSF PLAYLIST
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._onMusicPressed}>
          <View style={musicBtn}>
            <Text allowFontScaling={false} style={smallButtonText}>
              MY MUSIC
            </Text>
          </View>
        </TouchableOpacity>
        {this._renderPlaylistModal()}
      </View>
    );
  }

  _onPlaylistButtonPressed = async () => {
    const {
      spotifyAuthCancelled,
      spotifyAuthorized,
      authorizeSpotify,
      authorizingSpotify,
      fetchPlaylistData,
      resetSpotifyAuthFlow,
    } = this.props;
    if (spotifyAuthCancelled) {
      return resetSpotifyAuthFlow();
    }
    if (spotifyAuthorized) {
      this.setState({ showPlaylistModal: true });
      fetchPlaylistData();
    } else {
      authorizeSpotify()
        .then(this._onPlaylistButtonPressed)
        .catch((err) => Alert.alert(err));
    }
  };

  _onMusicPressed = () => {
    this.props.clearPlaylistData();

    this._setAudioCategory(() => {
      if (Platform.OS === "ios") {
        Linking.openURL("music://");
      } else {
        Linking.canOpenURL("spotify://").then((supported) => {
          if (supported) {
            Linking.openURL("spotify://");
          } else {
            Linking.openURL("http://play.google.com");
          }
        });
      }
    });
  };

  _setAudioCategory(fn = () => "") {
    if (Platform.OS === "android") {
      return Promise.resolve();
    }

    // return AudioSession.currentOptions().then((options) => {
    return AudioSession.currentCategoryOptions().then((options) => {
      console.log(options);
      if (!options) {
        return AudioSession.setCategory(
          AudioCategories.Ambient,
          AudioOptions.MixWithOthers
        ).then(fn);
      } else {
        fn();
      }
    });
  }

  _renderPlaylistModal() {
    const { showPlaylistModal } = this.state;

    return (
      <View>
        <Modal
          visible={showPlaylistModal}
          animationType="slide"
          transparent={false}
          onRequestClose={() => console.log("on request closed")}
        >
          {/* <Playlists action={this._onPlaylistClosed} onRowPressed={playlist => this._setPlaylist(playlist)} /> */}
          <Playlists action={this._onPlaylistClosed} />
        </Modal>
      </View>
    );
  }

  _onPlaylistClosed = () => this.setState({ showPlaylistModal: false });
}

const mapStateToProps = ({ appData }) => ({
  spotifyAuthorized: appData.spotifyAuthorized,
  spotifyAuthCancelled: appData.spotifyAuthCancelled,
});

const ConnectedMusicButtons = connect(mapStateToProps, {
  clearPlaylistData,
  authorizeSpotify,
  resetSpotifyAuthFlow,
  fetchPlaylistData,
})(MusicButtons);

export { MusicButtons, ConnectedMusicButtons };

const styles = {
  rowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  musicBtn: {
    width: 150,
    height: 48,
    borderColor: color.mediumPink,
    borderWidth: 2,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    margin: 5,
  },
  smallButtonText: {
    width: 105,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink,
  },
};
