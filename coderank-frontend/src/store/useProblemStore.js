import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  solvedProblem: [],
  isProblemsLoading: false,
  isProblemLoading: false,

  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });
      const res = await axiosInstance.get("/problems/get-all-problems");
      set({ problems: res.data.problems });
    } catch (error) {
      console.log("Error getting problems", error);
      toast.error("Error getting problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async () => {
    try {
      set({ isProblemLoading: true });
      const res = await axiosInstance.get("/problems/get-problem-by-id");
      set({ problem: res.data.problem });
    } catch (error) {
      console.log("Error getting problem", error);
      toast.error("Error getting problem");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemByUser: async () => {
    try {
      set({ isProblemLoading: true });
      const res = await axiosInstance.get(
        "/problems/get-solved-problem-by-user"
      );
      set({ solvedProblem: res.data.problems });
    } catch (error) {
      console.log("Error getting problem", error);
      toast.error("Error getting problem");
    } finally {
      set({ isProblemLoading: false });
    }
  },
}));
