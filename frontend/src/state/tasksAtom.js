import { atom } from "recoil";

export const tasksState = atom({
  key: "tasksAtom",
  default: [],
});
