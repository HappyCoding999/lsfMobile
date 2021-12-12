import {
  FETCHING_PLAYLIST_DATA_SUCCESS,
  FETCHING_PLAYLIST_DATA_FAILURE,
  FETCHING_PLAYLIST_DATA,
  SET_CURRENT_PLAYLIST,
  SET_CURRENT_PLAYLIST_TRACKS,
  CLEAR_CURRENT_PLAYLIST,
  AUTHORIZE_SPOTIFY,
  AUTHORIZE_SPOTIFY_FAILURE,
  AUTHORIZE_SPOTIFY_SUCCESS,
  SPOTIFY_AUTH_CANCELLED,
  RESET_SPOTIFY_AUTH_FLOW,
  CLEAR_APP_ERRORS
} from "./types";

export default function (spotifyAPI) {

  const fetchPlaylistData = () => (dispatch, getState) => {
    const params = { Authorization: "playlist-read-private", limit: 50 }
    const { fetchingPlaylistData, spotifyAuthorized } = getState().appData;
    dispatch({ type: FETCHING_PLAYLIST_DATA });

    if (spotifyAuthorized && fetchingPlaylistData === false) {
      return spotifyAPI.sendRequest('v1/users/uf0oo5yh4ryv4aquooecznp2c/playlists', 'GET', params, true)
        .then(result => {
          dispatch({ type: FETCHING_PLAYLIST_DATA_SUCCESS, payload: result.items });
        }).catch(err => {
          dispatch({ type: FETCHING_PLAYLIST_DATA_FAILURE, payload: err });
        });
    }
  };

  const setCurrentPlaylist = playlist => dispatch => dispatch({ type: SET_CURRENT_PLAYLIST, payload: playlist });
  const setCurrentPlaylistTracks = tracks => dispatch => dispatch({ type: SET_CURRENT_PLAYLIST_TRACKS, payload: tracks });

  const clearPlaylistData = () => dispatch => dispatch({ type: CLEAR_CURRENT_PLAYLIST });

  const clearAppErrors = () => dispatch => dispatch({ type: CLEAR_APP_ERRORS });

  const authorizeSpotify = () => dispatch => {
    dispatch({ type: AUTHORIZE_SPOTIFY });

    return spotifyAPI.login()
      .then(isAuthorized => {
        if (isAuthorized) {
          dispatch({ type: AUTHORIZE_SPOTIFY_SUCCESS });
        } else {
          dispatch({ type: SPOTIFY_AUTH_CANCELLED});
        }
      })
      .catch(err => {
        let errorMsg = "Unable to connect to Spotify."
        if (err && err.message) {
          errorMsg = err.message;
        }

        dispatch({ type: AUTHORIZE_SPOTIFY_FAILURE, payload: errorMsg })
        return Promise.reject(errorMsg);
      });
  };

  const resetSpotifyAuthFlow = () => dispatch => dispatch({ type: RESET_SPOTIFY_AUTH_FLOW });

  return {
    fetchPlaylistData,
    setCurrentPlaylist,
    setCurrentPlaylistTracks,
    clearPlaylistData,
    clearAppErrors,
    authorizeSpotify,
    resetSpotifyAuthFlow
  };
};