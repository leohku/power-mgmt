import React from 'react';
import styled from 'styled-components';
import Header from '../Header';
import Machines from '../Machines';

function App() {
  return (
    <Wrapper>
      <Header />
      <Machines />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;


export default App;
