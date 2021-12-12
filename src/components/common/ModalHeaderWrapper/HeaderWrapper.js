import React from "react";
import { View, TouchableOpacity } from "react-native";

export default ComposedComponent => props => {
  const HeaderComponents = props.headerComponents;
  const { 
    onLeftTap, 
    onMiddleTap, 
    onRightTap, 
    containerViewStyle 
  } = props.headerProps;

  const headerContainerStyle = {
    ...styles.headerContainer,
    ...containerViewStyle
  }

  return (
    <View style={styles.container}>
      <View style={headerContainerStyle}>

        { HeaderComponents.LeftComponent ? 
          <View style={styles.leftComponentContainer}>
            <TouchableOpacity activeOpacity={1} onPress={onLeftTap}>
              <HeaderComponents.LeftComponent />
            </TouchableOpacity>
          </View>
          :
          null
         }

        <View style={styles.middleComponentContainer}>
          <TouchableOpacity activeOpacity={1} onPress={onMiddleTap}>
            <HeaderComponents.MiddleComponent />
          </TouchableOpacity>
        </View>

        { HeaderComponents.RightComponent ?
          <View style={styles.rightComponentContainer} >
            <TouchableOpacity activeOpacity={1} onPress={onRightTap}>
              <HeaderComponents.RightComponent />
            </TouchableOpacity>
          </View>
          :
          null
        }

      </View>

      <ComposedComponent {...props} />
    </View>
  )
};

const styles = {
  container: {
    alignItems: "center",
    backgroundColor: "transparent"
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    alignItems: "baseline"
  },
  leftComponentContainer: {
    flexDirection: "row",
    // justifyContent: "flex-start",
    // flex: 1
  },
  middleComponentContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  rightComponentContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flex: 1
  }
};
