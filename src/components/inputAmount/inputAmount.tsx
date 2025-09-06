export interface InputAmountProps {
  currency: {
    image?: string;
    amount?: string | null;
    dollars?: string | null;
    name: string;
    blockchainName: string;
  };
  onChange: (value: string) => void;
}

export const InputAmount: React.FC<InputAmountProps> = (props) => {
  const { currency, onChange } = props;

  const handleOnChange =(value: string) => {
    const regex = /^[0-9]*[.,]?[0-9]*$/;

    if (value === "" || regex.test(value)) {
      onChange(value);
    }
  }

  return (
    <div className="input-container">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label
          style={{
            color: "#280D5F",
            fontSize: "20px",
            fontWeight: 600,
          }}
        >
          {currency.name}
        </label>
        <label
          style={{
            color: "#7A6EAA",
            fontSize: "13px",
            lineHeight: 1.5,
            fontWeight: 400,
          }}
        >
          {currency.blockchainName}
        </label>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <input
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
          value={currency.amount || ""}
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
          ~ {currency.dollars || "0.00"}
        </label>
      </div>
    </div>
  );
};
