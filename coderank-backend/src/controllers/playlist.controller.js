import { db } from "../libs/db.js";

export const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    const playList = await db.playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Playlist created successfully",
      playList,
    });
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({ error: "Failed to create playlist" });
  }
};

export const getAllListDetails = async (req, res) => {
  try {
    const playLists = await db.playlist.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Playlist fetched successfully",
      playLists,
    });
  } catch (error) {
    console.error("Error fetching playlist:", error);
    res.status(500).json({ error: "Failed to fetch playlist" });
  }
};

export const getPlaylistDetails = async (req, res) => {
  const { playlistId } = req.params;
  //   console.log(playlistId );
  if (!playlistId) {
    return res.status(400).json({ error: "Playlist ID is required" });
  }

  try {
    const playList = await db.playlist.findUnique({
      where: {
        id: playlistId,
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    if (!playList) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    res.status(200).json({
      success: true,
      message: "Playlist fetched successfully",
      playList,
    });
  } catch (error) {
    console.error("Error fetching playlist:", error);
    res.status(500).json({ error: "Failed to fetch playlist" });
  }
};

export const addProblemToPlaylist = async (req, res) => {
  const { playlistId  } = req.params;

  // array of problem ids, means multiple problems to be added to playlist
  const { problemIds } = req.body;

  try {
    // check if problem ids are valid, means array of problem ids
    if (!Array.isArray(problemIds || problemIds.length === 0)) {
      return res.status(400).json({ error: "Invalid or missing problemIds" });
    }

    // check if problem is already exist in playlist
    const problemInPlaylist = await db.problemInPlaylist.findMany({
      where: {
        playListId: playlistId ,
        problemId: { in: problemIds },
      },
    });

    if (problemInPlaylist.length > 0) {
      return res
        .status(400)
        .json({ error: "Problem already exists in playlist" });
    }

    // create many problem in playlist
    const problemsInPlaylist = await db.problemInPlaylist.createMany({
      data: problemIds.map((problemId) => ({
        playListId: playlistId ,
        problemId,
      })),
    });

    res.status(201).json({
      success: true,
      message: "Problems added to playlist successfully",
      problemsInPlaylist,
    });
  } catch (error) {
    console.error("Error adding problems to playlist:", error.message);
    res.status(500).json({ error: "Failed to add problems to playlist" });
  }
};

export const deletePlaylist = async (req, res) => {
  const { playlistId  } = req.params;
  try {
    const deletePlaylist = await db.playlist.delete({
      where: {
        id: playlistId ,
        // userId: req.user.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
      deletePlaylist,
    });
  } catch (error) {
    console.error("Error deleting playlist:", error.message);
    res.status(500).json({ error: "Failed to delete playlist" });
  }
};
export const removeProblemFromPlaylist = async (req, res) => {
  const { playListId } = req.params;
  const { problemIds } = req.body;

  try {
    if (!Array.isArray(problemIds || problemIds.length === 0)) {
      return res.status(400).json({ error: "Invalid or missing problemIds" });
    }

    // delete only given problem from playlist, not all problems from playlist
    const deletedProblem = await db.problemInPlaylist.deleteMany({
      where: {
        playlistId: playListId,
        problemId: {
          in: problemIds,
        },
      },
    });
    res.status(200).json({
      success: true,
      message: "Problem removed from playlist successfully",
      deletedProblem,
    });
  } catch (error) {
    console.error("Error removing problem from playlist:", error.message);
    res.status(500).json({ error: "Failed to remove problem from playlist" });
  }
};
