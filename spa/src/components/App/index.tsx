import styled from 'styled-components';
import Header from '../Header';
import Machines from '../Machines';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Wrapper>
        <Header />
        <Machines />
      </Wrapper>
      <ReactQueryDevtools />
    </QueryClientProvider>
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
