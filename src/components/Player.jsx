import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  playAndPause,
  nextSong,
  prevSong,
  setVolume,
  toggleMute,
  toggleShuffle,
  toggleRepeat,
  setCurrentTime,
  setDuration,
  toggleLikeSong,
  toggleLikeSongAsync
} from '../features/musicSlice';
import {
  FaPlay,
  FaPause,
  FaForwardStep,
  FaBackwardStep,
  FaShuffle,
  FaRepeat,
  FaHeart,
  FaRegHeart,
  FaVolumeHigh,
  FaVolumeLow,
  FaVolumeXmark,
  FaListUl,
  FaExpand
} from 'react-icons/fa6';

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds === null) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const Player = () => {
  const dispatch = useDispatch();
  const audioRef = useRef(null);

  const {
    currentMusic,
    isPlaying,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    currentTime,
    duration,
    likedSongs
  } = useSelector((state) => state.music);

  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  // Sync audio source and play/pause state
  useEffect(() => {
    if (!audioRef.current || !currentMusic) return;

    // Check if source changed
    const currentSrc = audioRef.current.getAttribute('src');
    if (currentSrc !== currentMusic.src) {
      audioRef.current.src = currentMusic.src;
      audioRef.current.load();
    }

    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Audio playback error:", err);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [currentMusic, isPlaying]);

  // Sync volume & mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle time updates from HTML5 audio
  const handleTimeUpdate = () => {
    if (!isSeeking && audioRef.current) {
      dispatch(setCurrentTime(audioRef.current.currentTime));
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      dispatch(setDuration(audioRef.current.duration || 0));
    }
  };

  const handleEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      dispatch(nextSong());
    }
  };

  const handleSeekChange = (e) => {
    setIsSeeking(true);
    setSeekValue(Number(e.target.value));
  };

  const handleSeekCommit = (e) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    dispatch(setCurrentTime(newTime));
    setIsSeeking(false);
  };

  const handleVolumeChange = (e) => {
    const newVol = Number(e.target.value);
    dispatch(setVolume(newVol));
  };

  if (!currentMusic) return null;

  const isLiked = likedSongs?.includes(currentMusic.id);
  const activeTime = isSeeking ? seekValue : currentTime;
  const progressPercent = duration > 0 ? (activeTime / duration) * 100 : 0;
  const volumePercent = isMuted ? 0 : volume * 100;

  return (
    <div className="w-full bg-[#181818] border-t border-[#282828] text-white px-4 py-3 select-none transition-all duration-300">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Track Information */}
        <div className="flex items-center gap-3.5 min-w-[200px] max-w-[30%] w-1/4">
          <div className="relative group w-14 h-14 rounded-md overflow-hidden bg-[#282828] shadow-lg flex-shrink-0">
            <img
              src={
                currentMusic.image ||
                "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&auto=format&fit=crop&q=80"
              }
              alt={currentMusic.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-2 gap-0.5">
                <span className="w-1 bg-[#1ed760] animate-eq-1 rounded-t"></span>
                <span className="w-1 bg-[#1ed760] animate-eq-2 rounded-t"></span>
                <span className="w-1 bg-[#1ed760] animate-eq-3 rounded-t"></span>
              </div>
            )}
          </div>

          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-sm font-semibold text-white hover:underline truncate cursor-pointer">
              {currentMusic.name}
            </span>
            <span className="text-xs text-[#b3b3b3] hover:underline hover:text-white truncate cursor-pointer">
              {currentMusic.artist || currentMusic.categoryLabel || "Spotify Track"}
            </span>
          </div>

          <button
            onClick={() => {
              dispatch(toggleLikeSong(currentMusic.id));
              if (localStorage.getItem('token')) {
                dispatch(toggleLikeSongAsync(currentMusic.id));
              }
            }}
            className="text-[#b3b3b3] hover:text-white transition-colors p-1 flex-shrink-0 cursor-pointer"
            title={isLiked ? "Remove from Liked Songs" : "Save to Liked Songs"}
          >
            {isLiked ? (
              <FaHeart className="text-[#1ed760] text-base" />
            ) : (
              <FaRegHeart className="text-base hover:text-white" />
            )}
          </button>
        </div>

        {/* Center: Playback Controls & Progress Bar */}
        <div className="flex flex-col items-center max-w-[722px] w-2/4">
          <div className="flex items-center gap-6 mb-1.5">
            {/* Shuffle */}
            <button
              onClick={() => dispatch(toggleShuffle())}
              className={`transition-colors cursor-pointer relative ${
                isShuffle ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
              }`}
              title="Enable shuffle"
            >
              <FaShuffle className="text-sm" />
              {isShuffle && (
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1ed760] rounded-full"></span>
              )}
            </button>

            {/* Previous */}
            <button
              onClick={() => dispatch(prevSong())}
              className="text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
              title="Previous"
            >
              <FaBackwardStep className="text-lg" />
            </button>

            {/* Main Play/Pause Button */}
            <button
              onClick={() => dispatch(playAndPause())}
              className="w-9 h-9 flex items-center justify-center bg-white rounded-full text-black hover:scale-106 active:scale-95 transition-all shadow-md cursor-pointer"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <FaPause className="text-sm" />
              ) : (
                <FaPlay className="text-sm ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={() => dispatch(nextSong())}
              className="text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
              title="Next"
            >
              <FaForwardStep className="text-lg" />
            </button>

            {/* Repeat */}
            <button
              onClick={() => dispatch(toggleRepeat())}
              className={`transition-colors cursor-pointer relative ${
                isRepeat ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
              }`}
              title="Enable repeat"
            >
              <FaRepeat className="text-sm" />
              {isRepeat && (
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1ed760] rounded-full"></span>
              )}
            </button>
          </div>

          {/* Time & Scrub Bar */}
          <div className="w-full flex items-center gap-2.5 group/bar">
            <span className="text-[11px] text-[#b3b3b3] w-9 text-right font-mono">
              {formatTime(activeTime)}
            </span>

            <div className="relative flex-1 flex items-center h-4 cursor-pointer">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.5}
                value={activeTime || 0}
                onChange={handleSeekChange}
                onMouseUp={handleSeekCommit}
                onTouchEnd={handleSeekCommit}
                style={{
                  background: `linear-gradient(to right, #1ed760 ${progressPercent}%, #4d4d4d ${progressPercent}%)`
                }}
                className="w-full h-1 group-hover/bar:h-1.5 rounded-full appearance-none transition-all"
              />
            </div>

            <span className="text-[11px] text-[#b3b3b3] w-9 font-mono">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right: Extra Controls & Volume */}
        <div className="flex items-center justify-end gap-3 min-w-[180px] max-w-[30%] w-1/4">
          <button
            onClick={() => dispatch(toggleMute())}
            className="text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <FaVolumeXmark className="text-base text-red-400" />
            ) : volume < 0.5 ? (
              <FaVolumeLow className="text-base" />
            ) : (
              <FaVolumeHigh className="text-base" />
            )}
          </button>

          <div className="w-24 flex items-center group/vol cursor-pointer">
            <input
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              style={{
                background: `linear-gradient(to right, #1ed760 ${volumePercent}%, #4d4d4d ${volumePercent}%)`
              }}
              className="w-full h-1 group-hover/vol:h-1.5 rounded-full appearance-none transition-all"
            />
          </div>

          <button
            className="text-[#b3b3b3] hover:text-white transition-colors p-1.5 cursor-pointer hidden md:block"
            title="Playlist Queue"
          >
            <FaListUl className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Player;
