import styled from "styled-components";

type CardComponent = React.FC<React.PropsWithChildren> & {
  Body: React.FC<React.PropsWithChildren>;
};

const StyledCard = styled.div`
  width: 100%;
  maxwidth: 37.5rem;
  backgroundcolor: #efedef;
  borderradius: 1.25rem;
  boxshadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  padding: 1.56rem;
  display: flex;
  flexdirection: column;
  gap: 1.25rem;
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

