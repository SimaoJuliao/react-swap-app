import { formatUnits } from "viem";
import { usePublicClient } from "wagmi";

import { PANCAKE_ROUTER_ADDRESS } from "../constants";
import { routerAbi } from "../constants";
import { formatAmountDynamic } from "./formatAmountDynamic";
import type { AddressType } from "../types";
import { useGetTokenDecimals } from "./useGetTokenDecimals";
import { useGetBestPath } from "./useGetBestPath";
import toast from "react-hot-toast";

interface AmountsType {
  in: string | null;
  out: string | null;
}

export const useGetEstimatedAmount = () => {
  const publicClient = usePublicClient();
  const getTokenDecimals = useGetTokenDecimals();
  const findBestPath = useGetBestPath();

  return async (
    amount: string | null,
    address: {
      in: AddressType;
      out: AddressType;
    },
    isToGetAmountsOut: boolean,
    fallBack?: (amountsValue: AmountsType) => void
  ): Promise<AmountsType> => {
    let amountsValue: AmountsType = {
      in: null,
      out: null,
    };

    if (publicClient && amount && Number(amount) > 0) {
      try {
        // Get decimals
        const [decimalsIn, decimalsOut] = await Promise.all([
          getTokenDecimals(address.in),
          getTokenDecimals(address.out),
        ]);

        // Convert amount to bigint based on correct decimals
        const amountBigInt = BigInt(
          Math.floor(
            Number(amount) *
              10 ** (isToGetAmountsOut ? decimalsIn : decimalsOut)
          )
        );

        // Swap Path (always IN → OUT)
        const path = await findBestPath(amountBigInt, [
          address.in,
          address.out,
        ]);

        const amounts = await publicClient.readContract({
          address: PANCAKE_ROUTER_ADDRESS,
          abi: routerAbi,
          functionName: isToGetAmountsOut ? "getAmountsOut" : "getAmountsIn",
          args: [amountBigInt, path],
        });

        const inFormatted = formatUnits(
          (amounts as bigint[])[0],
          decimalsIn as number
        );
        const outFormatted = formatUnits(
          (amounts as bigint[])[amounts.length - 1],
          decimalsOut as number
        );

        amountsValue = {
          in: isToGetAmountsOut ? amount : formatAmountDynamic(inFormatted),
          out: isToGetAmountsOut ? formatAmountDynamic(outFormatted) : amount,
        };
      } catch (error) {
        toast.error("Erro ao calcular estimativa");
      }
    }

    fallBack?.(amountsValue);
    return amountsValue;
  };
};
