import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { IBetType } from "./types/bet";
import { IGameStatus } from "./types/game-status";

export const BET_SMALL: IBetType = "small";
export const BET_BIG: IBetType = "big";

export const BET_TYPE: Array<{ title: IBetType; range: number[] }> = [
  {
    title: BET_SMALL,
    range: [4, 10],
  },
  {
    title: BET_BIG,
    range: [11, 17],
  },
];

export const GAME_STATUS = {
  BETTING: "betting",
  ROLLING: "rolling",
  BET_CLOSED: "bet_closed",
  RESULT_THREE_OF_A_KIND: "three_of_a_kind",
  RESULT_BIG_WINS: "big_wins",
  RESULT_SMALL_WINS: "small_wins",
  LOADING: "loading",
  READY: "ready"
} as const;

export const SOLANA_NETWORK = WalletAdapterNetwork.Mainnet
