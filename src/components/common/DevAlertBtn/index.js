import React, { Component } from "react";
import { TouchableOpacity, View, Text, Image, Dimensions } from "react-native";
import { LargeButton } from "../LargeButton"
import { modalOverlayWrapper } from "../ModalOverlayWrapper";
import { color } from "../../../modules/styles/theme";
import img from "./construction.png";

const { width, height } = Dimensions.get("window");

const AlertMessage = props => {

  const { onClose } = props;

  return (
    <View style={styles.container}>
      <Image source={img} resizeMode="contain" />
      <View style={styles.textContainer}>
        <Text allowFontScaling={false} style={styles.text}>This section of the App is under active development by our team.</Text>
        <LargeButton onPress={onClose} >
          Dismiss 
        </LargeButton>
      </View>
    </View>
  );
}


export const DevAlertModal = modalOverlayWrapper(AlertMessage);


export class DevAlertBtn extends Component {

  state = {
    showAlert: false
  };

  _onPress = () => this.setState({ showAlert: true });

  _onClose = () => this.setState({ showAlert: false });

  render() {

    return (
      <View>
        <TouchableOpacity activeOpacity={1} onPress={this._onPress}>
          {this.props.children}
        </TouchableOpacity>
        <DevAlertModal visible={this.state.showAlert} onClose={this._onClose}/>
      </View>
    );
  }

}

const styles = {
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 10,
    height: 0.8 * height,
    width: 0.9 * width
  },
  text: {
    fontFamily: "SF Pro Text",
    fontSize: 30,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.black
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5
  }
};