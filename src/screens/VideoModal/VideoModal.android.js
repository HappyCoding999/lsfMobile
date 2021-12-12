import React, { Component } from "react";
import { View, Modal, WebView, Platform, SafeAreaView } from "react-native";
import Video from "react-native-video";
import Orientation from "react-native-orientation-locker";
import VideoPlayer from 'react-native-video-controls';
import { EventRegister } from 'react-native-event-listeners'
import GoogleCast, { CastButton } from 'react-native-google-cast';


export default class extends Component {

  constructor(props) {
    super(props);

    this.state = {
      playing: false,
      orientation: "portrait",
      loading: false,
      videoLoaded: false
    };

    this.rootView = null;
    this.player = null;
    this.time = null;
    this.panResponderYPos = null;
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._getOrientation)
    if(Platform.OS == 'android') {
      GoogleCast.EventEmitter.addListener(GoogleCast.SESSION_STARTED, this.sessionStarted)
    }
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this._getOrientation);
    if(Platform.OS == 'android') {
      GoogleCast.EventEmitter.removeListener(GoogleCast.SESSION_STARTED, this.sessionStarted)
    }
  }

  sessionStarted = () => {
    const { videoUrl, thumbnailUrl, videoName, videoDescription } = this.props
    console.log('video android modal sessionStarted videoUrl', videoUrl, thumbnailUrl, videoName, videoDescription)
    if(!videoUrl) {
      return
    }
    if(this.player) {
      this.player.setState({ paused: true })
    }
    GoogleCast.castMedia({
      mediaUrl: videoUrl,
      imageUrl: thumbnailUrl || 'https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/video%20library%2FgetInspired.jpg?alt=media&token=dbe9609f-49d9-4dd5-ba61-824a971716da',
      title: videoName || 'Love Sweat Fitness',
      subtitle: videoDescription,
      contentType: 'video/m3u', // Optional, default is "video/mp4"
    })
  }

  shouldComponentUpdate(_, nextState) {
    const { playing, orientation, videoLoaded } = this.state;
    const orientationChanged = orientation !== nextState.orientation;
    const playStateChanged = playing !== nextState.playing;
    const videoLoadStateChanged = nextState.videoLoaded !== videoLoaded;

    return playStateChanged || orientationChanged || videoLoadStateChanged;
  }

  render() {
    const { playing } = this.state;
    const { videoUrl, width, height } = this.props;


    if (playing) {
      Orientation.lockToLandscapeLeft();
      return (
        <View
          ref={ref => this.rootView = ref}
          style={{ backgroundColor: "black", width: width, height: height, zIndex: 9 }}
        >
          {this._renderVideo()}
            <View style={{ position: 'absolute', width: 25, right: 0, marginRight: width * .15, top: 20 }}>
              <SafeAreaView>
                <CastButton style={{ width: 25, height: 25, marginTop: height * .015, tintColor: '#FFF' }} />
              </SafeAreaView>
            </View>
        </View>
      );
    }

    Orientation.lockToPortrait();
    return null;
  }

  _getOrientation = orientation => {

    if (orientation === "LANDSCAPE-LEFT") {
      this.setState({
        orientation: "landscape"
      });
    } else {
      this.setState({
        orientation: "portrait"
      });
    }
  }

  _renderVideo() {
    const { orientation, videoLoaded } = this.state;
    const { videoUrl, width, height } = this.props;

    if (!videoUrl || orientation === "portrait") { return null; }
    console.log("videoUrl : ")
    console.log(videoUrl)
    return <VideoPlayer
      source={{ uri: videoUrl , type:"m3u8"}}
      onBack={this._closeVideo}
      onLoadStart={this._playVideo}
      onProgress={this.handleProgress.bind(this)}
      ignoreSilentSwitch="ignore"
      controlTimeout={3000}
      disableVolume={true}
      onShowControls={this.onShowControls}
      onHideControls={this.onHideControls}
      onError={console.log("video error: ", this.videoError)}
      ref={(ref) => { this.player = ref }}
    />;
  }

  _onLoad = () => {
    this.setState({ videoLoaded: true, loading: false });
  }

  _startLoad = () => {
    this.setState({ loading: true })
  }

  _closeVideo = () => {
    const { videoUrl, thumbnailUrl, videoName, videoDescription, duration } = this.props
    EventRegister.emit('videoPlayerClosed', {'videoPlayedDuration':this.time, 'totalVideoDurationInMinute':duration})
    this.setState({
      playing: false
    }, () => this.props.onVideoEnd());
  }

  handleProgress = (progress) => {
    console.log(this.time)
    this.time = Math.floor(progress.currentTime);
  }


  _playVideo = () => {
    const { videoUrl } = this.props
    console.log('_playVideo android')
    if (videoUrl) {
      this.setState({ playing: true });

      GoogleCast.getCastState().then(state => {
        if(state == 'Connected') {
          this.sessionStarted()
        }
      })

      return
    }

    throw new Error("VideoModal needs a valid url.  Receieved: " + videoUrl);
  }
};
