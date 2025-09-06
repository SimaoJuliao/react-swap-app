import styled from "styled-components";

type CardComponent = React.FC<React.PropsWithChildren> & {
  Body: React.FC<React.PropsWithChildren>;
};

const StyledCard = styled.div`
  max-width: 37.5rem;
  background-color: #efedef;
  border-radius: 1.25rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Card: CardComponent = (props) => {
  const { children } = props;

  return <StyledCard>{children}</StyledCard>;
};

const StyledCardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #fff;
  border-radius: 24px;
  border: 1px solid #e7e3eb;
`;

const CardBody: React.FC<React.PropsWithChildren> = (props) => {
  const { children } = props;

  return <StyledCardBody>{children}</StyledCardBody>;
};

Card.Body = CardBody;
