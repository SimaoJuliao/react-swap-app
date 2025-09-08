import styled from "styled-components";
import type { CoinType } from "../../types";

export interface InputAmountProps {
  coin: CoinType;
  fiatCoin: CoinType;
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
  gap: 1rem;

  &:focus-within {
    box-shadow: 0 0 0 3px #a56bff;
  }
`;

const StyledInput = styled.input`
  && {
    background-color: transparent;
    font-size: 1.5rem;
    font-weight: 600;
    border: none;
    text-align: right;
    width: auto;
    max-width: 10ch;
    padding: 0rem;
  }
`;

const StyledImage = styled.img`
  && {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

export const InputAmount: React.FC<InputAmountProps> = (props) => {
  const { coin, fiatCoin, onChange } = props;

  const handleOnChange = (value: string) => {
    const regex = /^[0-9]*[.,]?[0-9]*$/;
    const normalized = value.replace(",", ".");

    if (normalized === "" || regex.test(normalized)) {
      onChange(normalized);
    }
  };

  return (
    <StyledContainer>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {coin.image && (
          <StyledImage
            src={coin.image}
            alt={coin.name}
            loading="lazy"
            decoding="async"
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
          pattern="/^[0-9]*[.,]?[0-9]*$"
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
