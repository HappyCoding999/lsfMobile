import React from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { color } from "../../../modules/styles/theme";

const getCloseButtonImage = (type) => {
  const result = {
    white: require("./images/iconXWhite.png"),
    pink: require("./images/iconXPink.png"),
    leftArrow: require("./images/iconBackArrow.png"),
  }[type];

  if (result) {
    return result;
  }

  const errMsg = `Invalid close button type for PlainModalHeaderWrapper. Options are: pink and white`;

  throw new Error(errMsg);
};

export default (ComposedComponent) => (props) => {
  const { headerContainer, info, infoContainer } = styles;
  const { headerProps } = props;
  const {
    withInfo,
    infoImage,
    onInfoPress,
    containerViewStyle,
    onClose,
    headerText,
    headerTextStyle,
    closeButtonType,
    height,
  } = headerProps;

  // alert("headerProps: " + JSON.stringify(headerProps));
  // alert(withInfo + ": infoImage: " + infoImage);

  let RightElement, closeBtnContainer;

  const headerContainerStyle = {
    ...headerContainer,
    ...containerViewStyle,
  };

  if (withInfo === true) {
    closeBtnContainer = styles.closeBtnContainer;

    RightElement = () => (
      <TouchableOpacity activeOpacity={1} onPress={onInfoPress}>
        <View style={infoContainer}>
          <Image
            style={{ marginRight: infoImage == undefined ? 10 : 40 }}
            source={
              infoImage == undefined
                ? require("./images/iconInfo.png")
                : infoImage
            }
          />
        </View>
      </TouchableOpacity>
    );
  } else {
    const emptyStyle = {
      flex: 1,
    };
    closeBtnContainer = { ...styles.closeBtnContainer, flex: 1 };

    RightElement = () => <View style={emptyStyle}></View>;
  }

  return (
    <View style={styles.container}>
      <View style={headerContainerStyle}>
        <View style={closeBtnContainer}>
          <TouchableOpacity style={{ width: 44, height: 44 }} onPress={onClose}>
            <Image
              style={styles.closeBtn}
              source={getCloseButtonImage(closeButtonType)}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.headerTextContainer}>
          <Text allowFontScaling={false} style={headerTextStyle}>
            {(headerText || "").toUpperCase()}
          </Text>
        </View>
        <RightElement />
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
    backgroundColor: "white",
    height: 40,
  },
  closeBtnContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  closeBtn: {
    marginLeft: 10,
    marginTop: 12,
  },
  headerTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  info: {
    marginRight: 10,
  },
};
