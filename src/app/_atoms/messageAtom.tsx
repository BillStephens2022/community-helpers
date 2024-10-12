import { atom } from "recoil";
import { MessageBody } from "../_lib/types";

export const messagesState = atom<MessageBody[]>({
  key: "messagesState", // unique key for this atom
  default: [], // initial empty messages array
});