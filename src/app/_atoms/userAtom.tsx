import { atom } from "recoil";

interface User {
  firstName: string;
  lastName: string;
  skills: string[];
}

export const userState = atom<User | null>({
    key: 'userState', // unique ID for this atom
    default: null,    // default value (user starts as null)
  });
