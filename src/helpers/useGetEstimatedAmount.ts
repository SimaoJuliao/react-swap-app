import { formatUnits } from "viem";
import { usePublicClient } from "wagmi";

import { PANCAKE_ROUTER_ADDRESS } from "../constants";
import {routerAbi} from "../constants";
import { formatAmountDynamic } from "./formatAmountDynamic";
import type { AddressType } from "../types";
import { useGetTokenDecimals } from "./useGetTokenDecimals";

interface AmountsType {
  in: string | null;
  out: string | null;
}

export const useGetEstimatedAmount = () => {
  const publicClient = usePublicClient();

  const getTokenDecimals = useGetTokenDecimals();

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
        const tokenInDecimals = await getTokenDecimals(address.in);
        const tokenOutDecimals = await getTokenDecimals(address.out);

        // Convert amount to bigint based on correct decimals
        const amountBigInt = BigInt(
          Math.floor(
            Number(amount) *
              10 ** (isToGetAmountsOut ? tokenInDecimals : tokenOutDecimals)
          )
        );

        // Swap Path (always IN → OUT)
        const path = [address.in, address.out];

        const amounts = await publicClient.readContract({
          address: PANCAKE_ROUTER_ADDRESS,
          abi: routerAbi,
          functionName: isToGetAmountsOut ? "getAmountsOut" : "getAmountsIn",
          args: [amountBigInt, path],
        });

        const outFormatted = formatUnits(
          (amounts as bigint[])[1],
          tokenOutDecimals as number
        );
        const inFormatted = formatUnits(
          (amounts as bigint[])[0],
          tokenInDecimals as number
        );

        amountsValue = {
          in: isToGetAmountsOut ? amount : formatAmountDynamic(inFormatted),
          out: isToGetAmountsOut ? formatAmountDynamic(outFormatted) : amount,
        };
      } catch (error) {
        console.error("Erro ao calcular estimativa:", error);
      }
    }

    fallBack?.(amountsValue);
    return amountsValue;
  };
};
