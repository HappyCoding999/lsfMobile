import React from "react";
import { Modal } from "react-native";
import { SafeAreaView } from "react-navigation";
import LinearGradient from "react-native-linear-gradient";
import { plainModalHeaderWrapper } from "../../../../../components/common";
import AchievementShare from "./AchievementShare";
import { color, colorNew } from "../../../../../modules/styles/theme";

const WrappedAchivementShare = plainModalHeaderWrapper(AchievementShare);

export default props => {
  const { visible, onClose } = props;
  const colors = [ "#FFCBE5" , "#F74D91"];
  const headerProps = {
    onClose,
    containerViewStyle: {
      backgroundColor: "transparent"
    },
    closeButtonType: "white"
  };

  return (
    <Modal onRequestClose={() => ""} visible={visible} animationType="slide" transparent={true}>
      <SafeAreaView
        style={{flex: 1, backgroundColor: '#00000050'}}
        forceInset={{top: "always", bottom: "never"}}>
          <WrappedAchivementShare headerProps={headerProps} {...props} />
      </SafeAreaView>
    </Modal>
  );
};