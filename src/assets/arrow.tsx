import React, { useRef } from "react";

interface ArrowProps {
  isDisabled?: boolean;
  onClick?: () => void;
}

export const Arrow: React.FC<ArrowProps> = (props) => {
  const { isDisabled = false, onClick } = props;
  const arrowRef = useRef<SVGGElement>(null);

  const handleClick = () => {
    if (!arrowRef.current || isDisabled) return;

    onClick?.();

    arrowRef.current.animate(
      [
        { transform: "rotate(90deg)", transformOrigin: "center" },
        { transform: "rotate(-90deg)", transformOrigin: "center" },
        { transform: "rotate(90deg)", transformOrigin: "center" },
      ],
      {
        duration: 800,
        easing: "ease-in-out",
      }
    );
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        margin: "1rem 0rem",
      }}
    >
      {/* Linha horizontal (por trás do SVG) */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: "100%",
          height: "0.09rem",
          backgroundColor: "#E7E3EB",
          transform: "translateY(-50%)",
          zIndex: 0,
        }}
      />

      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        style={{ cursor: "pointer", zIndex: 1, backgroundColor: "white" }}
        onClick={handleClick}
      >
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="white"
          stroke="#ddd"
          strokeWidth="2"
        />

        {/* Arrow group */}
        <g ref={arrowRef} transform="rotate(90, 20, 20)">
          {/* Horizontal line (shaft) */}
          <line
            x1="12"
            y1="20"
            x2="24"
            y2="20"
            stroke="#00cbe7"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Arrowhead */}
          <line
            x1="20"
            y1="16"
            x2="24"
            y2="20"
            stroke="#00cbe7"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="20"
            y1="24"
            x2="24"
            y2="20"
            stroke="#00cbe7"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
};
