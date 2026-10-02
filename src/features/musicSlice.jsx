import { createSlice } from "@reduxjs/toolkit";
import { songsData } from "../data/songs";

const musicSlice = createSlice({
  name: "music",
  initialState: {
    currentMusic: songsData[0], // default to first track so player is ready
    isPlaying: false,
    playlist: songsData,
    currentIndex: 0,
    volume: 0.8,
    isMuted: false,
    isShuffle: false,
    isRepeat: false, // false | true (single loop)
    currentTime: 0,
    duration: 0,
    likedSongs: [1, 3, 6, 11], // default sample liked song IDs
  },
  reducers: {
    playSong: (state, action) => {
      // Toggle same song OR play a new one
      if (state.isPlaying && state.currentMusic?.id === action.payload.id) {
        state.isPlaying = false;
      } else {
        state.currentMusic = action.payload;
        state.isPlaying = true;
        const index = state.playlist.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.currentIndex = index;
        }
      }
    },

    playAndPause: (state) => {
      state.isPlaying = !state.isPlaying;
    },

    nextSong: (state) => {
      if (!state.playlist || state.playlist.length === 0) return;

      if (state.isShuffle) {
        const randomIndex = Math.floor(Math.random() * state.playlist.length);
        state.currentIndex = randomIndex;
        state.currentMusic = state.playlist[randomIndex];
        state.isPlaying = true;
        return;
      }

      const nextIndex = (state.currentIndex + 1) % state.playlist.length;
      state.currentIndex = nextIndex;
      state.currentMusic = state.playlist[nextIndex];
      state.isPlaying = true;
    },

    prevSong: (state) => {
      if (!state.playlist || state.playlist.length === 0) return;

      if (state.isShuffle) {
        const randomIndex = Math.floor(Math.random() * state.playlist.length);
        state.currentIndex = randomIndex;
        state.currentMusic = state.playlist[randomIndex];
        state.isPlaying = true;
        return;
      }

      const prevIndex = (state.currentIndex - 1 + state.playlist.length) % state.playlist.length;
      state.currentIndex = prevIndex;
      state.currentMusic = state.playlist[prevIndex];
      state.isPlaying = true;
    },

    setVolume: (state, action) => {
      state.volume = action.payload;
      if (action.payload > 0) {
        state.isMuted = false;
      }
    },

    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },

    toggleShuffle: (state) => {
      state.isShuffle = !state.isShuffle;
    },

    toggleRepeat: (state) => {
      state.isRepeat = !state.isRepeat;
    },

    setPlaylist: (state, action) => {
      state.playlist = action.payload;
    },

    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },

    setDuration: (state, action) => {
      state.duration = action.payload;
    },

    toggleLikeSong: (state, action) => {
      const songId = action.payload;
      if (state.likedSongs.includes(songId)) {
        state.likedSongs = state.likedSongs.filter((id) => id !== songId);
      } else {
        state.likedSongs.push(songId);
      }
    }
  },
});

export const {
  playSong,
  playAndPause,
  nextSong,
  prevSong,
  setVolume,
  toggleMute,
  toggleShuffle,
  toggleRepeat,
  setPlaylist,
  setCurrentTime,
  setDuration,
  toggleLikeSong
} = musicSlice.actions;

export default musicSlice.reducer;
