import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';
import { SheetsRegistry, JssProvider, createGenerateId } from 'react-jss';

const catalogStylesheets = [
  '/catalog/roblox-layout.css',
  '/catalog/roblox-styleguide.css',
  '/catalog/roblox-page.css',
  '/catalog/catalog-page.css',
  '/catalog/robux-icons.css',
  '/catalog/roblox-footer.css',
  '/catalog/catalog-shell.css',
];

export default class JssDocument extends Document {
  static async getInitialProps(ctx) {
    const registry = new SheetsRegistry();
    const generateId = createGenerateId();
    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => (
          <JssProvider registry={registry} generateId={generateId}>
            <App {...props} />
          </JssProvider>
        ),
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&display=swap" rel="stylesheet" />
          <style id="server-side-styles">{registry.toString()}</style>
        </>
      ),
    };
  }

  render() {
    const isCatalogPage = this.props.__NEXT_DATA__?.page === '/catalog';

    return (
      <Html>
        <Head>
          {this.props.styles}
          {isCatalogPage && catalogStylesheets.map((href) => (
            <link rel="stylesheet" href={href} key={href} />
          ))}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
