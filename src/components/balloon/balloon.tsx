import styled from "styled-components";

const StyledBalloon = styled.div`
  padding: 0.75rem;
  background-color: #e9eaeb;
  color: #000;
  max-width: 300px;
  border-radius: 1.5rem;
  font-size: 0.75rem;

  @media (max-width: 500px) {
    font-size: 0.5rem;
    max-width: 180px;
  }
`;

export const Balloon: React.FC<React.PropsWithChildren> = (props) => {
  const { children } = props;

  return <StyledBalloon>{children}</StyledBalloon>;
};
