import {
  FETCHING_PLAYLIST_DATA,
  FETCHING_PLAYLIST_DATA_SUCCESS,
  FETCHING_PLAYLIST_DATA_FAILURE,
  CLEAR_CURRENT_PLAYLIST,
  SET_CURRENT_PLAYLIST,
  SET_CURRENT_PLAYLIST_TRACKS,
  AUTHORIZE_SPOTIFY,
  AUTHORIZE_SPOTIFY_FAILURE,
  AUTHORIZE_SPOTIFY_SUCCESS,
  SPOTIFY_AUTH_CANCELLED,
  RESET_SPOTIFY_AUTH_FLOW,
  CLEAR_APP_ERRORS,
  SKIP_PAYWALL,
  VIDEO_HEADER_HEIGHT,
} from "../actions/types";

const initialState = {
  fetchingPlaylistData: false,
  playlistData: null,
  currentPlaylist: null,
  trackList: null,
  authorizingSpotify: false,
  spotifyAuthorized: false,
  spotifyAuthCancelled: false,
  skipPaywall: false,
  errors: [],
};

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case SKIP_PAYWALL:
      return { ...state, skipPaywall: action.payload };
    case FETCHING_PLAYLIST_DATA:
      return {
        ...state,
        fetchingPlaylistData: true,
      };

    case FETCHING_PLAYLIST_DATA_SUCCESS:
      const playlists = action.payload;

      return {
        ...state,
        fetchingPlaylistData: false,
        playlistData: playlists,
      };

    case FETCHING_PLAYLIST_DATA_FAILURE: {
      const { errors } = state;
      const error = action.payload;

      return {
        ...state,
        errors: errors.concat(error),
        fetchingPlaylistData: false,
      };
    }

    case CLEAR_CURRENT_PLAYLIST:
      return {
        ...state,
        currentPlaylist: null,
      };

    case SET_CURRENT_PLAYLIST:
      const currentPlaylist = action.payload;

      return {
        ...state,
        currentPlaylist,
      };

    case SET_CURRENT_PLAYLIST_TRACKS:
      const currentPlaylistTracks = action.payload;

      return {
        ...state,
        trackList: currentPlaylistTracks,
      };

    case AUTHORIZE_SPOTIFY:
      return {
        ...state,
        authorizingSpotify: true,
        spotifyAuthCancelled: false,
        spotifyAuthorized: false,
      };

    case AUTHORIZE_SPOTIFY_FAILURE: {
      const { errors } = state;
      const error = action.payload;

      return {
        ...state,
        authorizingSpotify: false,
        errors: errors.concat(error),
        spotifyAuthCancelled: false,
      };
    }

    case AUTHORIZE_SPOTIFY_SUCCESS:
      return {
        ...state,
        spotifyAuthorized: true,
        spotifyAuthCancelled: false,
      };

    case SPOTIFY_AUTH_CANCELLED:
      return {
        ...state,
        spotifyAuthCancelled: true,
      };

    case RESET_SPOTIFY_AUTH_FLOW:
      return {
        ...state,
        fetchingPlaylistData: false,
        playlistData: null,
        currentPlaylist: null,
        authorizingSpotify: false,
        spotifyAuthorized: false,
        spotifyAuthCancelled: false,
      };

    case CLEAR_APP_ERRORS:
      return {
        ...state,
        errors: [],
      };

    case VIDEO_HEADER_HEIGHT:
      const video_height = action.payload;

      return {
        ...state,
        video_height,
      };

    default:
      return state;
  }
}
