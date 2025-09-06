import { usePublicClient } from "wagmi";

import erc20Abi from "../constants/erc20ABI.json";
import type { AddressType } from "../types";

const decimalsCache = new Map<AddressType, number>();

export const useGetTokenDecimals = () => {
  const publicClient = usePublicClient();

  return async (address: AddressType): Promise<number> => {
    // If we already have it in cache, we return it directly
    if (decimalsCache.has(address)) {
      return decimalsCache.get(address)!;
    }

    let decimalsNumber = 0;

    if (publicClient) {
      // Otherwise, we read the contract and keep it
      const decimals = await publicClient.readContract({
        address,
        abi: erc20Abi,
        functionName: "decimals",
      });

      decimalsNumber = decimals as number;
      decimalsCache.set(address, decimalsNumber);
    }

    return decimalsNumber;
  };
};
