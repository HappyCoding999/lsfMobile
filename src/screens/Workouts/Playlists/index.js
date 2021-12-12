import React, { Component } from 'react';
import { connect } from "react-redux";
import { setCurrentPlaylist } from "../../../actions";
import Playlists from "./Playlists";

class PlaylistWrapper extends Component {

  render() {
    const { action, playlistData, spotifyAuthorized } = this.props;
    if (!spotifyAuthorized ) { return null; }

    return <Playlists
      action={action}
      playlistData={playlistData || []}
      onRowPressed={this._setPlaylist}
    />;
  }

  _setPlaylist = async playlist => {
    await this.props.setCurrentPlaylist(playlist);
    this.props.action();
  }
}

const mapStateToProps = ({ appData }) => ({
  playlistData: appData.playlistData,
  spotifyAuthorized: appData.spotifyAuthorized
})

export default connect(mapStateToProps, { 
  setCurrentPlaylist 
})(PlaylistWrapper);