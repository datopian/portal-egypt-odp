import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Egypt Open Data Portal branding — official coat of arms (Eagle of Saladin). */}
        <link rel="icon" type="image/svg+xml" href="/egypt-coat-of-arms.svg" />
        <meta name="description" content="The national gateway to open government data for the Arab Republic of Egypt." />
        <meta name="theme-color" content="#9e1b32" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
