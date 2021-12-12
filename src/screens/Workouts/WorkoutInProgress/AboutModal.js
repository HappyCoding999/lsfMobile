import React from "react";
import { View, ScrollView, Text, Image, TouchableOpacity, Dimensions, FlatList } from "react-native";
import { modalOverlayWrapper } from "../../../components/common";
import { icon_close_rounded_border } from "../../../images";

import { color } from "../../../modules/styles/theme";
const { height, width } = Dimensions.get("window");

const AboutModal = props => {
  const { title, aboutText, onClose } = props;
  const { container, header, content, imgContainer } = styles;
  const { height, width } = Dimensions.get("window");
  const containerStyle = {
    ...container,
    borderRadius: 50,
    borderColor:"#000",
    width: (0.9 * width),
    height: (0.9 * height)
  };
  const imgContainerStyle = {
    ...imgContainer,
    top: 30,
    left: (0.73 * width)
  }

  return (
    <View style={{...containerStyle, borderWidth:1}}>
      <Text allowFontScaling={false} style={header}>{title.toUpperCase()}</Text>

      <View style={imgContainerStyle}>
        <TouchableOpacity activeOpacity={1} onPress={onClose}>
          <Image style={{width:35,height:35}} source={icon_close_rounded_border} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{...containerStyle, flex: 1, zIndex: 0,marginTop:10,backgroundColor: "transparent"}}>
        {/* <Text allowFontScaling={false} style={content}>{aboutText}</Text>
       */}
        <FlatList
          data={aboutText}
          keyExtractor={(item, index) => item.title}
          renderItem={({ item }) => 
          <View style={styles.textContainer}>
            <Text allowFontScaling={false} style={styles.item}>{item}</Text>
          </View>}
        />
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white"
  },
  imgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1
  },
  header: {
    fontFamily: "SF Pro Text",
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "center",
    color: "#000",
    marginTop: 100
  },
  content: {
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: color.black
  },
  textContainer: {
    marginTop: 20,
    flexGrow: 1,
    width: (0.75 * width)
  },
  item: {
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: color.black

  }
};

export default modalOverlayWrapper(AboutModal);