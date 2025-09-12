import { useAccount, useBalance } from "wagmi";
import type { CoinType } from "../types";
import { formatUnits } from "viem";

interface BalanceProps {
  coinIN: CoinType;
  coinOUT: CoinType;
}
export const useGetBalance = (props: BalanceProps) => {
  const { coinIN, coinOUT } = props;
  const { address } = useAccount();

  const { data: balanceIN, refetch } = useBalance({
    address: address,
    token: coinIN.isNative ? undefined : coinIN.address,
  });

  const { data: balanceOUT } = useBalance({
    address: address,
    token: coinOUT.isNative ? undefined : coinOUT.address,
  });

  return {
    in: balanceIN ? formatUnits(balanceIN.value, balanceIN.decimals) : "",
    out: balanceOUT ? formatUnits(balanceOUT.value, balanceOUT.decimals) : "",
    refetch,
  };
};
