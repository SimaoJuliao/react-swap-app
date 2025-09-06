import styled from "styled-components";

interface ButtonProps {
  isDisabled?: boolean;
  onClick: () => void;
}

const StyledButton = styled.button`
  padding: 15px;
  background-color: #0e76fd;
  color: white;
  border: none;
  border-radius: 1rem;
  font-weight: bold;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  width: 100%;
  margin-top: 0.75rem;

  &:disabled {
    cursor: not-allowed;
    background-color: #e9eaeb;
    color: #bdc2c4;
  }
`;

export const Button: React.FC<React.PropsWithChildren<ButtonProps>> = (props) => {
  const { children, isDisabled, onClick } = props;

  return (
    <StyledButton
      onClick={onClick}
      disabled={isDisabled}
      style={{}}
      className="button"
    >
      {children}
    </StyledButton>
  );
};
