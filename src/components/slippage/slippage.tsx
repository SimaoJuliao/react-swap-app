import { useSlippageHelper } from "./slippage.hook";

export interface SlippageProps {
  value: number;
  onChange: (value: number) => void;
}

export const Slippage: React.FC<SlippageProps> = (props) => {
  const { value, onchangeSlippage } = useSlippageHelper(props);

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <a
        style={{
          fontSize: "14px",
          color: "#7A6EAA",
          textDecoration: "underline dotted",
        }}
      >
        Slippage Tolerance (%)
      </a>
      <div
        style={{
          backgroundColor: "#EFF4F5",
          padding: "0rem 0.5rem",
          borderRadius: "12px",
          borderBottom: "2px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <input
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={value}
          onChange={(e) => onchangeSlippage(e.target.value)}
          style={{
            backgroundColor: "transparent",
            color: "#02919D",
            fontSize: "14px",
            fontWeight: 600,
            border: "none",
            textAlign: "center",
            width: "auto",
          }}
        />
        <span
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "#02919D",
          }}
        >
          %
        </span>
      </div>
    </div>
  );
};
