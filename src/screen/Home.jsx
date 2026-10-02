import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { playSong } from '../features/musicSlice';
import { useNavigate } from 'react-router-dom';
import MusicPlayers from '../components/MusicPlayers';
import { songsData, categoriesList } from '../data/songs';
import {
  FaMagnifyingGlass,
  FaXmark,
  FaPlay,
  FaPause,
  FaTableCellsLarge,
  FaListUl,
  FaFire,
  FaCompactDisc,
  FaRadio,
  FaChevronLeft,
  FaChevronRight,
  FaClock
} from 'react-icons/fa6';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentMusic, isPlaying } = useSelector((state) => state.music);
  const { isLoggedIn } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("card"); // 'card' | 'row'

  // Filter songs based on search query and category
  const filteredSongs = useMemo(() => {
    return songsData.filter((song) => {
      const matchesCategory =
        selectedCategory === "all" || song.category === selectedCategory;
      const matchesSearch =
        song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (song.album && song.album.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const bassSongs = useMemo(
    () => songsData.filter((s) => s.category === "bass"),
    []
  );
  const classicalSongs = useMemo(
    () => songsData.filter((s) => s.category === "classical"),
    []
  );
  const devotionalSongs = useMemo(
    () => songsData.filter((s) => s.category === "simpal"),
    []
  );

  const handleQuickPlay = (song) => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      dispatch(playSong(song));
    }
  };

  return (
    <div className="w-full min-h-full pb-28 text-white relative">
      {/* Sticky Top Filter & Search Header */}
      <header className="sticky top-0 z-20 bg-[#121212]/95 backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#282828]/50">
        {/* Navigation & Search */}
        <div className="flex items-center gap-3 flex-1 min-w-[280px] max-w-md">
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <button
              onClick={() => window.history.back()}
              className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            <button
              onClick={() => window.history.forward()}
              className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>

          <div className="relative flex-1">
            <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7c7c7c] text-sm" />
            <input
              type="text"
              placeholder="What do you want to play?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-sm text-white placeholder-[#7c7c7c] pl-10 pr-9 py-2.5 rounded-full border border-transparent focus:border-white/20 outline-none transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b3b3b3] hover:text-white"
              >
                <FaXmark className="text-sm" />
              </button>
            )}
          </div>
        </div>

        {/* View Switcher & Category Pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#242424] p-1 rounded-lg border border-[#333333]">
            <button
              onClick={() => setViewMode("card")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "card"
                  ? "bg-[#383838] text-white"
                  : "text-[#b3b3b3] hover:text-white"
              }`}
              title="Grid View"
            >
              <FaTableCellsLarge className="text-sm" />
            </button>
            <button
              onClick={() => setViewMode("row")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "row"
                  ? "bg-[#383838] text-white"
                  : "text-[#b3b3b3] hover:text-white"
              }`}
              title="List View"
            >
              <FaListUl className="text-sm" />
            </button>
          </div>
        </div>
      </header>

      {/* Category Filter Pills */}
      <div className="px-6 pt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categoriesList.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? "bg-white text-black font-bold shadow-md"
                : "bg-[#242424] text-white hover:bg-[#303030]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Content Body */}
      <div className="px-6 pt-6 space-y-8">
        {/* Dynamic Greeting & Quick Access Grid (Shown when not actively searching) */}
        {!searchTerm && selectedCategory === "all" && (
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-4">
              {getGreeting()}
            </h1>

            {/* Quick-Play 6-Pack Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {songsData.slice(0, 6).map((song) => {
                const isThisPlaying =
                  currentMusic?.id === song.id && isPlaying;
                return (
                  <div
                    key={song.id}
                    onClick={() => handleQuickPlay(song)}
                    className="group relative flex items-center bg-[#ffffff14] hover:bg-[#ffffff26] rounded-md overflow-hidden cursor-pointer transition-all duration-300 shadow-md"
                  >
                    <img
                      src={song.image}
                      alt={song.name}
                      className="w-16 h-16 object-cover flex-shrink-0"
                    />
                    <div className="flex-1 px-4 min-w-0">
                      <p className="font-bold text-sm text-white truncate group-hover:text-[#1ed760] transition-colors">
                        {song.name}
                      </p>
                      <p className="text-xs text-[#b3b3b3] truncate">
                        {song.artist}
                      </p>
                    </div>

                    <div
                      className={`mr-3 w-10 h-10 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-lg transition-all duration-300 ${
                        isThisPlaying
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
                      }`}
                    >
                      {isThisPlaying ? (
                        <FaPause className="text-sm" />
                      ) : (
                        <FaPlay className="text-xs ml-0.5" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Search Results or Filtered Mode */}
        {(searchTerm || selectedCategory !== "all") ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                {searchTerm
                  ? `Search results for "${searchTerm}"`
                  : categoriesList.find((c) => c.id === selectedCategory)?.label}
              </h2>
              <span className="text-xs text-[#b3b3b3]">
                {filteredSongs.length} {filteredSongs.length === 1 ? "track" : "tracks"} found
              </span>
            </div>

            {filteredSongs.length === 0 ? (
              <div className="py-16 text-center text-[#b3b3b3] bg-[#181818] rounded-xl border border-[#282828]">
                <p className="text-lg font-semibold text-white mb-1">
                  No tracks found
                </p>
                <p className="text-xs">
                  Try searching for another song name or choose a different category.
                </p>
              </div>
            ) : viewMode === "card" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {filteredSongs.map((song, idx) => (
                  <MusicPlayers key={song.id} elem={song} viewMode="card" index={idx + 1} />
                ))}
              </div>
            ) : (
              <div className="bg-[#181818] rounded-xl p-3 border border-[#282828]">
                <div className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-[#b3b3b3] border-b border-[#282828] mb-2 uppercase tracking-wider">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="w-6 text-center">#</span>
                    <span>Title</span>
                  </div>
                  <div className="hidden md:block w-1/4">Album / Genre</div>
                  <div className="flex items-center gap-4">
                    <FaClock />
                  </div>
                </div>
                {filteredSongs.map((song, idx) => (
                  <MusicPlayers key={song.id} elem={song} viewMode="row" index={idx + 1} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Default Rich Categorized Rows */
          <>
            {/* Section 1: Bass & Afro Pop */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <FaFire className="text-emerald-400 text-lg" />
                  <div>
                    <h2 className="text-xl font-bold text-white hover:underline cursor-pointer">
                      Trending Bass & Afro Pop
                    </h2>
                    <p className="text-xs text-[#b3b3b3]">
                      Energetic party beats & high bass rhythms
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCategory("bass")}
                  className="text-xs font-bold text-[#b3b3b3] hover:underline cursor-pointer"
                >
                  Show all
                </button>
              </div>

              {viewMode === "card" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {bassSongs.map((song, idx) => (
                    <MusicPlayers key={song.id} elem={song} viewMode="card" index={idx + 1} />
                  ))}
                </div>
              ) : (
                <div className="bg-[#181818] rounded-xl p-3 border border-[#282828]">
                  {bassSongs.map((song, idx) => (
                    <MusicPlayers key={song.id} elem={song} viewMode="row" index={idx + 1} />
                  ))}
                </div>
              )}
            </div>

            {/* Section 2: Classical & Cinematic */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <FaCompactDisc className="text-amber-400 text-lg" />
                  <div>
                    <h2 className="text-xl font-bold text-white hover:underline cursor-pointer">
                      Classical & Cinematic Beats
                    </h2>
                    <p className="text-xs text-[#b3b3b3]">
                      Action percussions, stomp drums & orchestral vibes
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCategory("classical")}
                  className="text-xs font-bold text-[#b3b3b3] hover:underline cursor-pointer"
                >
                  Show all
                </button>
              </div>

              {viewMode === "card" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {classicalSongs.map((song, idx) => (
                    <MusicPlayers key={song.id} elem={song} viewMode="card" index={idx + 1} />
                  ))}
                </div>
              ) : (
                <div className="bg-[#181818] rounded-xl p-3 border border-[#282828]">
                  {classicalSongs.map((song, idx) => (
                    <MusicPlayers key={song.id} elem={song} viewMode="row" index={idx + 1} />
                  ))}
                </div>
              )}
            </div>

            {/* Section 3: Devotional & Simpal */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <FaRadio className="text-cyan-400 text-lg" />
                  <div>
                    <h2 className="text-xl font-bold text-white hover:underline cursor-pointer">
                      Spiritual, Bhajans & Acoustic
                    </h2>
                    <p className="text-xs text-[#b3b3b3]">
                      Peaceful melodies, Krishna bhajans & soul harmonies
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCategory("simpal")}
                  className="text-xs font-bold text-[#b3b3b3] hover:underline cursor-pointer"
                >
                  Show all
                </button>
              </div>

              {viewMode === "card" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {devotionalSongs.map((song, idx) => (
                    <MusicPlayers key={song.id} elem={song} viewMode="card" index={idx + 1} />
                  ))}
                </div>
              ) : (
                <div className="bg-[#181818] rounded-xl p-3 border border-[#282828]">
                  {devotionalSongs.map((song, idx) => (
                    <MusicPlayers key={song.id} elem={song} viewMode="row" index={idx + 1} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;