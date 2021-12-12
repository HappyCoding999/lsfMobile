import React, { Component } from "react";
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, SectionList, FlatList, Dimensions } from "react-native";
import { Header, ListItem, List } from "react-native-elements"
import { color } from "../../../modules/styles/theme";
import { SafeAreaView } from "react-navigation"
import Spotify from "rn-spotify-sdk"

const { height } = Dimensions.get('window');

class Playlists extends Component {

  constructor(props) {
    super(props)
    this.onPressRow = this.onPressRow.bind(this)
  }

  // componentDidMount() {

  //   // const params = { Authorization: "playlist-read-private", limit: 50 }

  //   // Spotify.sendRequest('v1/users/uf0oo5yh4ryv4aquooecznp2c/playlists', 'GET', params, true).then((result) => {

  //   //   this.setState({
  //   //     dataSource: result.items
  //   //   })
  //   // }).catch(err => {
  //   //   console.log(err)
  //   // });
  // }

  onPressRow = (item) => (
    // this.props.navigation.navigate('PlaylistDetail')
    this.props.onRowPressed(item)
  )

  renderSectionHeader = ({ section }) => (
    <View style={{ backgroundColor: color.palePink, height: 40 }}>
      <Text allowFontScaling={false} style={styles.listHeaderTitle}>{section.title}</Text>
    </View>
  )

  renderItem = ({ item }) => {

    return (
      <View style={{
        flexDirection: "column",
        justifyContent: "center",
        borderTopColor: '#ffffff',
        borderLeftColor: '#ffffff',
        borderRightColor: '#ffffff',
        borderBottomColor: "#d8d8d8",
        borderWidth: .5
      }}>
        <TouchableOpacity
          onPress={() => this.onPressRow(item)}>
          <View style={styles.cellContainer}>
            <View style={styles.cellTextContainer}>
              <Image style={{ position: "absolute" }} source={require("./images/illustrationPineapple.png")} resizeMode={"contain"} />
              {item.images.length === 0 ?
                <Image style={{ width: 60, height: 60 }} source={require("./images/illustrationPineapple.png")} resizeMode={"contain"} />
                :
                <Image style={{ width: "100%", height: "100%" }} source={{ url: item.images[0].url }} />
              }
            </View>
            <View style={{ flexDirection: "column", width: "100%" }}>
              <Text allowFontScaling={false} style={styles.cellPrimaryText} numberOfLines={1} ellipsizeMode={"tail"}>{item.name}</Text>
              <Text allowFontScaling={false} style={styles.cellSecondaryText}>{item.tracks.total} songs</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }



  keyExtractor(item) {
    return item.name
  }

  render() {

    const { playlistData: data } = this.props;

    return (
      <View style={{ backgroundColor: "#fff" }}>
        <SafeAreaView style={styles.safeArea} forceInset={{ bottom: "never", top: "always" }} />
        <Header
          leftComponent={
            <TouchableOpacity style={styles.button} onPress={this.props.action}>
              <Image source={require("./images/iconXPink.png")} />
            </TouchableOpacity>
          }
          centerComponent={{ text: 'CHOOSE PLAYLIST', style: styles.headerTitle }}
          barStyle="light-content"
          backgroundColor={"#ffffff"}
          outerContainerStyles={{ borderBottomWidth: 0 }}
        />
        <Text allowFontScaling={false} style={styles.sweatJams}>Sweat Jams</Text>
        <View style={{ height: height * .70 }}>
          <SectionList
            sections={[
              { title: "LOVE SWEAT FITNESS PLAYLISTS", data }
            ]}
            renderSectionHeader={this.renderSectionHeader}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff"
  },
  headerTitle: {
    color: color.hotPink,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold"
  },
  sweatJams: {
    width: "100%",
    height: 120,
    fontFamily: "Northwell",
    fontSize: 72,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.hotPink,
    justifyContent: "center",
  },
  cellContainer: {
    flexDirection: "row",
    height: 90
  },
  cellTextContainer: {
    width: 60,
    height: 60,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 20,
    marginTop: 15
  },
  cellPrimaryText: {
    width: 260,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    color: color.black,
    marginTop: 30,
    marginLeft: 20,

  },
  cellSecondaryText: {
    width: "100%",
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: color.black,
    marginLeft: 20
  },
  listHeaderTitle: {
    width: "100%",
    height: 15,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0.5,
    color: color.black,
    marginTop: 15,
    marginLeft: 20
  }
})

export default Playlists;