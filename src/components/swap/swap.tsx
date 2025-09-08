import { ConnectButton } from "@rainbow-me/rainbowkit";

import { InputAmount } from "../inputAmount";
import { useSwapHelper } from "./swap.hook";
import { Slippage } from "../slippage";

import { Arrow } from "../../assets";
import { Card } from "../card";
import { Button } from "../button";
import { InputLabel } from "../inputLabel";

export const Swap: React.FC = () => {
  const {
    coins,
    slippage,
    balance,
    insufficientBalance,
    isButtonSwapDisable,
    fetchEstimate,
    onChangeSlippage,
    currencySwitch,
    doSwap,
  } = useSwapHelper();

  return (
    <Card>
      <h2 style={{ fontSize: "1.75rem", textAlign: "center", color: "#000" }}>
        Swap
      </h2>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus="address"
        />
      </div>

      <Card.Body>
        <InputLabel label="From:" balance={balance.in} />

        {/* Input de BNB */}
        <InputAmount
          coin={coins.coinIN}
          fiatCoin={coins.coinFiat}
          onChange={(value) => fetchEstimate(value, true)}
        />

        <Arrow onClick={currencySwitch} />

        <InputLabel label="To:" balance={balance.out} />

        {/* Input de LCR */}
        <InputAmount
          coin={coins.coinOUT}
          fiatCoin={coins.coinFiat}
          onChange={(value) => fetchEstimate(value, false)}
        />
      </Card.Body>

      <Card.Body>
        {/* Slippage */}
        <Slippage value={slippage} onChange={onChangeSlippage} />

        <Button onClick={doSwap} isDisabled={isButtonSwapDisable}>
          {!coins.coinOUT.value
            ? "Enter an amount"
            : insufficientBalance
            ? "Insufficient Balance"
            : "Swap"}
        </Button>
      </Card.Body>
    </Card>
  );
};
