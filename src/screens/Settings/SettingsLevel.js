import React, { Component } from "react";
import { View, Image, Dimensions, SectionList } from "react-native";
import { ListItem } from "react-native-elements";
import { color } from "../../modules/styles/theme";
import { User } from "../../DataStore";
import { SafeAreaView } from "react-navigation";

const { width, height } = Dimensions.get("window");

var fitnessLevels = [
  { name: "Beginner", description: "Just getting started and ready to rock!" },
  {
    name: "Intermediate",
    description: "Feeling strong and ready to take it up a notch!",
  },
  {
    name: "Advanced",
    description: "Crushing your daily sweat sesh and ready for more!",
  },
];

export default class Settings extends Component {
  state = {
    markedLevel: null,
  };

  render() {
    console.log("render Settings level");
    console.log(this.props.navigation);

    // alert("nav: " + JSON.stringify(this.props.navigation));

    return (
      // <SafeAreaView
      //   forceInset={{ top: "always", bottom: "always" }}
      //   style={{ flex: 1 }}
      // >
      <View
        style={{
          flex: 1,
          width: width,
          // height: height,
          backgroundColor: "#fff",
          // backgroundColor: "#ff0000",
          marginTop: 0,
        }}
      >
        {this.renderSectionList()}
      </View>
      // </SafeAreaView>
    );
  }

  onPressRow = (item) => {
    // User.saveLevel(item.name);
    this.props.screenProps.saveLevel(item.name);
    this.setState({
      markedLevel: item.name,
    });
  };

  renderSectionHeader = ({ section }) => <View></View>;

  renderItem = ({ item }) => {
    return (
      <View>
        <ListItem
          title={item.name}
          titleStyle={styles.titleStyle}
          subtitleStyle={styles.subtitleStyle}
          subtitle={item.description}
          chevronColor="black"
          chevron
          rightIcon={this._getRightIcon(item.name)}
          onPress={() => this.onPressRow(item)}
          containerStyle={{ borderBottomColor: color.lightGrey }}
        />
      </View>
    );
  };

  _getRightIcon(itemName) {
    const { markedLevel } = this.state;
    const { userLevel } = this.props.screenProps;

    if (markedLevel) {
      if (itemName === markedLevel) {
        return <Image source={require("./images/iconCheckmark.png")} />;
      }

      return <View />;
    }

    if (itemName === userLevel) {
      return <Image source={require("./images/iconCheckmark.png")} />;
    }

    return <View />;
  }

  keyExtractor(item) {
    return item.name;
  }

  renderSectionList() {
    return (
      <View style={{ height: "100%" }}>
        <SectionList
          sections={[{ title: "", data: fitnessLevels }]}
          renderSectionHeader={this.renderSectionHeader}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />
      </View>
    );
  }
}

const styles = {
  sectionTitle: {
    width: 88,
    height: 15,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0.5,
    color: color.black,
    marginLeft: 18,
  },
  rowText: {
    width: 63,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    color: color.black,
  },
  titleStyle: {
    width: "60%",
    height: 30,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    color: color.black,
    marginTop: 0,
  },
  subtitleStyle: {
    width: "100%",
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: color.black,
  },
};
