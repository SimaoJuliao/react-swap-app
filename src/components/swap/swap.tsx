import { ConnectButton } from "@rainbow-me/rainbowkit";

import { InputAmount } from "../inputAmount";
import { useSwapHelper } from "./swap.hook";
import { Slippage } from "../slippage";

import { Arrow } from "../../assets";
import { Card } from "../card";
import { Button } from "../button";
import { InputLabel } from "../inputLabel";
import { Balloon } from "../balloon";

export const Swap: React.FC = () => {
  const {
    coins,
    slippage,
    loading,
    balance,
    insufficientBalance,
    isButtonSwapDisable,
    onConnectWallet,
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

      <div
        style={{
          display: "flex",
          justifyContent: !coins.coinIN.isNative ? "space-between" : "flex-end",
          alignItems: "center",
          gap: 32,
        }}
      >
        {!coins.coinIN.isNative && (
          <Balloon>
            To convert LCR to BNB, first approve the spending cap, and then
            confirm the swap.
          </Balloon>
        )}
        <div onClick={onConnectWallet}>
          <ConnectButton
            showBalance={false}
            chainStatus="full"
            accountStatus="full"
          />
        </div>
      </div>

      <Card.Body>
        <InputLabel label="From:" balance={balance.in} />

        {/* Input de BNB */}
        <InputAmount
          coin={coins.coinIN}
          loading={loading.in}
          onChange={(value) => fetchEstimate(value, true)}
        />

        <Arrow
          isDisabled={loading.in || loading.out}
          onClick={currencySwitch}
        />

        <InputLabel label="To:" balance={balance.out} />

        {/* Input de LCR */}
        <InputAmount
          coin={coins.coinOUT}
          loading={loading.out}
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
