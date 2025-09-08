import { useMemo, useState } from "react";
import { useAccount } from "wagmi";

import { coinOne, coinTwo, coinFiat } from "../../constants";
import { useGetBalance, useGetEstimatedAmount, useSwap } from "../../helpers";
import { debounce } from "lodash";
import type { CoinType } from "../../types";

interface CoinsType {
  coinIN: CoinType;
  coinOUT: CoinType;
  coinFiat: CoinType;
}

export const useSwapHelper = () => {
  const { isConnected } = useAccount();
  const fetchEstimatedAmount = useGetEstimatedAmount();
  const { swapTokens } = useSwap();

  const [coins, setCoins] = useState<CoinsType>({
    coinIN: { ...coinOne, value: null },
    coinOUT: { ...coinTwo, value: null },
    coinFiat: { ...coinFiat, value: null },
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
    (amount: string, isToGetAmountsOut: boolean) => {
      fetchEstimatedAmount(
        amount,
        {
          in: coins.coinIN.address,
          out: coins.coinOUT.address,
        },
        isToGetAmountsOut
      ).then((amounts) => {
        const isLCR = coins.coinIN.address == coinTwo.address;

        fetchEstimatedAmount(
          isLCR ? amounts.out : amounts.in,
          {
            in: isLCR ? coins.coinOUT.address : coins.coinIN.address,
            out: coins.coinFiat.address,
          },
          true,
          ({ out }) => {
            setCoins((prev) => ({
              coinIN: { ...prev.coinIN, value: amounts.in },
              coinOUT: { ...prev.coinOUT, value: amounts.out },
              coinFiat: { ...prev.coinFiat, value: out },
            }));
          }
        );
      });
    }
  );

  const handleFetchEstimate = (amount: string, isToGetAmountsOut: boolean) => {
    const isValidAmount = parseFloat(amount) > 0;

    setCoins((prev) => {
      const updated = { ...prev };

      if (isToGetAmountsOut) {
        updated.coinIN.value = amount;
        updated.coinOUT.value = isValidAmount ? prev.coinOUT.value : "0";
      } else {
        updated.coinOUT.value = amount;
        updated.coinIN.value = isValidAmount ? prev.coinIN.value : "0";
      }

      return updated;
    });

    if (isValidAmount) {
      debouncedHandleFetchEstimate(amount, isToGetAmountsOut);
    }
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
