import React, { Component } from "react";
import { Dimensions, View, Modal, SafeAreaView, Platform } from "react-native";
import Video from "react-native-video";
import Orientation from "react-native-orientation-locker";
import VideoPlayer from 'react-native-video-controls';
import { EventRegister } from 'react-native-event-listeners'
import GoogleCast, { CastButton } from 'react-native-google-cast';
import { scale } from "react-native-size-matters";

const { width: initialWidth, height: initialHeight } = Dimensions.get("window");

export default class extends Component {

  constructor(props) {
    super(props);

    this.state = {
      width: initialWidth,
      height: initialHeight,
      playing: false,
      showCast: false
    };
    this.rootView = null;
    this.player = null;
    this.time = null;
    this.panResponderYPos = null;
  }

  componentDidMount() {
    Orientation.lockToPortrait();
    Orientation.addOrientationListener(this._getOrientation);
    if(Platform.OS == 'ios') {
      GoogleCast.EventEmitter.addListener(GoogleCast.MEDIA_STATUS_UPDATED, this.mediaStatusUpdated)
    }
  }

  mediaStatusUpdated = () => {

  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this._getOrientation);
    if(Platform.OS == 'ios') {
      GoogleCast.EventEmitter.removeListener(GoogleCast.SESSION_STARTED, this.sessionStarted)
      GoogleCast.EventEmitter.removeListener(GoogleCast.MEDIA_STATUS_UPDATED, this.sessionStarted)
    }
  }

  sessionStarted = () => {
    const { videoUrl, thumbnailUrl, videoName, videoDescription } = this.props
    console.log('video ios modal sessionStarted videoUrl', videoUrl, thumbnailUrl, videoName, videoDescription)
    if(!videoUrl) {
      return
    }
    
    this.player.setState({ paused: true })
    GoogleCast.castMedia({
      mediaUrl: videoUrl,
      imageUrl: thumbnailUrl || 'https://firebasestorage.googleapis.com/v0/b/lsf-development.appspot.com/o/video%20library%2FgetInspired.jpg?alt=media&token=dbe9609f-49d9-4dd5-ba61-824a971716da',
      title: videoName || 'Love Sweat Fitness',
      subtitle: videoDescription,
      contentType: 'video/m3u', // Optional, default is "video/mp4"
    })
  }

  shouldComponentUpdate(_, nextState) {
    const { playing, width, height } = this.state;
    const playStateChanged = playing !== nextState.playing;
    const orientationChanged = width !== nextState.width && height !== nextState.height;

    return playStateChanged || orientationChanged;
  }

  onShowControls = () => {
    console.log('onShowControls')
    this.setState({ showCast: true })
  }

  onHideControls = () => {
    console.log('onHideControls')
    this.setState({ showCast: false })
  }
  
  render() {
    const { playing, height, width, showCast } = this.state;
    console.log('render showCast', `${showCast}`)
    if (playing === true) {
      Orientation.unlockAllOrientations();

      return (
        <Modal onRequestClose={() => ""} visible={playing} animationType="slide" supportedOrientations={["landscape", "portrait"]} >
          <View
            ref={ref => this.rootView = ref}
            style={{ width: width, height: height, backgroundColor: "black", zIndex: 9 }}>
            {this._renderVideo()}
            <View style={{ position: 'absolute', width: 25, right: 0, marginRight: width * .15, top: 20 }}>
              <SafeAreaView>
                <CastButton style={{ width: 25, height: 25, marginTop: height * .015, tintColor: '#FFF' }} />
              </SafeAreaView>
            </View>
          </View>
        </Modal>
      );
    }

    Orientation.lockToPortrait();
    return null;
  }

  _getOrientation = () => {
    const { height, width } = Dimensions.get("window");

    if (this.rootView) {
      if (width > height) {
        this.setState({
          height,
          width
        });
      } else {
        this.setState({
          height,
          width
        });
      }
    }
  };

  _renderVideo() {
    const { height, width } = this.state;
    const { videoUrl } = this.props;
    console.log('_renderVideo 123');
    console.log(this.props);

    if (videoUrl === null) { return null; }

    return <VideoPlayer
      source={{ uri: videoUrl }}
      onBack={this._closeVideo}
      onLoadStart={this._playVideo}
      ignoreSilentSwitch="ignore"
      controlTimeout={3000}
      disableVolume={true}
      onProgress={this.handleProgress.bind(this)}
      onShowControls={this.onShowControls}
      onHideControls={this.onHideControls}
      onError={console.log("video error: ", this.videoError)}
      ref={(ref) => { this.player = ref }}
    />;
  }

   handleProgress = (progress) => {
      console.log(this.time);
      this.time = Math.floor(progress.currentTime)
    }

  _closeVideo = () => {
    const { videoUrl, thumbnailUrl, videoName, videoDescription, duration } = this.props
    EventRegister.emit('videoPlayerClosed', {'videoPlayedDuration':this.time, 'totalVideoDurationInMinute':duration})    
    this.setState({ playing: false })
    GoogleCast.EventEmitter.removeListener(GoogleCast.SESSION_STARTED, this.sessionStarted)
  };

  _playVideo = () => {
    const { videoUrl } = this.props
    console.log('_playVideo ios')
    if (videoUrl) {
      this.setState({ playing: true });

      GoogleCast.getCastState().then(state => {
        if(state == 'Connected') {
          this.sessionStarted()
        } else {
          GoogleCast.EventEmitter.addListener(GoogleCast.SESSION_STARTED, this.sessionStarted)
        }
      })

      return
    } 

    throw new Error("VideoModal needs a valid url.  Receieved: " + videoUrl);
  }
};