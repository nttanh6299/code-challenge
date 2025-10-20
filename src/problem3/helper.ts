import { WalletBalance } from "./types";

export const PRIORITY_MAP: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
  Unknown: -99,
};

export const getPriority = (blockchain: WalletBalance["blockchain"]): number =>
  PRIORITY_MAP[blockchain] ?? PRIORITY_MAP.Unknown;
