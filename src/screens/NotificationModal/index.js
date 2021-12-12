import React, { Component } from "react";
import { Text, View, Image, Dimensions, TouchableOpacity } from "react-native";
import { modalOverlayWrapper, LargeButton } from "../../components/common";
import { color,colorNew } from "../../modules/styles/theme";
import closeBtn from "./images/iconCircleclose.png";
import { cancel_round_cross} from "../../images";


const { width, height } = Dimensions.get("window");

const NotificationModalContent = props => {
  const { message, buttonText, onButtonPress, renderImage, onClose } = props;
  const { contentContainer, messageText, closeBtnContainer } = styles;

  return (
    <View style={contentContainer}>
      {renderImage()}
      <Text allowFontScaling={false} style={messageText}>{message}</Text>
      <LargeButton onPress={onButtonPress}>
        {buttonText}
      </LargeButton>
      <View style={closeBtnContainer}>
        <TouchableOpacity activeOpacity={1} onPress={onClose}>
          <Image style={{tintColor:colorNew.darkPink}} source={cancel_round_cross} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const WrappedContent = modalOverlayWrapper(NotificationModalContent);

class NotificationModal extends Component {

  shouldComponentUpdate(newParams, _) {
    const { message: previousMessage, visible: previousVisibility } = this.props;
    const { message: newMessage, visible: newVisibility } = newParams;

    return previousMessage !== newMessage || previousVisibility !== newVisibility;
  }

  render() {
    const { visible } = this.props;

    return <WrappedContent
      visible={visible}
      {...this.props}
    />;
  }
}

const styles = {
  contentContainer: {
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    width: (0.9 * width),
    height: (0.75 * height),
    borderRadius:40,
  },
  messageText: {
    width: 280,
    height: 66,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
    marginBottom: 20,
    marginTop:20
  },
  closeBtnContainer: {
    position: "absolute",
    top: 20,
    left: (0.8 * width),
    zIndex: 1
  }
};

export default NotificationModal;