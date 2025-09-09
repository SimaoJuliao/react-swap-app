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

export const useSwapHelper = () => {
  const { isConnected } = useAccount();
  const fetchEstimatedAmount = useGetEstimatedAmount();
  const { swapTokens } = useSwap();
  const requestIdRef = useRef(0);

  const [coins, setCoins] = useState<CoinsType>({
    coinIN: { ...coinOne, value: null },
    coinOUT: { ...coinTwo, value: null },
  });
  const [slippage, setSlippage] = useState<number>(0.1);

  const balance = useGetBalance({
    coinIN: coins.coinIN,
    coinOUT: coins.coinOUT,
  });

  const insufficientBalance = useMemo(() => {
    if (!balance.in || !coins.coinIN.value) return true;

    return parseFloat(balance.in) < parseFloat(coins.coinIN.value);
  }, [coins.coinIN.value, balance]);

  const handleOnChangeSlippage = (value: number) => {
    setSlippage(value);
  };

  const handleCurrencySwitch = () => {
    setCoins((prev) => ({
      ...prev,
      coinIN: prev.coinOUT,
      coinOUT: prev.coinIN,
    }));
  };

  const debouncedHandleFetchEstimate = debounce(
    async (amount: string, isToGetAmountsOut: boolean, requestId: number) => {
      const isValidAmount = parseFloat(amount) > 0;

      if (!isValidAmount) {
        setCoins((prev) => ({
          ...prev,
          coinIN: { ...prev.coinIN, value: "", fiatValue: "" },
          coinOUT: { ...prev.coinOUT, value: "", fiatValue: "" },
        }));

        return;
      }

      // Cancel if not the most recent order
      if (requestId !== requestIdRef.current) {
        return;
      }

      const { in: amountIN, out: amountOUT } = await fetchEstimatedAmount(
        amount,
        {
          in: coins.coinIN.address,
          out: coins.coinOUT.address,
        },
        isToGetAmountsOut
      );

      const { out: amountINFiat } = await fetchEstimatedAmount(
        amountIN,
        {
          in: coins.coinIN.address,
          out: coinFiat.address,
        },
        true
      );

      const { out: amountOUTFiat } = await fetchEstimatedAmount(
        amountOUT,
        {
          in: coins.coinOUT.address,
          out: coinFiat.address,
        },
        true
      );

      setCoins((prev) => {
        const updated = { ...prev };

        if (isToGetAmountsOut) {
          updated.coinIN.fiatValue = amountINFiat;
          updated.coinOUT.value = amountOUT;
          updated.coinOUT.fiatValue = amountOUTFiat;
        } else {
          updated.coinIN.value = amountIN;
          updated.coinIN.fiatValue = amountINFiat;
          updated.coinOUT.fiatValue = amountOUTFiat;
        }

        return updated;
      });
    },
    300
  );

  const handleFetchEstimate = (amount: string, isToGetAmountsOut: boolean) => {
    // generate a new request ID
    const newRequestId = Date.now();
    requestIdRef.current = newRequestId;

    setCoins((prev) => {
      const updated = { ...prev };

      if (isToGetAmountsOut) {
        updated.coinIN.value = amount;
      } else {
        updated.coinOUT.value = amount;
      }

      return updated;
    });

    debouncedHandleFetchEstimate(amount, isToGetAmountsOut, newRequestId);
  };

  const handleSwap = () => {
    swapTokens(coins.coinIN, coins.coinOUT, slippage);
  };

  return {
    coins,
    slippage,
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
