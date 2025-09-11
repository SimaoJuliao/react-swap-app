import styled from "styled-components";
import { useSlippageHelper } from "./slippage.hook";

export interface SlippageProps {
  value: number;
  onChange: (value: number) => void;
}

const SlippageWrapper = styled.div`
  && {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const TooltipLabel = styled.a`
  && {
    font-size: 0.875rem;
    color: #7a6eaa !important;
    text-decoration: underline dotted !important;
    cursor: help;
  }
`;

const InputContainer = styled.div`
  && {
    display: flex;
    align-items: center;
    background-color: #eff4f5;
    padding: 0 0.5rem;
    border-radius: 0.75rem;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  }
`;

const StyledInput = styled.input`
  && {
    background-color: transparent;
    color: #02919d;
    font-size: 0.875rem;
    font-weight: 600;
    border: none;
    text-align: center;
    width: 4ch;
    padding: 0;
    outline: none;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &[type="number"] {
      -moz-appearance: textfield;
    }
  }
`;

const PercentageSymbol = styled.span`
  && {
    font-size: 0.875rem;
    font-weight: 600;
    color: #02919d;
    margin-left: 0.2rem;
  }
`;

export const Slippage: React.FC<SlippageProps> = (props) => {
  const { value, onchangeSlippage } = useSlippageHelper(props);

  return (
    <SlippageWrapper>
      <TooltipLabel
        data-tooltip-id="slippage-tooltip"
        data-tooltip-content="Permissible price deviation (%) between quoted and execution price of swap. For cross-chain swaps, this applies separately to both source and destination chains."
        aria-label="Slippage Tolerance Help"
      >
        Slippage Tolerance (%)
      </TooltipLabel>

      <InputContainer>
        <StyledInput
          type="number"
          min="0"
          max="10"
          step="0.1"
          aria-label="Slippage tolerance in percent"
          value={value}
          onChange={(e) => onchangeSlippage(e.target.value)}
        />
        <PercentageSymbol>%</PercentageSymbol>
      </InputContainer>
    </SlippageWrapper>
  );
};
