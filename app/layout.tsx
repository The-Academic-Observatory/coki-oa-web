import Script from "next/script";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head />
      {/*<Script*/}
      {/*  data-domain="open.coki.ac"*/}
      {/*  data-api="https://open.coki.ac/site-api/event"*/}
      {/*  src="/script.js"*/}
      {/*  strategy="lazyOnload"*/}
      {/*/>*/}
      <body>{children}</body>
    </html>
  );
}
