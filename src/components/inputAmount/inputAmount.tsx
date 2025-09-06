import styled from "styled-components";
import type { Coin } from "../../types";

export interface InputAmountProps {
  coin: Coin;
  fiatCoin: Coin;
  onChange: (value: string) => void;
}

const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 1.5rem;
  background-color: #eeeaf4;
  padding: 0rem 1rem;
  height: 5rem;

  &:focus-within {
    box-shadow: 0 0 0 3px #a56bff;
  }
`;

const StyledInput = styled.input`
  background-color: transparent;
  font-size: 1.5rem;
  font-weight: 600;
  border: none;
  text-align: right;
  width: auto;
  max-width: 10ch;
`;

export const InputAmount: React.FC<InputAmountProps> = (props) => {
  const { coin, fiatCoin, onChange } = props;

  const handleOnChange = (value: string) => {
    const regex = /^[0-9]*[.,]?[0-9]*$/;

    if (value === "" || regex.test(value)) {
      onChange(value);
    }
  };

  return (
    <StyledContainer>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {coin.image && (
          <img
            src={coin.image}
            height="24"
            width="24"
            alt={coin.name}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
        )}

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            style={{
              color: "#280D5F",
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            {coin.name}
          </label>
          <label
            style={{
              color: "#7A6EAA",
              fontSize: "13px",
              lineHeight: 1.5,
              fontWeight: 400,
            }}
          >
            {coin.blockchainName}
          </label>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <StyledInput
          inputMode="decimal"
          title="Token Amount"
          autoComplete="off"
          autoCorrect="off"
          type="text"
          pattern="^[0-9]*[.,]?[0-9]*$"
          placeholder="0.00"
          minLength={1}
          maxLength={79}
          spellCheck={false}
          value={coin.value || ""}
          onChange={(e) => handleOnChange(e.target.value)}
        />

        <label
          style={{
            color: "#7A6EAA",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: 1.5,
          }}
        >
          ~ {fiatCoin.value || "0.00"} {fiatCoin.name}
        </label>
      </div>
    </StyledContainer>
  );
};
