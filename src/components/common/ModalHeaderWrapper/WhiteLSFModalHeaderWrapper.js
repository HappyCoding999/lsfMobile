import React from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import {color, colorNew} from "../../../modules/styles/theme"
import LinearGradient from "react-native-linear-gradient";

const getCloseButtonImage = type => {
  const result = {
    "white": require("./images/iconXWhite.png"),
    "pink": require("./images/iconXPink.png"),
    "leftArrow": require("./images/iconBackArrow.png")
  }[type];

  if (result) { return result; }

  const errMsg = `Invalid close button type for PlainModalHeaderWrapper. Options are: pink and white`;

  throw new Error(errMsg);
}

export default ComposedComponent => props => {
  const { headerContainer, info, infoContainer } = styles;
  const { headerProps } = props
  const { 
    withInfo, 
    onInfoPress, 
    containerViewStyle, 
    onClose, 
    headerText,
    headerTextStyle,
    closeButtonType,
    height
  } = headerProps

  let RightElement, closeBtnContainer;

  const headerContainerStyle = {
    ...headerContainer,
    ...containerViewStyle
  };

  if (withInfo === true) {
    closeBtnContainer = styles.closeBtnContainer;

    RightElement = () => (
      <TouchableOpacity activeOpacity={1} onPress={onInfoPress}>
        <View style={infoContainer}>
          <Image style={info} source={require("./images/iconInfo.png")} />
        </View>
      </TouchableOpacity>
    );
  } else {
    const emptyStyle = {
      flex: 1
    };
    closeBtnContainer = {...styles.closeBtnContainer, flex: 1}

    RightElement = () => <View style={emptyStyle}></View>;
  }
  const colors = [colorNew.darkPink, colorNew.mediumPink];

  return (
    <View style={styles.container}>
      <View style={headerContainerStyle}>
      <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={colors}
          style={styles.linearGradient}>
        <View style={closeBtnContainer}>
          <TouchableOpacity style={{width: 44, height: 44}} onPress={onClose}>
            <Image style={styles.closeBtn} source={getCloseButtonImage(closeButtonType)} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerTextContainer}>
          <Image style={{ width: '100%',top:0}} resizeMode="contain" source={require('./images/logo_white_love_seat_fitness.png')} />
        </View>
        <RightElement />
        </LinearGradient>
      </View>

      <ComposedComponent {...props} />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "transparent",

  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    top:-20,
    height: 90,
  },
  closeBtnContainer: {
    flexDirection: "row",
    marginTop:20,
    justifyContent: "flex-start"
  },
  closeBtn: {
    marginLeft: 20,
    marginTop: 12,
  },
  linearGradient: {
    width: "100%",
    height: 110,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
  },
  headerTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width:"70%",
    marginTop:20,
    height:44,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12
  },
  info: {
    marginRight: 10
  },
};
