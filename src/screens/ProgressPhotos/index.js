import React, { Component } from "react";
import ProgressPhotos from "./ProgressPhotos";
import { Image, TouchableOpacity, View } from "react-native";
import { Modal } from "react-native";
import { SafeAreaView } from "react-navigation";
import whiteLSFModalHeaderWrapper from "../../components/common/ModalHeaderWrapper/WhiteLSFModalHeaderWrapper";

import { color } from "../../modules/styles/theme";

export default class extends Component {
  render() {
    console.log("ProgressPhotos index.js")
    const { onClose, visible, animType,onImageSelection} = this.props;
    const passedHeaderProps = {
      onClose
    }
    return (
      <Modal onRequestClose={() => ""} visible={visible} animationType={animType || "slide"}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} forceInset={{ top: "always" }}>
          <ProgressPhotos {...this.props} headerProps={passedHeaderProps} onClose={onClose} onImageSelection={onImageSelection} />
        </SafeAreaView>
      </Modal>
    );
  }
}