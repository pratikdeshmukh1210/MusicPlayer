import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, fetchCurrentUser } from '../features/authSlice';
import { fetchLikedSongsAsync } from '../features/musicSlice';
import Player from '../components/Player';
import {
  FaSpotify,
  FaHouse,
  FaMagnifyingGlass,
  FaLinesLeaning,
  FaHeart,
  FaRightFromBracket,
  FaUser,
  FaFire,
  FaCompactDisc,
  FaRadio,
  FaBars,
  FaXmark
} from 'react-icons/fa6';

const Mainlayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(fetchCurrentUser());
      dispatch(fetchLikedSongsAsync());
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col font-sans overflow-hidden select-none">
      {/* Top Mobile Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#121212] border-b border-[#282828] z-30">
        <div className="flex items-center gap-2" onClick={() => navigate('/')}>
          <FaSpotify className="text-[#1ed760] text-3xl" />
          <span className="font-bold text-lg tracking-tight">Spotify</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-[#b3b3b3] hover:text-white"
        >
          {mobileSidebarOpen ? <FaXmark className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </div>

      {/* Main Workspace (Sidebar + Content Viewport) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <aside
          className={`fixed md:static top-0 left-0 h-full w-72 md:w-64 lg:w-72 bg-[#121212] flex flex-col justify-between p-3 gap-2 z-40 transition-transform duration-300 md:translate-x-0 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Top Brand & Primary Nav */}
          <div className="flex flex-col gap-2">
            {/* Spotify Brand */}
            <div
              onClick={() => {
                navigate('/');
                setMobileSidebarOpen(false);
              }}
              className="hidden md:flex items-center gap-2.5 px-4 py-3 cursor-pointer group"
            >
              <FaSpotify className="text-[#1ed760] text-3xl transition-transform group-hover:scale-105" />
              <span className="font-bold text-xl tracking-tight text-white">Spotify</span>
            </div>

            {/* Navigation Card */}
            <div className="bg-[#121212] rounded-lg p-2 flex flex-col gap-1">
              <button
                onClick={() => {
                  navigate('/');
                  setMobileSidebarOpen(false);
                }}
                className={`flex items-center gap-4 px-4 py-2.5 rounded-md font-semibold text-sm transition-colors cursor-pointer w-full text-left ${
                  isActive('/')
                    ? 'text-white bg-[#282828]'
                    : 'text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a]'
                }`}
              >
                <FaHouse className="text-xl" />
                <span>Home</span>
              </button>

              <button
                onClick={() => {
                  navigate('/');
                  setMobileSidebarOpen(false);
                }}
                className="flex items-center gap-4 px-4 py-2.5 rounded-md font-semibold text-sm text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a] transition-colors cursor-pointer w-full text-left"
              >
                <FaMagnifyingGlass className="text-xl" />
                <span>Search</span>
              </button>
            </div>

            {/* Library / Playlists Card */}
            <div className="bg-[#121212] rounded-lg p-3 flex flex-col flex-1 mt-1 border border-[#282828]/40">
              <div className="flex items-center justify-between px-2 mb-3 text-[#b3b3b3] hover:text-white transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <FaLinesLeaning className="text-xl" />
                  <span className="font-bold text-sm">Your Library</span>
                </div>
              </div>

              {/* Playlists / Category quick links */}
              <div className="flex flex-col gap-1 overflow-y-auto max-h-[35vh] pr-1">
                <div
                  onClick={() => {
                    navigate('/');
                    setMobileSidebarOpen(false);
                  }}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-[#282828] cursor-pointer transition-colors group"
                >
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-indigo-700 to-purple-400 flex items-center justify-center text-white flex-shrink-0">
                    <FaHeart className="text-sm" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-white truncate group-hover:text-[#1ed760] transition-colors">
                      Liked Songs
                    </span>
                    <span className="text-xs text-[#b3b3b3] truncate">Playlist • Auto</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    navigate('/');
                    setMobileSidebarOpen(false);
                  }}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-[#282828] cursor-pointer transition-colors group"
                >
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-emerald-600 to-teal-400 flex items-center justify-center text-white flex-shrink-0">
                    <FaFire className="text-sm" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-white truncate group-hover:text-[#1ed760] transition-colors">
                      Bass & Afro Pop
                    </span>
                    <span className="text-xs text-[#b3b3b3] truncate">5 tracks</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    navigate('/');
                    setMobileSidebarOpen(false);
                  }}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-[#282828] cursor-pointer transition-colors group"
                >
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-amber-600 to-rose-500 flex items-center justify-center text-white flex-shrink-0">
                    <FaCompactDisc className="text-sm" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-white truncate group-hover:text-[#1ed760] transition-colors">
                      Classical & Beats
                    </span>
                    <span className="text-xs text-[#b3b3b3] truncate">5 tracks</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    navigate('/');
                    setMobileSidebarOpen(false);
                  }}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-[#282828] cursor-pointer transition-colors group"
                >
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-white flex-shrink-0">
                    <FaRadio className="text-sm" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-white truncate group-hover:text-[#1ed760] transition-colors">
                      Devotional & Peaceful
                    </span>
                    <span className="text-xs text-[#b3b3b3] truncate">3 tracks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Auth Footer Panel */}
          <div className="bg-[#181818] p-3.5 rounded-lg border border-[#282828]">
            {isLoggedIn ? (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1ed760] text-black font-bold flex items-center justify-center text-sm shadow-md">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs text-[#1ed760] font-semibold">Premium Active</span>
                    <span className="text-sm font-bold text-white truncate">
                      {user?.name || user?.email || "Music Lover"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 bg-[#282828] hover:bg-[#333333] text-white hover:text-red-400 px-3 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer w-full"
                >
                  <FaRightFromBracket />
                  <span>Log out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-[#b3b3b3] leading-tight">
                  Sign in to play and explore unlimited music tracks.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigate('/login');
                      setMobileSidebarOpen(false);
                    }}
                    className="flex-1 bg-white hover:bg-gray-200 text-black font-bold py-2 px-3 rounded-full text-xs transition-all cursor-pointer text-center"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => {
                      navigate('/register');
                      setMobileSidebarOpen(false);
                    }}
                    className="flex-1 bg-transparent hover:bg-[#282828] text-white font-bold py-2 px-3 rounded-full text-xs border border-[#555] transition-all cursor-pointer text-center"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Right Scrollable Content Area */}
        <main className="flex-1 bg-[#121212] rounded-lg overflow-y-auto m-2 ml-0 relative flex flex-col">
          <Outlet />
        </main>
      </div>

      {/* Bottom Fixed Spotify Player Bar */}
      <footer className="w-full z-50 flex-shrink-0">
        <Player />
      </footer>
    </div>
  );
};

export default Mainlayout;