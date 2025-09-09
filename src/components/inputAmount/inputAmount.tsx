import styled from "styled-components";
import type { CoinType } from "../../types";
import { coinFiat } from "../../constants";
import { MoonLoader } from "react-spinners";

export interface InputAmountProps {
  coin: CoinType;
  loading: boolean;
  onChange: (value: string) => void;
}

const StyledContainer = styled.div`
  && {
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
  const { coin, loading, onChange } = props;

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
        {loading ? (
          <MoonLoader loading={loading} size={20} />
        ) : (
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
        )}

        {!loading && (
          <label
            style={{
              color: "#7A6EAA",
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: 1.5,
            }}
          >
            ~ {coin.fiatValue || "0.00"} {coinFiat.name}
          </label>
        )}
      </div>
    </StyledContainer>
  );
};
