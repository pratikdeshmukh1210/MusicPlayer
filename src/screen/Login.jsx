import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { FaSpotify } from 'react-icons/fa6';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      const username = email.split('@')[0] || "User";
      dispatch(login({ email, name: username.charAt(0).toUpperCase() + username.slice(1) }));
      navigate('/');
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div className="min-h-full w-full flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-b from-[#1e1e1e] to-[#121212] text-white">
      <div className="w-full max-w-md bg-[#121212] border border-[#282828] p-8 md:p-10 rounded-2xl shadow-2xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <FaSpotify className="text-[#1ed760] text-5xl mb-3 hover:scale-105 transition-transform" />
          <h1 className="text-2xl md:text-3xl font-black text-center tracking-tight">
            Log in to Spotify
          </h1>
          <p className="text-xs text-[#b3b3b3] mt-1">
            Unlimited music streaming awaits you
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white mb-1.5" htmlFor="email">
              Email or username
            </label>
            <input
              id="email"
              type="text"
              placeholder="Email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#121212] text-white placeholder-[#727272] text-sm px-4 py-3 rounded-md border border-[#727272]/50 hover:border-white focus:border-white focus:outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#121212] text-white placeholder-[#727272] text-sm px-4 py-3 rounded-md border border-[#727272]/50 hover:border-white focus:border-white focus:outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-[1.02] active:scale-[0.98] text-black font-extrabold py-3.5 px-6 rounded-full text-sm uppercase tracking-wider transition-all duration-200 mt-6 shadow-lg shadow-[#1ed760]/20 cursor-pointer"
          >
            Log In
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-[1px] bg-[#282828] flex-1"></div>
          <span className="text-xs text-[#b3b3b3] uppercase tracking-widest">or</span>
          <div className="h-[1px] bg-[#282828] flex-1"></div>
        </div>

        <div className="text-center">
          <p className="text-sm text-[#b3b3b3]">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-white hover:text-[#1ed760] font-bold underline ml-1 transition-colors"
            >
              Sign up for Spotify
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
