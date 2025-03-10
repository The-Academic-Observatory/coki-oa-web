import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
          <link rel="preload" href={`https://use.typekit.net/${process.env.NEXT_PUBLIC_TYPEKIT_ID}.css`} as="style" />
          <link rel="stylesheet" href={`https://use.typekit.net/${process.env.NEXT_PUBLIC_TYPEKIT_ID}.css`} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
