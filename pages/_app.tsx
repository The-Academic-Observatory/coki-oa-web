import '../styles/globals.css'
import type {AppProps} from 'next/app'
import React from 'react'
import {ChakraProvider} from '@chakra-ui/react'
import theme from '../theme';
import '../theme/styles.css';

function MyApp({Component, pageProps}: AppProps) {
  return (
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
  )
}

export default MyApp