import { useMemo, useState } from "react";
import { useAccount, useBalance, useWalletClient } from "wagmi";
import { formatUnits, parseEther } from "viem";

import {
  PANCAKE_ROUTER_ADDRESS,
  coinOne,
  coinTwo,
  coinFiat,
} from "../../constants";
import routerAbi from "../../constants/pancakeRouterABI.json";
import { useGetEstimatedAmount } from "../../helpers";
import { debounce } from "lodash";
import type { Coin } from "../../types";

interface CoinsType {
  coinIN: Coin;
  coinOUT: Coin;
  coinFiat: Coin;
}

export const useSwapHelper = () => {
  const { data: walletClient } = useWalletClient();
  const { address, isConnected } = useAccount();
  const fetchEstimatedAmount = useGetEstimatedAmount();

  const [coins, setCoins] = useState<CoinsType>({
    coinIN: { ...coinOne, value: null },
    coinOUT: { ...coinTwo, value: null },
    coinFiat: { ...coinFiat, value: null },
  });
  const [slippage, setSlippage] = useState<number>(0.5);

  const { data: balanceIN } = useBalance({
    address: address,
    token: coins.coinIN.address,
  });

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
    setCoins((prev) => {
      if (isToGetAmountsOut) {
        return { ...prev, coinIN: { ...prev.coinIN, value: amount } };
      }

      return { ...prev, coinOUT: { ...prev.coinOUT, value: amount } };
    });

    debouncedHandleFetchEstimate(amount, isToGetAmountsOut);
  };

  const doSwap = async () => {
    if (!walletClient || !address || !coins.coinOUT.value) return;

    try {
      const amountInWei = parseEther(coins.coinIN.value as `${number}`);
      const estimatedOutWei = parseEther(coins.coinOUT.value as `${number}`);

      const amountOutMin =
        estimatedOutWei -
        (estimatedOutWei * BigInt(Math.floor(slippage * 100))) / BigInt(10000);
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 10);

      const txHash = await walletClient.writeContract({
        address: PANCAKE_ROUTER_ADDRESS,
        abi: routerAbi,
        functionName: "swapExactETHForTokens",
        args: [
          amountOutMin,
          [coins.coinIN.address, coins.coinOUT.address],
          address as `0x${string}`,
          deadline,
        ],
        value: amountInWei,
        account: address as `0x${string}`,
      });

      console.log("Tx enviada:", txHash);
      alert("Swap iniciado! Tx Hash: " + txHash);
    } catch (e) {
      console.error("Erro no swap:", e);
      alert("Swap falhou. Ver consola.");
    }
  };

  const isButtonSwapDisable = useMemo(() => {
    if (
      !isConnected ||
      !coins.coinIN.value ||
      !coins.coinOUT.value ||
      !balanceIN
    )
      return true;

    const formattedBalance = formatUnits(balanceIN.value, balanceIN.decimals);

    return parseFloat(formattedBalance) < parseFloat(coins.coinIN.value);
  }, [isConnected, coins.coinIN.value, coins.coinOUT.value, balanceIN]);

  return {
    coins,
    slippage,
    isButtonSwapDisable,
    fetchEstimate: handleFetchEstimate,
    onChangeSlippage: handleOnChangeSlippage,
    currencySwitch: handleCurrencySwitch,
    doSwap,
  };
};
