import React, { Component } from "react";
import { ScrollView, View, Image } from "react-native";
import { chunk, flow, map } from "lodash/fp";
import AchievementShare from "./AchievementShare";
import Trophy from "./Trophy";

export default class Trophies extends Component {
  constructor(props) {
    super(props);

    this._onTrophyModalClose = this._onTrophyModalClose.bind(this);
    this._renderTrophieRow = this._renderTrophieRow.bind(this);
    this.trophies = [];
    this.state = initialState;
  }

  render() {
    const { container } = styles;
    const { showTrophyShareModal, focusedTrophy } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView
          style={{ flex: 1, width: "100%" }}
          contentContainerStyle={container}
        >
          {this._renderTrophies()}
        </ScrollView>
        <AchievementShare
          onClose={this._onTrophyModalClose}
          visible={showTrophyShareModal}
          {...focusedTrophy}
        />
      </View>
    );
  }

  _showTrophyShareModal() {
    this.setState({
      showTrophyShareModal: true,
    });
  }

  _renderTrophies() {
    const { data } = this.props;

    return this._processTrophies(data);
  }

  _processTrophies(trophies) {
    return flow(chunk(3), map(this._renderTrophieRow))(trophies);
  }

  _renderTrophieRow(trophies) {
    const { rowContainer, leftTrophy, middleTrophy, rightTrophy } = styles;
    const [trophy1, trophy2, trophy3] = trophies;

    const key =
      (trophy1 ? trophy1.imgUrl : "") +
      (trophy2 ? trophy2.imgUrl : "") +
      (trophy3 ? trophy3.imgUrl : "");
    var trophy1Img;
    var trophy2Img;
    var trophy3Img;
    if (trophy1) {
      trophy1Img = trophy1.active
        ? trophy1.imgUrl
        : trophy1.imgUrlGrey != undefined
        ? trophy1.imgUrlGrey
        : "";
    }
    if (trophy2) {
      trophy2Img = trophy2.active
        ? trophy2.imgUrl
        : trophy2.imgUrlGrey != undefined
        ? trophy2.imgUrlGrey
        : "";
    }
    if (trophy3 && trophy3.active != undefined) {
      console.log("trophy3");
      console.log(trophy3);
      trophy3Img =
        trophy3.active == false
          ? trophy3.imgUrlGrey != undefined
            ? trophy3.imgUrlGrey
            : ""
          : trophy3.imgUrl;
      console.log(trophy3Img);
    }

    return (
      <View key={key} style={rowContainer}>
        {trophy1 ? (
          <View style={leftTrophy}>
            <Trophy
              width={80}
              height={70}
              uri={trophy1Img}
              onPress={this._onTrophyStickerPress(trophy1)}
              active={trophy1.active}
            />
          </View>
        ) : (
          <View style={leftTrophy} />
        )}

        {trophy2 ? (
          <View style={middleTrophy}>
            <Trophy
              width={80}
              height={70}
              uri={trophy2Img}
              onPress={this._onTrophyStickerPress(trophy2)}
              active={trophy2.active}
            />
          </View>
        ) : (
          <View style={middleTrophy} />
        )}

        {trophy3 ? (
          <View style={rightTrophy}>
            <Trophy
              width={80}
              height={70}
              uri={trophy3Img}
              onPress={this._onTrophyStickerPress(trophy3)}
              active={trophy3.active}
            />
          </View>
        ) : (
          <View style={rightTrophy} />
        )}
      </View>
    );
  }

  _onTrophyStickerPress(trophy) {
    const { name, description, imgUrl, imgUrlGrey, active } = trophy;
    let displayImageURL = active
      ? imgUrl
      : imgUrlGrey != undefined
      ? imgUrlGrey
      : "";
    return () =>
      this.setState({
        showTrophyShareModal: true,
        focusedTrophy: {
          name,
          active,
          content: description,
          largeStickerComponent: (props) => (
            <Image
              source={{ uri: displayImageURL }}
              resizeMode={"contain"}
              style={props.stickerStyle}
            />
          ),
        },
      });
  }

  _onTrophyModalClose() {
    this.setState({
      showTrophyShareModal: false,
      focusedTrophy: initialState.focusedTrophy,
    });
  }
}

const initialState = {
  trophyRows: [],
  showTrophyShareModal: false,
  focusedTrophy: {
    title: null,
    content: null,
    largeStickerComponent: null,
  },
};

const styles = {
  container: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    flex: 1,
    marginTop: 40,
  },
  leftTrophy: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  middleTrophy: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  rightTrophy: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
};
