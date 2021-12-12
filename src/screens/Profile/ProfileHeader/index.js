import React from "react";
import ProfileHeader from "./ProfileHeader";
import { headerWrapper } from "../../../components/common";
import { color } from "../../../modules/styles/theme";
import Sprocket from "./Sprocket";
import LSF from "./LSF";

const WrappedProfileHeader = headerWrapper(ProfileHeader);

export default props => {
  const { onSprocketPress } = props;
  const headerProps = {
    containerViewStyle: {
      backgroundColor: color.navPink,
      height: 60
    },
    onLeftTap: () => console.log("sprocket!")
  };

  const headerComponents = {
    LeftComponent: () => <Sprocket onPress={onSprocketPress} />,
    MiddleComponent: LSF
  };

  return <WrappedProfileHeader
    headerProps={headerProps}  
    headerComponents={headerComponents}
    {...props}
  />;

};