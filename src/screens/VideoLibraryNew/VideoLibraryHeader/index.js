import React from "react";
import VideoLibraryHeader from "./VideoLibraryHeader";
import { headerWrapper } from "../../../components/common";
import { color, colorNew } from "../../../modules/styles/theme";
import Sprocket from "./Sprocket";
import LSF from "./LSF";

const WrappedVideoLibraryHeader = headerWrapper(VideoLibraryHeader);

export default (props) => {
  const { onSprocketPress } = props;
  const headerProps = {
    containerViewStyle: {
      backgroundColor: "transparent",
      height: 60,
    },
    onLeftTap: () => console.log("sprocket!"),
  };

  const headerComponents = {
    LeftComponent: () => <Sprocket onPress={onSprocketPress} />,
    MiddleComponent: LSF,
    RightComponent: () => <Sprocket onPress={onSprocketPress} />,
  };

  return (
    <WrappedVideoLibraryHeader
      headerProps={headerProps}
      headerComponents={headerComponents}
      {...props}
    />
  );
};
