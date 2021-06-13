import React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import "../resources/styles/global.css";
import { ChakraProvider } from "@chakra-ui/react"
import dark from "../resources/themes/dark"
import { RecoilRoot } from 'recoil';
import * as packageJson from "../../package.json"

function App(props: AppProps) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const noOverlayWorkaroundScript = `
    window.addEventListener('error', event => {
      event.stopImmediatePropagation()
    })

    window.addEventListener('unhandledrejection', event => {
      event.stopImmediatePropagation()
    })
  `

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <title>{packageJson.name}</title>
        {/* <script dangerouslySetInnerHTML={{ __html: noOverlayWorkaroundScript }} /> */}
      </Head>
      <ChakraProvider theme={dark}>
        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
      </ChakraProvider>
    </React.Fragment>
  );
}

export default App;