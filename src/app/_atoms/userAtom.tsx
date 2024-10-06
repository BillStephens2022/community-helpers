import { atom } from "recoil";
import { User } from "../_lib/types"

export const userState = atom<User | null>({
    key: 'userState', // unique ID for this atom
    default: null,    // default value (user starts as null)
  });
