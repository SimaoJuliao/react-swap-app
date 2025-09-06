import { ConnectButton } from "@rainbow-me/rainbowkit";

import { InputAmount } from "../inputAmount";
import { useSwapHelper } from "./swap.hook";
import { Slippage } from "../slippage";

import { Arrow } from "../../assets";
import { Card } from "../card";
import { Button } from "../button";

export const Swap: React.FC = () => {
  const {
    coins,
    slippage,
    isButtonSwapDisable,
    fetchEstimate,
    onChangeSlippage,
    currencySwitch,
    doSwap,
  } = useSwapHelper();

  return (
    <Card>
      <h2 style={{ fontSize: "1.75rem", textAlign: "center" }}>Swap</h2>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ConnectButton showBalance chainStatus="icon" accountStatus="address" />
      </div>

      <Card.Body>
        <p
          style={{
            color: "#7A6EAA",
            fontWeight: 600,
            lineHeight: 1.5,
            fontSize: "0.75rem",
            margin: "0rem",
          }}
        >
          From:
        </p>

        {/* Input de BNB */}
        <InputAmount
          coin={coins.coinIN}
          fiatCoin={coins.coinFiat}
          onChange={(value) => fetchEstimate(value, true)}
        />

        <Arrow onClick={currencySwitch} />

        <p
          style={{
            color: "#7A6EAA",
            fontWeight: 600,
            lineHeight: 1.5,
            fontSize: "0.75rem",
            margin: "0rem",
          }}
        >
          To:
        </p>

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
          Fazer Swap
        </Button>
      </Card.Body>
    </Card>
  );
};
