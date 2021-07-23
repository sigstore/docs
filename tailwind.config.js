/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */

 const baseFontSize = 10;

/**
 * @typedef {{
 *  from: number
 *  to: number
 *  increment: number
 * }}
 * PxToRemObject
 */

/**
 * Convert a pixel value to rems.
 * @param {number} base Base font size in pixels.
 * @param {number} px Pixel size to convert.
 * @returns {string} Size in rems.
 */
const rem = (base, px) => `${px / base}rem`;

/**
 * Map pixel values to their equivilent rem values.
 * @param {number} base Base font size in pixels.
 * @param  {...number|PxToRemObject} items
 * @returns {object}
 */
const pxToRem = (base, ...items) => {
  const pxs = {};

  for (const item of items) {
    if (typeof item === "number") {
      pxs[item] = rem(base, item);
    } else {
      const { from, to, increment } = item;

      for (let px = from; px <= to; px += increment) {
        pxs[px] = rem(base, px);
      }
    }
  }

  return pxs;
};


module.exports = {
  // mode: 'jit',
  purge: {
    content: ["./pages/**/*.{js,vue}", "./components/**/*.{js,vue}", "./modules/**/*.{js,vue}"],
    options: {
      safelist: {
        standard: [/^delay-/],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  corePlugins: {
      // ...
      container: false,
  },
  theme: {
    spacing: {
      0: 0,
      ...pxToRem(
        baseFontSize,
        { from: 1, to: 25, increment: 1 },
        { from: 26, to: 100, increment: 2 },
        { from: 20, to: 200, increment: 5 },
        { from: 100, to: 200, increment: 8 },
        { from: 100, to: 250, increment: 10 },
        { from: 200, to: 500, increment: 25 },
        38,
        64,
        27,
        42,
        112,
        118,
        120,
        122,
        128,
        152,
        158,
        216,
        223,
        250,
        298,
        322,
        333,
        345,
      ),
    },
    fontSize: {
      ...pxToRem(
          baseFontSize,
          128,
          120,
          90,
          81,
          58,
          54,
          50,
          44,
          38,
          36,
          33,
          25,
          24,
          23,
          22,
          21,
          20,
          19,
          16,
          15,
          14,
          13,
          12,
          11
      ),
    },
    colors: {
      black: {
          DEFAULT: "#000000",
          overlay: "rgba(0, 0, 0, 0.12)",
      },
      blue: {
          medium: '#6349FF',
      },
      purple: {
          light: 'rgba(99, 73, 255, 1)',
          dark: '#2A1E71',
      },
      orange: {
          medium: '#FFC398',
          dark: '#793030',
      },
      pastel: {
          orange: '#FFEAD7',
          light: 'rgba(255, 234, 215, 1)',
          neutral: '#E9E9E9',
          blue: '#DDEFF1'
      },
      gray: {
          greyBkg: 'rgba(241, 233, 229, 1)',
          light: '#E9E9E9',
          medium: '#AFAFAF',
          dark: '#444444',
      },
      inherit: "inherit",
      transparent: "transparent",
      white: "#FFFFFF",
    },
    lineHeight: {
        none: "none",
        ...pxToRem(
            baseFontSize,
            98,
            64,
            60,
            53,
            49,
            48,
            43,
            42,
            40,
            32,
            30,
            29,
            26,
            23,
            22,
            18,
            16,
            17,
            15,
            13
        ),
    },
    minHeight: {
      screen: "100vh",
      ...pxToRem(baseFontSize, 700, 180, 146),
    },
    borderRadius: {
      'none': '0',
      'sm': '0.125rem',
      DEFAULT: '0.25rem',
      'md': '0.375rem',
      'lg': '0.5rem',
      'xl': '20px',
      'full': '9999px',
      'large': '12px',
    },
    extend: {
      width: {
        832: "832px",
      },
      maxWidth: {
        '0': '0',
        full: '100%',
        none: 'none',
  
        '15em': '15em',
        '14%': '14%',
        '122': '122px',
        '315': '315px',
        '334': '334px',
        '352': '352px',
        '440': '440px',
        '500': '500px',
        '690': '690px',
      },
    }
  }
  // theme: {
  //   spacing: {
  //     0: 0,
  //     ...pxToRem(
  //       baseFontSize,
  //       { from: 1, to: 25, increment: 1 },
  //       { from: 26, to: 100, increment: 2 },
  //       { from: 20, to: 200, increment: 5 },
  //       { from: 100, to: 200, increment: 8 },
  //       { from: 100, to: 250, increment: 10 },
  //       { from: 200, to: 500, increment: 25 },
  //       38,
  //       64,
  //       27,
  //       42,
  //       112,
  //       118,
  //       120,
  //       122,
  //       128,
  //       152,
  //       158,
  //       216,
  //       223,
  //       250,
  //       298,
  //       322,
  //       333,
  //       345,
  //       383,
  //       395,
  //       496,
  //       636,
  //       768,
  //       1024
  //     ),
  //   },
  //   colors: {
  //       black: {
  //           DEFAULT: "#000000",
  //           overlay: "rgba(0, 0, 0, 0.12)",
  //       },
  //       blue: {
  //           medium: '#6349FF',
  //       },
  //       purple: {
  //           light: 'rgba(99, 73, 255, 1)',
  //           dark: '#2A1E71',
  //       },
  //       orange: {
  //           medium: '#FFC398',
  //           dark: '#793030',
  //       },
  //       pastel: {
  //           orange: '#FFEAD7',
  //           light: 'rgba(255, 234, 215, 1)',
  //           neutral: '#E9E9E9',
  //           blue: '#DDEFF1'
  //       },
  //       gray: {
  //           greyBkg: 'rgba(241, 233, 229, 1)',
  //           light: '#E9E9E9',
  //           medium: '#AFAFAF',
  //           dark: '#444444',
  //       },
  //       inherit: "inherit",
  //       transparent: "transparent",
  //       white: "#FFFFFF",
  //   },
  //   fontSize: {
  //       ...pxToRem(
  //           baseFontSize,
  //           128,
  //           120,
  //           90,
  //           81,
  //           58,
  //           53,
  //           50,
  //           44,
  //           38,
  //           36,
  //           33,
  //           25,
  //           24,
  //           23,
  //           22,
  //           21,
  //           20,
  //           19,
  //           16,
  //           15,
  //           14,
  //           13,
  //           12,
  //           11
  //       ),
  //   },
  //   letterSpacing: {
  //       0: "0",
  //       ...pxToRem(baseFontSize, -2.5, -2, -1.5, -1, 2, 3, 5, 8, 10, 16),
  //   },
  //   lineHeight: {
  //       none: "none",
  //       ...pxToRem(
  //           baseFontSize,
  //           98,
  //           64,
  //           60,
  //           53,
  //           49,
  //           48,
  //           43,
  //           42,
  //           40,
  //           32,
  //           30,
  //           29,
  //           26,
  //           23,
  //           22,
  //           18,
  //           16,
  //           17,
  //           15,
  //           13
  //       ),
  //   },
  //   minHeight: {
  //       screen: "100vh",
  //       bannerInner: "40%",
  //       ...pxToRem(baseFontSize, 700),
  //   },
  //   extend: {
  //       animation: {
  //         spin: "spin 10s linear infinite",
  //       },
  //       cursor: {
  //         none: "none",
  //       },
  //       height: {
  //         "9/10": "90%",
  //         "50vh": "50vh",
  //       },
  //       inset: {
  //         "vw-211-359": `calc((100vw - ${rem(baseFontSize, 48)}) * 211/359)`,
  //       },
  //       listStyleType: {
  //         latin: "upper-latin",
  //       },
  //       minWidth: {
  //         56: "3.5rem",
  //       },
  //       opacity: {
  //         56: "0.56",
  //       },
  //       padding: {
  //         "1/2": "50%",
  //         "5/4": "125%",
  //         "9/16": "calc(100% / 16 * 9)",
  //         "448/322": "calc(100% / 322 * 448)",
  //         "692/498": "calc(100% / 498 * 692)",
  //         "672/768": "calc(100% / 768 * 672)",
  //         "678/1440": "calc(100% / 1440 * 678)",
  //       },
  //       scale: {
  //         110: "1.1",
  //       },
  //       translate: {
  //           '1/7': '14.2857143%',
  //           '2/7': '28.5714286%',
  //           '3/7': '42.8571429%',
  //           '4/7': '57.1428571%',
  //           '5/7': '71.4285714%',
  //           '6/7': '85.7142857%',
  //           "container-x": "calc(100% / 1440 * 310)",
  //       },
  //       transitionDelay: {
  //         100: "100ms",
  //         200: "200ms",
  //         300: "300ms",
  //         400: "400ms",
  //         500: "500ms",
  //         600: "600ms",
  //         800: "800ms",
  //         900: "900ms",
  //         1100: "1100ms",
  //         1200: "1200ms",
  //         1300: "1300ms",
  //         1400: "1400ms",
  //         1500: "1500ms",
  //         1600: "1600ms",
  //         1700: "1700ms",
  //         1800: "1800ms",
  //         1900: "1900ms",
  //         2000: "2000ms",
  //         2500: "2500ms",
  //         3000: "3000ms",
  //         3500: "3500ms",
  //       },
  //       transitionDuration: {
  //         1000: "1000ms",
  //       },
  //       transitionProperty: {
  //         cursor: "width, height, margin, opacity",
  //       },
  //       width: {
  //           '1244': "1244px",
  //         "full+48": `calc(100% + ${rem(baseFontSize, 48)})`,
  //       },
  //       maxWidth: {
  //           '0': '0',
  //           full: '100%',
  //           none: 'none',
      
  //           '15em': '15em',
  //           '14%': '14%',
  //           '315': '315px',
  //           '334': '334px',
      
  //       },
  //       zIndex: {
  //         "-1": -1,
  //         "1": "1",
  //         999: 999,
  //       },
  //   },
  // }
};  