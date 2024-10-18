import { atom } from "recoil";
import { ContractBody } from "../_lib/types";

export const contractsState = atom<ContractBody[]>({
  key: "contractsState", // unique key for this atom
  default: [], // initial empty messages array
});