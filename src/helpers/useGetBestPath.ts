import { usePublicClient } from "wagmi";

import { PANCAKE_ROUTER_ADDRESS, coinOne } from "../constants";
import { routerAbi } from "../constants";
import type { AddressType } from "../types";

export const useGetBestPath = () => {
  const publicClient = usePublicClient();

  return async (amount: bigint, path: AddressType[]) => {
    if (!publicClient) {
      return path;
    }

    try {
      await publicClient.readContract({
        address: PANCAKE_ROUTER_ADDRESS,
        abi: routerAbi,
        functionName: "getAmountsOut",
        args: [amount, path],
      });

      return path;
    } catch {
      const newPath = [path[0], coinOne.address, path[1]];

      await publicClient.readContract({
        address: PANCAKE_ROUTER_ADDRESS,
        abi: routerAbi,
        functionName: "getAmountsOut",
        args: [amount, newPath],
      });

      return newPath;
    }
  };
};
