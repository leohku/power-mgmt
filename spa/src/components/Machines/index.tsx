import styled from "styled-components";

const Machines = () => {
  return (
    <ContentWrapper>
      <Title>Machines</Title>
      <Spacer />
      <PVEContainer>
        <InfoContainer>
          <Top>
            <MobilePowerOnIcon/>
            <MachineName>dumbpve</MachineName>
          </Top>
          <Bottom>
            <MachineSubtext>VMs: lambda.tailnet</MachineSubtext>
          </Bottom>
        </InfoContainer>
        <PowerControlGroup>
          <PowerOnStatusGroup>
            <PowerOnIcon/>
            <PowerOnStatus>Powered on</PowerOnStatus>
          </PowerOnStatusGroup>
          <PowerButton>Request power on</PowerButton>
        </PowerControlGroup>
      </PVEContainer>
    </ContentWrapper>
  )
}

const ContentWrapper = styled.div`
  width: min(100%, 1100px);
  height: 100%;
  padding: 21px 16px 0px 16px;
  display: flex;
  flex-direction: column;
  padding-top: 36px;

  @media (max-width: 600px) {
    padding-top: 24px;
  }
`

const Title = styled.h1`
  font-weight: var(--weight-medium);
  letter-spacing: -0.012em;
  padding-left: 8px;

  @media (max-width: 600px) {
    font-size: calc(24rem / 16);
  }
`

const Spacer = styled.div`
  width: 100%;
  height: 22px;

  @media (max-width: 600px) {
    height: calc(20rem / 16);
  }
`

const PVEContainer = styled.div`
  width: 100%;
  height: 80px;
  border: 1px solid hsl(var(--color-gray-200));
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px 0 16px;
`

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`
const Top = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const MobilePowerOnIcon = styled.div`
  display: none;

  @media (max-width: 600px) {
    display: block;
    width: 9px;
    height: 9px;
    background: hsl(var(--color-green));
    border-radius: 50%;
    transform: translateY(1px);
  }
`

const MachineName = styled.p`
  font-weight: var(--weight-text);
  font-size: calc(18rem / 16);
`

const Bottom = styled.div``

const MachineSubtext = styled.span`
  font-weight: var(--weight-text);
  font-size: calc(14rem / 16);
  color: hsl(var(--color-gray-700));
`

const PowerControlGroup = styled.div`
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 600px) {
    width: fit-content;
    justify-content: flex-end;
  }
`

const PowerOnStatusGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 600px) {
    display: none;
  }
`
const PowerOnIcon = styled.div`
  width: 9px;
  height: 9px;
  background: hsl(var(--color-green));
  border-radius: 50%;
`

const PowerOnStatus = styled.span`
  color: hsl(var(--color-gray-600));
  font-size: calc(15rem / 16);
`

const PowerButton = styled.button`
  background: hsl(var(--color-white));
  border: 1px solid hsl(var(--color-gray-200));
  border-radius: 6px;
  padding: 4px 12px 4px 12px;
  box-shadow: var(--elevation-small);
  color: var(--color-text);
  font-weight: var(--weight-text);
  cursor: pointer;
  transition: transform 100ms ease;

  &:active {
    transform: scale(0.97);
  }
`

export default Machines;