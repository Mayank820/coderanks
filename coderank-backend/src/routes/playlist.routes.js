import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  addProblemToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllListDetails,
  getPlaylistDetails,
  removeProblemFromPlaylist,
} from "../controllers/playlist.controller.js";

const playlistRoutes = express.Router();

// details of all playlist, like how many playlist are there for the particular user
playlistRoutes.get("/", authMiddleware, getAllListDetails);

// details of particular playlist, with its problems
playlistRoutes.get("/:playlistId", authMiddleware, getPlaylistDetails);

playlistRoutes.post("/create-playlist", authMiddleware, createPlaylist);

// add problem to playlist
playlistRoutes.post(
  "/:playlistId/problem",
  authMiddleware,
  addProblemToPlaylist
);

// delete playlist
playlistRoutes.delete("/:playlistId", authMiddleware, deletePlaylist);

// remove problem from playlist
playlistRoutes.delete(
  "/:playlistId/remove-problem",
  authMiddleware,
  removeProblemFromPlaylist
);

export default playlistRoutes;
