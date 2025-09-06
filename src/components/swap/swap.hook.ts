import { useCallback, useMemo, useState } from "react";
import { useAccount, useBalance, useWalletClient } from "wagmi";
import { formatUnits, parseEther } from "viem";

import {
  PANCAKE_ROUTER_ADDRESS,
  currencyOne,
  currencyTwo,
  currencyDollar,
} from "../../constants";
import routerAbi from "../../constants/pancakeRouterABI.json";
import { useGetEstimatedAmount } from "../../helpers";
import { debounce } from "lodash";

interface CurrenciesType {
  amountIN?: string | null;
  amountOUT?: string | null;
  amountDollars?: string | null;
}

export const useSwapHelper = () => {
  const { data: walletClient } = useWalletClient();
  const { address, isConnected } = useAccount();
  const fetchEstimatedAmount = useGetEstimatedAmount();

  const [currencys, setCurrencys] = useState<CurrenciesType>();
  const [slippage, setSlippage] = useState<number>(0.5);

  let currencyIN = {
    ...currencyOne,
    value: currencys?.amountIN,
  };

  let currencyOUT = {
    ...currencyTwo,
    value: currencys?.amountOUT,
  };

  const currencyUSD = {
    ...currencyDollar,
    value: currencys?.amountDollars,
  };

  const { data: balanceIN } = useBalance({
    address: address,
    token: currencyIN.address,
  });

  const handleOnChangeSlippage = (value: number) => {
    setSlippage(value);
  };

  const handleCurrencySwitch = () => {
    console.log("entrei aqui pha");

    const currentIN = currencyIN;
    const currentOUT = currencyOUT;

    currencyIN = currentOUT;
    currencyOUT = currentIN;
  };

  const debouncedHandleFetchEstimate = useCallback(
    debounce((amount: string, isToGetAmountsOut: boolean) => {
      fetchEstimatedAmount(
        amount,
        {
          in: currencyIN.address,
          out: currencyOUT.address,
        },
        isToGetAmountsOut
      ).then((amounts) => {
        const isLCR = currencyIN.address == currencyTwo.address;

        fetchEstimatedAmount(
          isLCR ? amounts.out : amounts.in,
          {
            in: isLCR ? currencyOUT.address : currencyIN.address,
            out: currencyDollar.address,
          },
          true,
          ({ out }) => {
            setCurrencys({
              amountDollars: out,
              amountIN: amounts.in,
              amountOUT: amounts.out,
            });
          }
        );
      });
    }, 500),
    []
  );

  const handleFetchEstimate = (amount: string, isToGetAmountsOut: boolean) => {
    setCurrencys((prev) => ({
      ...prev,
      amountIN: isToGetAmountsOut ? amount : prev?.amountIN,
      amountOUT: !isToGetAmountsOut ? amount : prev?.amountOUT,
    }));

    debouncedHandleFetchEstimate(amount, isToGetAmountsOut);
  };

  const doSwap = async () => {
    if (!walletClient || !address || !currencyOUT.value) return;

    try {
      const amountInWei = parseEther(currencyIN.value as `${number}`);
      const estimatedOutWei = parseEther(currencyOUT.value as `${number}`);

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
          [currencyIN.address, currencyOUT.address],
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
    if (!isConnected || !currencyIN.value || !currencyOUT.value || !balanceIN)
      return true;

    const formattedBalance = formatUnits(balanceIN.value, balanceIN.decimals);

    return parseFloat(formattedBalance) < parseFloat(currencyIN.value);
  }, [isConnected, currencyIN.value, currencyOUT.value, balanceIN]);

  return {
    currencyIN,
    currencyOUT,
    currencyUSD,
    slippage,
    isButtonSwapDisable,
    fetchEstimate: handleFetchEstimate,
    onChangeSlippage: handleOnChangeSlippage,
    currencySwitch: handleCurrencySwitch,
    doSwap,
  };
};
