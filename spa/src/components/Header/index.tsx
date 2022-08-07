import styled from "styled-components";
import { HardDrive } from "react-feather";

const Header = () => {
  return (
    <Wrapper>
      <ContentWrapper>
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
  height: 70px;
  background: hsl(var(--color-white));
  border-bottom: 1px solid hsl(var(--color-gray-150));
  display: flex;
  justify-content: center;

  @media (max-width: 600px) {
    height: 60px;
  }
`

const ContentWrapper = styled.div`
  width: min(100%, 1100px);
  height: 100%;
  padding: 21px 24px 0px 24px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
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