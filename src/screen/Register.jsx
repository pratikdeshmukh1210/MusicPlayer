import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../features/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { FaSpotify } from 'react-icons/fa6';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && password) {
      dispatch(register({ name, email }));
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
            Sign up to start listening
          </h1>
          <p className="text-xs text-[#b3b3b3] mt-1">
            Free on Spotify. No credit card needed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white mb-1.5" htmlFor="name">
              What's your name?
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#121212] text-white placeholder-[#727272] text-sm px-4 py-3 rounded-md border border-[#727272]/50 hover:border-white focus:border-white focus:outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white mb-1.5" htmlFor="email">
              What's your email?
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#121212] text-white placeholder-[#727272] text-sm px-4 py-3 rounded-md border border-[#727272]/50 hover:border-white focus:border-white focus:outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white mb-1.5" htmlFor="password">
              Create a password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
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
            Sign Up
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-[1px] bg-[#282828] flex-1"></div>
          <span className="text-xs text-[#b3b3b3] uppercase tracking-widest">or</span>
          <div className="h-[1px] bg-[#282828] flex-1"></div>
        </div>

        <div className="text-center">
          <p className="text-sm text-[#b3b3b3]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-white hover:text-[#1ed760] font-bold underline ml-1 transition-colors"
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
