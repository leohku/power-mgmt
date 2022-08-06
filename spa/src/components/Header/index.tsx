import styled from "styled-components";
import { HardDrive } from "react-feather";

const Header = () => {
  return (
    <Wrapper>
      <ContentWrapper>
        <Title>Dashboard</Title>
        <Selected>
          <HardDrive width={18} color={"hsl(var(--color-blue))"} />
          <SelectedText>Machines</SelectedText>
        </Selected>
      </ContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.header`
  width: 100%;
  height: 130px;
  background: hsl(var(--color-primary));
  border-bottom: 1px solid hsl(var(--color-gray-150));
  display: flex;
  justify-content: center;

  @media (max-width: 600px) {
    height: 108px;
  }
`

const ContentWrapper = styled.div`
  width: min(100%, 1100px);
  height: 100%;
  padding: 21px 24px 0px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Title = styled.h2`
  font-size: calc(22rem / 16);
  font-weight: var(--weight-medium-light);
  color: hsl(var(--color-primary-text));
  letter-spacing: -0.012em;

  @media (max-width: 600px) {
    font-size: calc(20rem / 16);
  }
`

const Selected = styled.div`
  margin-left: 3px;
  height: 50px;
  width: fit-content;
  border-bottom: 2px solid hsl(var(--color-blue));
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 6px;
  padding-bottom: 10px;
  user-select: none;
  cursor: pointer;
`

const SelectedText = styled.p`
  color: hsl(var(--color-blue));
  font-weight: var(--weight-medium);
`

export default Header;