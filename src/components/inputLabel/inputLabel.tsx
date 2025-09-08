import styled from "styled-components";
import { Wallet } from "../../assets";

export interface InputLabelProps {
  label: string;
  balance: string;
}

const StyledText = styled.span`
  && {
    color: #7a6eaa;
    font-weight: 600;
    line-height: 1.5;
    font-size: 0.75rem;
  }
`;

export const InputLabel: React.FC<InputLabelProps> = (props) => {
  const { label, balance } = props;

  const floatBalance = parseFloat(balance);
  const formattedBalance = floatBalance < 0 ? "0" : floatBalance.toFixed(6);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <StyledText>{label}</StyledText>

      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        <Wallet />
        <StyledText>{formattedBalance}</StyledText>
      </div>
    </div>
  );
};
