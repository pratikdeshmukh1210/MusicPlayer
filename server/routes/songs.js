import express from 'express';
import { dbService } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/songs/like
// @desc    Toggle like for a song in database
router.post('/like', authMiddleware, async (req, res) => {
  try {
    const { songId } = req.body;
    if (songId === undefined || songId === null) {
      return res.status(400).json({ success: false, message: 'Song ID is required' });
    }

    const updatedLikedSongs = await dbService.toggleLikedSong(req.user.id, Number(songId));
    if (!updatedLikedSongs) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Liked songs updated in database',
      likedSongs: updatedLikedSongs,
    });
  } catch (error) {
    console.error('Like toggle error:', error);
    res.status(500).json({ success: false, message: 'Error updating liked songs in database' });
  }
});

// @route   GET /api/songs/liked
// @desc    Get user's liked song IDs
router.get('/liked', authMiddleware, async (req, res) => {
  try {
    const likedSongs = await dbService.getUserLikedSongs(req.user.id);
    res.json({
      success: true,
      likedSongs,
    });
  } catch (error) {
    console.error('Get liked songs error:', error);
    res.status(500).json({ success: false, message: 'Error fetching liked songs' });
  }
});

export default router;
