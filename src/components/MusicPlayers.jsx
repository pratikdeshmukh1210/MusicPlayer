import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { playSong, toggleLikeSong, toggleLikeSongAsync } from '../features/musicSlice';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaPause, FaHeart, FaRegHeart } from 'react-icons/fa6';

const MusicPlayers = ({ elem, viewMode = "card", index = 1 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentMusic, isPlaying, likedSongs } = useSelector((state) => state.music);
  const { isLoggedIn } = useSelector((state) => state.auth);

  const isCurrent = currentMusic?.id === elem.id;
  const isThisPlaying = isCurrent && isPlaying;
  const isLiked = likedSongs?.includes(elem.id);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    dispatch(playSong(elem));
  };

  // Row / List View (Spotify Tracklist format)
  if (viewMode === "row") {
    return (
      <div
        onClick={handlePlayClick}
        className={`group flex items-center justify-between px-4 py-2.5 rounded-md transition-all duration-200 cursor-pointer ${
          isCurrent
            ? 'bg-[#ffffff1f] text-[#1ed760]'
            : 'hover:bg-[#ffffff14] text-[#b3b3b3]'
        }`}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
          {/* Track Number / Play Button */}
          <div className="w-6 text-center text-sm font-medium flex items-center justify-center flex-shrink-0">
            {isThisPlaying ? (
              <div className="flex items-end justify-center gap-0.5 h-3.5">
                <span className="w-0.5 bg-[#1ed760] animate-eq-1 rounded-t h-full"></span>
                <span className="w-0.5 bg-[#1ed760] animate-eq-2 rounded-t h-full"></span>
                <span className="w-0.5 bg-[#1ed760] animate-eq-3 rounded-t h-full"></span>
              </div>
            ) : (
              <>
                <span className="group-hover:hidden text-[#b3b3b3]">{index}</span>
                <FaPlay className="hidden group-hover:block text-white text-xs" />
              </>
            )}
          </div>

          {/* Album thumbnail & Title */}
          <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-[#282828]">
            <img
              src={elem.image}
              alt={elem.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="flex flex-col min-w-0">
            <span
              className={`text-sm font-semibold truncate ${
                isCurrent ? 'text-[#1ed760]' : 'text-white group-hover:underline'
              }`}
            >
              {elem.name}
            </span>
            <span className="text-xs text-[#b3b3b3] truncate">
              {elem.artist || elem.categoryLabel}
            </span>
          </div>
        </div>

        {/* Album / Category */}
        <div className="hidden md:block w-1/4 text-xs text-[#b3b3b3] truncate">
          {elem.album || elem.categoryLabel}
        </div>

        {/* Action & Duration */}
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(toggleLikeSong(elem.id));
              if (isLoggedIn) {
                dispatch(toggleLikeSongAsync(elem.id));
              }
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
          >
            {isLiked ? (
              <FaHeart className="text-[#1ed760] text-sm !opacity-100" />
            ) : (
              <FaRegHeart className="text-[#b3b3b3] hover:text-white text-sm" />
            )}
          </button>

          <span className="text-xs text-[#b3b3b3] font-mono min-w-[35px] text-right">
            {elem.duration || "2:45"}
          </span>
        </div>
      </div>
    );
  }

  // Card View (Spotify Card with glowing green play button on hover)
  return (
    <div
      onClick={handlePlayClick}
      className={`group relative p-4 rounded-lg bg-[#181818] hover:bg-[#282828] transition-all duration-300 cursor-pointer flex flex-col ${
        isCurrent ? 'ring-1 ring-[#1ed760]/30 shadow-lg bg-[#202020]' : 'shadow-md'
      }`}
    >
      {/* Artwork container with play button */}
      <div className="relative w-full aspect-square rounded-md overflow-hidden bg-[#242424] mb-3.5 shadow-md">
        <img
          src={elem.image}
          alt={elem.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Floating Spotify Green Play Button */}
        <div
          className={`absolute right-2.5 bottom-2.5 w-11 h-11 bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-106 rounded-full flex items-center justify-center text-black shadow-2xl transition-all duration-300 ease-out ${
            isThisPlaying
              ? 'opacity-100 translate-y-0 shadow-[#1ed760]/40'
              : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
          }`}
        >
          {isThisPlaying ? (
            <FaPause className="text-base text-black" />
          ) : (
            <FaPlay className="text-sm text-black ml-0.5" />
          )}
        </div>

        {/* Category Pill Tag */}
        <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-[10px] font-medium text-white/90 px-2 py-0.5 rounded-full uppercase tracking-wider">
          {elem.category}
        </span>
      </div>

      {/* Song details */}
      <div className="flex flex-col flex-grow min-w-0">
        <h3
          className={`text-sm font-bold truncate mb-1 ${
            isCurrent ? 'text-[#1ed760]' : 'text-white'
          }`}
          title={elem.name}
        >
          {elem.name}
        </h3>
        <p className="text-xs text-[#b3b3b3] line-clamp-2 leading-relaxed">
          {elem.artist} • {elem.categoryLabel}
        </p>
      </div>

      {/* Footer info & like */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#333333]/50 text-xs text-[#b3b3b3]">
        <span className="font-mono text-[11px]">{elem.duration || "2:30"}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(toggleLikeSong(elem.id));
            if (isLoggedIn) {
              dispatch(toggleLikeSongAsync(elem.id));
            }
          }}
          className="p-1 text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
        >
          {isLiked ? (
            <FaHeart className="text-[#1ed760] text-sm" />
          ) : (
            <FaRegHeart className="text-sm" />
          )}
        </button>
      </div>
    </div>
  );
};

export default MusicPlayers;
