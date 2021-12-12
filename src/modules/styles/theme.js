import { Dimensions, Platform, StyleSheet } from 'react-native';


const color = {
    palePink: "#fff7fb",
    lightPink: "#ffd7eb",
    mediumPink: "#fe96b9",
    hotPink: "#ff4690",
    navPink: "#ffecf6",
    lightAqua: "#96ffe3",
    mediumAqua: "#a6f2de",
    skyBlue: "#77b2ff",
    sunnyYellow: "#fff11a",
    lightGrey: "#dedee8",
    mediumGrey: "#a6a6ae",
    darkGrey: "#808185",
    black: "#333333",
    white: "#FFFFFF",
    bgPink: "#E53C7D",
    textColor: "#E65189",
    darkPink: "#F7D8E5",
    bgGrey: "#808185",
}
const colorNew = {
    fillPink: "#FBE3E6",
    fillTeal: "#DCECEB",
    boxGrey:"#C8C7CC",
    borderGrey:"#707070",
    textPink: "#E37095",
    mediumPink: "#f08fa3",
    lightPink: "#f2c9cf",
    bgGrey: "#ADACAC",
    teal: "#76ABB9",
    white: "#FFFFFF",
    cardBGPink: "#F7CCD3",
    darkPink: "#F595A8",
    selfLoveLogPink: "#E26D93",
    gradientsPinkStart: "#F595A8",
    gradientsPinkEnd: "#F7CDD3",
    buttonPinkStart: "#E37196",
    buttonPinkEnd: "#F7CCD3",
    cardioBG: "#F6CED3",
    cardioButtonBG: "#e36f94",
    
}

export default StyleSheet.create({
      largeScript: {
        fontFamily: "Northwell",
        fontSize: 72,
        textAlign: "center",
        color: color.hotPink,
        fontWeight: 'normal',
        lineHeight: 75
      },
      headerFont: {
        fontFamily: "SF Pro Text",
        fontSize: 38,
        textAlign: "center",
        color: color.black,
        fontWeight: 'bold',
        lineHeight: 75
      },
      outlinedFont: {
        fontFamily: "SF Pro Text",
        fontSize: 20,
        textAlign: "center",
        color: "#ffffff",
        letterSpacing: 2
      },
      bodyFont: {
        fontFamily: "SF Pro Text",
        fontSize: 16,
        color: color.black,
        fontWeight: 'normal',
        lineHeight: 22
      },
      subheaderFont: {
        fontFamily: "SF Pro Text",
        fontSize: 15,
        textAlign: "center",
        color: color.hotPink,
        fontWeight: 'bold',
        lineHeight: 24,
        letterSpacing: 2
      },
      cellRowFont: {
        fontFamily: "SF Pro Text",
        fontSize: 14,
        color: color.black,
        fontWeight: 'bold',
        lineHeight: 20,
        letterSpacing: .5
      },
      ctaFont: {
        fontFamily: "SF Pro Text",
        fontSize: 14,
        textAlign: "center",
        color: "#ffffff",
        fontWeight: 'bold',
        lineHeight: 10,
        letterSpacing: 1
      },
      textLinkFont: {
        fontFamily: "SF Pro Text",
        fontWeight: 'bold',
        fontSize: 14,
        color: color.mediumPink,
        textAlign: "center",
        lineHeight: 10,
        letterSpacing: 1
      },
      smallBodyFont: {
        fontFamily: "SF Pro Text",
        fontWeight: '100',
        fontSize: 14,
        color: color.black,
        lineHeight: 22,
        letterSpacing: 0
      },
      topTabsFont: {
        fontFamily: "SF Pro Text",
        fontWeight: '200',
        fontSize: 12,
        color: color.black,
        lineHeight: 15,
        letterSpacing: 0.5
      },
})


export {
    color,colorNew
}

