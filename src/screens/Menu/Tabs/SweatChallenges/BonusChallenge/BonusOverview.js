import React, { Component } from "react";
import { View, Image, Text, Dimensions } from "react-native";
import { color, colorNew } from "../../../../../modules/styles/theme";
import { LargeButton } from "../../../../../components/common";
import LinearGradient from "react-native-linear-gradient";

const { width, height } = Dimensions.get("window");

export default class extends Component {
  render() {
    const {
      title,
      exercisename,
      description,
      imageUrl,
      onButtonPress,
    } = this.props;

    // alert(title + " // " + imageUrl + " // " + description + " // ");

    return (
      <View style={styles.container}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={["rgba(245, 151, 169, 1)", color.lightPink]}
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        <View
          style={{
            flex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "transparent",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={styles.rowContainer}>
            <Text
              style={{
                fontFamily: "SF Pro Text",
                fontSize: 22,
                fontWeight: "bold",
                fontStyle: "normal",
                letterSpacing: 0,
                color: color.white,
                textAlign: "center",
              }}
            >
              {"Bonus Challenge"}
            </Text>
            <Text
              adjustsFontSizeToFit={true}
              // numberOfLines={1}
              allowFontScaling={false}
              style={[
                styles.subTitle,
                {
                  fontSize:
                    title.toUpperCase() === "ABS & BOOTY SCULPTER" ? 65 : 75,
                },
              ]}
            >
              {title.toUpperCase()}
            </Text>
          </View>
          {/* <Image source={{ uri: imageUrl }} /> */}
          <Text style={styles.secondTitle}>{description}</Text>
          <View style={{ flexDirection: "column", flex: 1 }}>
            <View>
              <LargeButton
                onPress={onButtonPress}
                buttonViewStyle={{ backgroundColor: color.white }}
              >
                <Text style={{ color: colorNew.mediumPink, fontWeight: "300" }}>
                  Let's Get Sweaty
                </Text>
              </LargeButton>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    flex: 1,
  },
  mainTitle: {
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
    marginTop: 20,
  },
  secondTitle: {
    width: "75%",
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: color.white,
    textAlign: "center",
    flex: 1,
    marginTop: 20,
  },
  subTitle: {
    // fontFamily: "Northwell",
    fontFamily: "SF Pro Text",
    fontSize: 75,
    fontStyle: "normal",
    lineHeight: 70,
    letterSpacing: 0,
    textAlign: "center",
    color: color.white,
    // height: 150,
    width: "100%",
    padding: 4,
    fontWeight: "bold",
    marginTop: 60,
  },
  rowContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: width,
  },
};
