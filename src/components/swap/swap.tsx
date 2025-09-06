import { ConnectButton } from "@rainbow-me/rainbowkit";

import { InputAmount } from "../inputAmount";
import { useSwapHelper } from "./swap.hook";
import { Slippage } from "../slippage";

import { Arrow } from "../../assets";

export const Swap: React.FC = () => {
  const {
    currencyIN,
    currencyOUT,
    currencyUSD,
    slippage,
    isButtonSwapDisable,
    fetchEstimate,
    onChangeSlippage,
    currencySwitch,
    doSwap,
  } = useSwapHelper();

  return (
    <div className="card">
      <div className="card-header">Swap</div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ConnectButton showBalance chainStatus="icon" accountStatus="address" />
      </div>

      <div className="card-body">
        <p
          style={{
            color: "#7A6EAA",
            fontWeight: 600,
            lineHeight: 1.5,
            fontSize: "12px",
            margin: "0px",
          }}
        >
          From:
        </p>

        {/* Input de BNB */}
        <InputAmount
          currency={{
            name: "BNB",
            blockchainName: "BNB Chain",
            amount: currencyIN.value,
            dollars: `${currencyUSD.value || "0.00"} ${currencyUSD.name}`,
          }}
          onChange={(value) => fetchEstimate(value, true)}
        />

        <Arrow onClick={currencySwitch} />

        <p
          style={{
            color: "#7A6EAA",
            fontWeight: 600,
            lineHeight: 1.5,
            fontSize: "12px",
            margin: "0px",
          }}
        >
          To:
        </p>

        {/* Input de LCR */}
        <InputAmount
          currency={{
            name: "LCR",
            blockchainName: "BNB Chain",
            amount: currencyOUT.value,
            dollars: `${currencyUSD.value || "0.00"} ${currencyUSD.name}`,
          }}
          onChange={(value) => fetchEstimate(value, false)}
        />
      </div>

      <div className="card-body">
        {/* Slippage */}
        <Slippage value={slippage} onChange={onChangeSlippage} />

        <button
          onClick={doSwap}
          disabled={isButtonSwapDisable}
          className="button"
        >
          Fazer Swap
        </button>
      </div>
    </div>
  );
};
