import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`

  /* VARIABLES */
  :root {
    /* COLORS */
    --color-white: 0deg 0% 100%;
    --color-offwhite-lighter: 0deg 0% 96%;
    --color-offwhite: 0deg 0% 95%;
    --color-gray-100: 185deg 5% 95%;
    --color-gray-150: 186deg 5% 91%;
    --color-gray-200: 187deg 5% 87%;
    --color-gray-300: 190deg 5% 80%;
    --color-gray-400: 193deg 4% 70%;
    --color-gray-500: 196deg 4% 60%;
    --color-gray-600: 206deg 4.5% 50%;
    --color-gray-700: 220deg 5% 40%;
    --color-gray-800: 220deg 4% 30%;
    --color-gray-900: 220deg 3% 20%;
    --color-primary:  20deg 16% 96%;
    --color-primary-text: 20deg 16% 40%;
    --color-text: 220deg 40% 5%;
    --color-blue: 220deg 40% 40%;
    --color-yellow: 47deg 98% 54%;
    --color-green: 157deg 69% 38%;

    --color-shadow: var(--color-gray-200);
    --color-shadow-lighter: var(--color-gray-100);
    --color-shadow-darker: var(--color-gray-500);

    /* ELEVATIONS */
    --elevation-small:                0.5px 1px 1px hsl(var(--color-shadow) / 0.7),
                                      1px 2px 2px hsl(var(--color-shadow) / 0.333);

    /* WEIGHTS */
    --weight-light: 400;
    --weight-text: 450;
    --weight-normal: 500;
    --weight-medium-light: 550;
    --weight-medium: 600;
    --weight-bold: 800;

    /* BREAKPOINTS */
    --breakpoint-phone: 600;
    --breakpoint-tablet: 950;
    --breakpoint-laptop: 1300;

  }

  /* FONTS */
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/inter/v7/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2) format('woff2 supports variations'), url(https://fonts.gstatic.com/s/inter/v7/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2) format('woff2-variations');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }


  /* STYLESHEET RESET */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
    font-family: Inter,-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;
    letter-spacing: -0.012em;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }

  input, button, textarea, select {
    font: inherit;
  }

  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
  }

  #root, #__next {
    isolation: isolate;
  }
`