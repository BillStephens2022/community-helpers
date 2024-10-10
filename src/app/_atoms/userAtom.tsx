import { atom } from "recoil";
import { User } from "../_lib/types";

export const userState = atom<User | null>({
  key: "userState", // unique ID
  default: null, // default value - this is the initial state for a user which starts as null
});

export const usersState = atom<User[]>({
  key: "usersAtom", // unique ID
  default: [], // default value - this is the initial state for users in the community which starts as an empty array
});
