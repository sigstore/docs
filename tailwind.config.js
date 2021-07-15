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
    plugins: [require("@tailwindcss/typography")],
    theme: {
        colors: {
            black: {
                DEFAULT: "#000000",
                overlay: "rgba(0, 0, 0, 0.12)",
            },
            purple: {
                light: 'rgba(99, 73, 255, 1)',
                dark: 'rgba(42, 30, 113, 1)',
            },
            blue: {
                600: "#1B2831",
                800: "#061019",
            },
            pastel: {
                orange: 'rgba(255, 195, 152, 1)',
                light: 'rgba(255, 234, 215, 1)',
                neutral: 'rgba(246, 237, 237, 1)',
                blue: 'rgba(207, 230, 233, 1)',
                greenBright: 'rgba(192, 255, 198, 1)',
            },
            gray: {
                greyBkg: 'rgba(241, 233, 229, 1)',
            },
            green: {
                400: "#3E7858",
                600: "#31453A",
            },
            inherit: "inherit",
            red: {
                100: "#ECB3B1",
                500: "#691E1B",
                600: "#4A1716",
            },
            transparent: "transparent",
            white: "#FFFFFF",
            yellow: "#C79E2A",
        },
        fontSize: {
            ...pxToRem(
                baseFontSize,
                128,
                120,
                90,
                80,
                58,
                50,
                43,
                38,
                36,
                30,
                25,
                24,
                22,
                21,
                20,
                18,
                16,
                15,
                14,
                13,
                12
            ),
        },
        letterSpacing: {
            0: "0",
            ...pxToRem(baseFontSize, -2.5, -2, -1.5, -1, 2, 3, 5, 8, 10, 16),
        },
        lineHeight: {
            none: "none",
            ...pxToRem(
                baseFontSize,
                128,
                120,
                100,
                80,
                70,
                64,
                57,
                49,
                48,
                42,
                40,
                37,
                36,
                35,
                32,
                30,
                29,
                26,
                23,
                22,
                18,
                17,
                13
            ),
        },
        extend: {
            animation: {
              spin: "spin 10s linear infinite",
            },
            cursor: {
              none: "none",
            },
            height: {
              "9/10": "90%",
              "50vh": "50vh",
            },
            inset: {
              "vw-211-359": `calc((100vw - ${rem(baseFontSize, 48)}) * 211/359)`,
            },
            listStyleType: {
              latin: "upper-latin",
            },
            minWidth: {
              56: "3.5rem",
            },
            opacity: {
              56: "0.56",
            },
            padding: {
              "1/2": "50%",
              "5/4": "125%",
              "9/16": "calc(100% / 16 * 9)",
              "448/322": "calc(100% / 322 * 448)",
              "692/498": "calc(100% / 498 * 692)",
              "672/768": "calc(100% / 768 * 672)",
              "678/1440": "calc(100% / 1440 * 678)",
            },
            scale: {
              110: "1.1",
            },
            translate: {
                '1/7': '14.2857143%',
                '2/7': '28.5714286%',
                '3/7': '42.8571429%',
                '4/7': '57.1428571%',
                '5/7': '71.4285714%',
                '6/7': '85.7142857%',
                "container-x": "calc(100% / 1440 * 310)",
            },
            transitionDelay: {
              100: "100ms",
              200: "200ms",
              300: "300ms",
              400: "400ms",
              500: "500ms",
              600: "600ms",
              800: "800ms",
              900: "900ms",
              1100: "1100ms",
              1200: "1200ms",
              1300: "1300ms",
              1400: "1400ms",
              1500: "1500ms",
              1600: "1600ms",
              1700: "1700ms",
              1800: "1800ms",
              1900: "1900ms",
              2000: "2000ms",
              2500: "2500ms",
              3000: "3000ms",
              3500: "3500ms",
            },
            transitionDuration: {
              1000: "1000ms",
            },
            transitionProperty: {
              cursor: "width, height, margin, opacity",
            },
            width: {
              "full+48": `calc(100% + ${rem(baseFontSize, 48)})`,
            },
            zIndex: {
              "-1": -1,
              "1": "1",
              999: 999,
            },
        },
    }
};  