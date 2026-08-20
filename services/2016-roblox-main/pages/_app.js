import '../styles/globals.css';
import '../styles/helpers/textHelpers.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// Roblox CSS
import '../styles/roblox/icons.css';
import Navbar from '../components/navbar';
import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import Footer from '../components/footer';
import dayjs from '../lib/dayjs';
import NextNProgress from "nextjs-progressbar";
import { useRouter } from 'next/router';
import LoginModalStore from '../stores/loginModal';
import AuthenticationStore from '../stores/authentication';
import NavigationStore from '../stores/navigation';
import { getTheme, themeType } from '../services/theme';
import MainWrapper from '../components/mainWrapper';
import GlobalAlert from '../components/globalAlert';
import ThumbnailStore from "../stores/thumbnailStore";
import getFlag from "../lib/getFlag";
import Chat from "../components/chat";

if (typeof window !== 'undefined') {
  console.log(String.raw`
      _______      _________      _____       ______     _
     / _____ \    |____ ____|    / ___ \     | ____ \   | |
    / /     \_\       | |       / /   \ \    | |   \ \  | |
    | |               | |      / /     \ \   | |   | |  | |
    \ \______         | |      | |     | |   | |___/ /  | |
     \______ \        | |      | |     | |   |  ____/   | |
            \ \       | |      | |     | |   | |        | |
     _      | |       | |      \ \     / /   | |        |_|
    \ \_____/ /       | |       \ \___/ /    | |         _
     \_______/        |_|        \_____/     |_|        |_|

     Keep your account safe! Do not paste any text here.

     If someone is asking you to paste text here then you're
     giving someone access to your account, your gear, and
     your ROBUX.

     To learn more about keeping your account safe you can go to

     https://en.help.roblox.com/hc/en-us/articles/203313380-Account-Security-Theft-Keeping-your-Account-Safe-`);
}

function RobloxApp({ Component, pageProps }) {
  const router = useRouter();
  const isCatalogPage = router.pathname === '/catalog';

  // The archived catalog is a standalone page. Keep the site-wide shell off it
  // so the original catalog layout can provide its own content and spacing.
  useEffect(() => {
    const body = document.body;
    if (!body) return undefined;

    if (isCatalogPage) {
      body.classList.add('catalog-route');
      body.style.background = '#e3e3e3';
    } else {
      body.classList.remove('catalog-route');
      const theme = getTheme();
      const divBackground = theme === themeType.obc2016
        ? 'url(/img/Unofficial/obc_theme_2016_bg.png) repeat-x #222224'
        : document.getElementById('theme-2016-enabled') ? '#e3e3e3' : '#fff';
      body.style.background = divBackground;
    }

    return () => {
      body.classList.remove('catalog-route');
    };
  }, [isCatalogPage, pageProps]);

  return <div>
    <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={''} />
      <title>{pageProps.title || 'ROBLOX'}</title>
      <link rel='icon' type="image/vnd.microsoft.icon" href='/favicon.ico' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
    </Head>
    <AuthenticationStore.Provider>
      {!isCatalogPage && <LoginModalStore.Provider>
        <NavigationStore.Provider>
          <Navbar/>
        </NavigationStore.Provider>
      </LoginModalStore.Provider>}
      {!isCatalogPage && <GlobalAlert />}
      <MainWrapper>
        {!isCatalogPage && getFlag('clientSideRenderingEnabled', false) ? <NextNProgress options={{showSpinner: false}} color='#fff' height={2} /> : null}
        <ThumbnailStore.Provider>
          <Component {...pageProps} />
          {!isCatalogPage && <Chat />}
        </ThumbnailStore.Provider>
      </MainWrapper>
      {!isCatalogPage && <Footer/>}
    </AuthenticationStore.Provider>
  </div>
}

export default RobloxApp;
