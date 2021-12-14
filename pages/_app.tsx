import '../styles/globals.css'
import type {AppProps} from 'next/app'
import React from 'react'
import {ChakraProvider} from '@chakra-ui/react'
import theme from '../theme';
import '../theme/styles.css';
import Layout from '../components/Layout'

function MyApp({Component, pageProps}: AppProps) {
  return (
      <ChakraProvider theme={theme}>
          <Layout>
              <Component {...pageProps} />
          </Layout>
      </ChakraProvider>
  )
}

export default MyApp