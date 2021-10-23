import { ChakraProvider, Flex } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import Nav from '../components/Nav';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider>
      <ChakraProvider>
        <Flex flexDir="column">
          <Nav />
          <Component {...pageProps} />
        </Flex>
      </ChakraProvider>
    </SessionProvider>
  );
}

export default MyApp;
