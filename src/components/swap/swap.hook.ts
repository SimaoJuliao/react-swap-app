import { useMemo, useRef, useState } from "react";
import { useAccount } from "wagmi";

import { coinOne, coinTwo, coinFiat } from "../../constants";
import { useGetBalance, useGetEstimatedAmount, useSwap } from "../../helpers";
import { debounce } from "lodash";
import type { CoinType } from "../../types";

interface CoinsType {
  coinIN: CoinType;
  coinOUT: CoinType;
}

interface LoadingType {
  in: boolean;
  out: boolean;
}

interface SwapState {
  coins: CoinsType;
  slippage: number;
  loading: LoadingType;
}

export const useSwapHelper = () => {
  const { isConnected } = useAccount();
  const fetchEstimatedAmount = useGetEstimatedAmount();
  const { swapTokens } = useSwap();
  const requestIdRef = useRef(0);

  const [{ coins, slippage, loading }, setSwapState] = useState<SwapState>({
    coins: {
      coinIN: { ...coinOne, value: null },
      coinOUT: { ...coinTwo, value: null },
    },
    loading: {
      in: false,
      out: false,
    },
    slippage: 0.1,
  });

  const balance = useGetBalance({
    coinIN: coins.coinIN,
    coinOUT: coins.coinOUT,
  });

  const insufficientBalance = useMemo(() => {
    if (!balance.in || !coins.coinIN.value) return true;

    return parseFloat(balance.in) < parseFloat(coins.coinIN.value);
  }, [coins.coinIN.value, balance]);

  const handleOnChangeSlippage = (value: number) => {
    setSwapState((prev) => ({ ...prev, slippage: value }));
  };

  const handleCurrencySwitch = () => {
    setSwapState((prev) => ({
      ...prev,
      coins: { coinIN: prev.coins.coinOUT, coinOUT: prev.coins.coinIN },
    }));
  };

  const debouncedHandleFetchEstimate = debounce(
    async (amount: string, isToGetAmountsOut: boolean, requestId: number) => {
      const isValidAmount = parseFloat(amount) > 0;

      // Abort if this request is not the most recent one
      if (requestId !== requestIdRef.current) {
        return;
      }

      // If the amount is invalid, reset the coin values
      if (!isValidAmount) {
        setSwapState((prev) => {
          const [targetCoin, oppositeCoin]: [keyof CoinsType, keyof CoinsType] =
            isToGetAmountsOut ? ["coinIN", "coinOUT"] : ["coinOUT", "coinIN"];

          return {
            ...prev,
            coins: {
              ...prev.coins,
              [oppositeCoin]: {
                ...prev.coins[oppositeCoin],
                value: "",
                fiatValue: "",
              },
              [targetCoin]: { ...prev.coins[targetCoin], fiatValue: "" },
            },
            loading: { in: false, out: false },
          };
        });

        return;
      }

      // Fetch the estimated amount for the swap
      const { in: amountIN, out: amountOUT } = await fetchEstimatedAmount(
        amount,
        {
          in: coins.coinIN.address,
          out: coins.coinOUT.address,
        },
        isToGetAmountsOut
      );

      // Fetch the fiat value of the input coin
      const { out: amountINFiat } = await fetchEstimatedAmount(
        amountIN,
        {
          in: coins.coinIN.address,
          out: coinFiat.address,
        },
        true
      );

      // Fetch the fiat value of the output coin
      const { out: amountOUTFiat } = await fetchEstimatedAmount(
        amountOUT,
        {
          in: coins.coinOUT.address,
          out: coinFiat.address,
        },
        true
      );

      // Abort if this request is not the most recent one
      if (requestId !== requestIdRef.current) {
        return;
      }

      // Update the coin values based on the fetched estimates
      setSwapState((prev) => {
        const updated = { ...prev };

        if (isToGetAmountsOut) {
          updated.coins.coinIN.fiatValue = amountINFiat;
          updated.coins.coinOUT.value = amountOUT;
          updated.coins.coinOUT.fiatValue = amountOUTFiat;
        } else {
          updated.coins.coinIN.value = amountIN;
          updated.coins.coinIN.fiatValue = amountINFiat;
          updated.coins.coinOUT.fiatValue = amountOUTFiat;
        }

        updated.loading = { in: false, out: false };

        return updated;
      });
    },
    300
  );

  const handleFetchEstimate = (amount: string, isToGetAmountsOut: boolean) => {
    // generate a new request ID
    const newRequestId = Date.now();
    requestIdRef.current = newRequestId;

    // Update the coins state with the new amount
    setSwapState((prev) => {
      const updated = { ...prev };

      if (isToGetAmountsOut) {
        updated.coins.coinIN.value = amount;
      } else {
        updated.coins.coinOUT.value = amount;
      }

      if (!loading.in && !loading.out) {
        updated.loading = { in: !isToGetAmountsOut, out: isToGetAmountsOut };
      }

      return updated;
    });

    // Only proceed with fetching the estimate if the amount is valid
    debouncedHandleFetchEstimate(amount, isToGetAmountsOut, newRequestId);
  };

  const handleSwap = () => {
    swapTokens(coins.coinIN, coins.coinOUT, slippage);
  };

  return {
    coins,
    slippage,
    loading,
    balance,
    insufficientBalance,
    isButtonSwapDisable:
      !isConnected || !coins.coinOUT.value || insufficientBalance,
    fetchEstimate: handleFetchEstimate,
    onChangeSlippage: handleOnChangeSlippage,
    currencySwitch: handleCurrencySwitch,
    doSwap: handleSwap,
  };
};
