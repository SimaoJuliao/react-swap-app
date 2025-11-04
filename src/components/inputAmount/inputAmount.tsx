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

const StyledImage = styled.img`
  && {
    width: 1.5rem;
    height: 1.5rem;
    margin-top: 0.25rem;
  }
`;

const CoinName = styled.label`
  && {
    color: #280d5f;
    font-size: 1.25rem;
    font-weight: 600;
  }
`;

const SubLabel = styled.span`
  && {
    color: #7a6eaa;
    font-size: 0.8125rem;
    font-weight: 400;
    line-height: 1.5;
  }
`;

const InputWrapper = styled.div`
  && {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    min-width: 4.5rem;
    flex-grow: 1;
  }
`;

const StyledInput = styled.input`
  && {
    background-color: transparent;
    font-size: 1.5rem;
    font-weight: 600;
    border: none;
    text-align: right;
    width: 100%;
    max-width: 10ch;
    padding: 0rem;
    color: #000;
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
          <CoinName htmlFor={`amount-input-${coin.name}`}>{coin.name}</CoinName>
          <SubLabel>{coin.blockchainName}</SubLabel>
        </div>
      </div>

      <InputWrapper>
        {loading ? (
          <MoonLoader loading={loading} size={20} />
        ) : (
          <StyledInput
            id={`amount-input-${coin.name}`}
            inputMode="decimal"
            title="Token Amount"
            autoComplete="off"
            autoCorrect="off"
            type="text"
            pattern="[0-9]*[.,]?[0-9]*"
            placeholder="0.00"
            minLength={1}
            maxLength={79}
            spellCheck={false}
            value={coin.value || ""}
            onChange={(e) => handleOnChange(e.target.value)}
          />
        )}

        {!loading && (
          <SubLabel>
            ~ {coin.fiatValue || "0.00"} {coinFiat.name}
          </SubLabel>
        )}
      </InputWrapper>
    </StyledContainer>
  );
};
