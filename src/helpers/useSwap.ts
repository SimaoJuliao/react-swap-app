import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { parseUnits } from "viem";
import { PANCAKE_ROUTER_ADDRESS, erc20Abi } from "../constants";
import { routerAbi } from "../constants";
import type { AddressType, CoinType } from "../types";
import { useGetTokenDecimals } from "./useGetTokenDecimals";
import { useGetEstimatedAmount } from "./useGetEstimatedAmount";

export const useSwap = () => {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const getTokenDecimals = useGetTokenDecimals();
  const fetchEstimatedAmount = useGetEstimatedAmount();

  const checkAndApproveToken = async (
    tokenAddress: AddressType,
    spenderAddress: AddressType,
    amountInWei: bigint
  ) => {
    if (!walletClient || !publicClient || !address) return false;

    try {
      // Check the current allowance
      const currentAllowance = await publicClient.readContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address, spenderAddress],
      });

      // If you already have enough allowance, don't approve it
      if (currentAllowance >= amountInWei) {
        return true;
      }

      // Call approve with the required value (or a large value like MaxUint256)
      await walletClient.writeContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "approve",
        args: [spenderAddress, amountInWei],
        account: address,
      });

      return true;
    } catch (e) {
      console.error("Erro ao aprovar token:", e);
      return false;
    }
  };

  const handleSwapTokens = async (
    coinIN: CoinType,
    coinOUT: CoinType,
    slippage: number
  ) => {
    if (!walletClient || !address || !coinOUT.value || !publicClient) return;

    const isNativeIn = coinIN.isNative;

    try {
      // 1. Get decimals
      const [decimalsIn, decimalsOut] = await Promise.all([
        getTokenDecimals(coinIN.address),
        getTokenDecimals(coinOUT.address),
      ]);

      const amountInWei = parseUnits(coinIN.value as string, decimalsIn);

      const { out: estimatedOut } = await fetchEstimatedAmount(
        coinIN.value as string,
        {
          in: coinIN.address,
          out: coinOUT.address,
        },
        true
      );
      const estimatedOutWei = parseUnits(estimatedOut as string, decimalsOut);

      // Slippage calculation
      const SLIPPAGE_BASE = BigInt(10000);
      const slippagePercent = BigInt(Math.floor(slippage * 100)); // Ex: 1% becomes 100
      const amountOutMin =
        (estimatedOutWei * (SLIPPAGE_BASE - slippagePercent)) / SLIPPAGE_BASE;

      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 10);

      // Approve token if necessary
      if (!isNativeIn) {
        await checkAndApproveToken(
          coinIN.address,
          PANCAKE_ROUTER_ADDRESS,
          amountInWei
        );
      }

      // Simulate transaction
      const { request } = await publicClient.simulateContract({
        address: PANCAKE_ROUTER_ADDRESS,
        abi: routerAbi,
        functionName: isNativeIn
          ? "swapExactETHForTokens"
          : coinOUT.isNative
          ? "swapExactTokensForETH"
          : "swapExactTokensForTokens",
        args: isNativeIn
          ? [amountOutMin, [coinIN.address, coinOUT.address], address, deadline]
          : [
              amountInWei,
              amountOutMin,
              [coinIN.address, coinOUT.address],
              address,
              deadline,
            ],
        value: isNativeIn ? amountInWei : undefined,
        account: address,
      });

      // Send transaction
      const txHash = await walletClient.writeContract(request);

      console.log("Tx enviada:", txHash);
      alert("Swap iniciado! Tx Hash: " + txHash);
    } catch (e: any) {
      console.error("Erro no swap:", e);

      // Tratamento de erros comuns
      const msg = e?.message || "";
      if (
        msg.includes("INSUFFICIENT_OUTPUT_AMOUNT") ||
        msg.includes("PancakeRouter: INSUFFICIENT_OUTPUT_AMOUNT")
      ) {
        alert(
          "Slippage muito baixo ou liquidez insuficiente. Tente aumentar o slippage."
        );
      } else if (msg.includes("TRANSFER_FROM_FAILED")) {
        alert(
          "Falha na transferência do token. Confirme se você autorizou o token corretamente."
        );
      } else {
        alert("Swap falhou: " + msg);
      }
    }
  };

  return {
    swapTokens: handleSwapTokens,
  };
};
