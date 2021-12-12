import React, { Component } from "react";
import { View, Image, Text, Dimensions, FlatList, TouchableOpacity, Linking } from "react-native";
import { color } from "../../../../modules/styles/theme"
import firebase from "react-native-firebase"
import { WebView } from "react-native-webview"


const { height, width } = Dimensions.get('window');

export default class YoutubeList extends Component {
  constructor(props) {
    console.log(props)

    super(props);

    this.state = {
      datasource: []
    };
  }

  componentDidMount() {

    const {categoryId} = this.props.navigation.state.params;

    var ref = firebase.database().ref("youtube");
    ref.orderByChild("categoryId").equalTo(categoryId).once('value').then((snapshot) => {
      console.log(snapshot.val())
      const fbObject = snapshot.val();
      const newArr = Object.values(fbObject)
      this.setState({
        datasource: newArr
      })
    })
    .catch(err => console.log(err.stack))

  }

  _navigateToYoutube = (item) => {

    var safari = item.videoUrl;
    var youtubeApp = item.videoUrl.replace("https://youtu.be/", "youtube://")
    
    Linking.canOpenURL(youtubeApp).then(supported => {
      if (supported){
        Linking.openURL(youtubeApp)
      }else {
        Linking.openURL(safari)
      }
    }).catch(err => console.log(err))
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.datasource}
          ItemSeparatorComponent={({ highlighted }) => (
            <View style={styles.separator} />
          )}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) =>
            <TouchableOpacity
              style={{justifyContent: "flex-start"}}
              onPress={() => this._navigateToYoutube(item)}>
              <View style={styles.rowContainer}>
                <Image style={{ width: 110, height: 78 }} source={{ uri: item.thumbnailImageUrl }} />
                <Text numberOfLines={3} style={styles.descriptionText}>{item.videoName}</Text>
              </View>
            </TouchableOpacity>
          }
        />
      </View>
    );
  }

}

const styles = {
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff"
  },
  rowContainer: {
    width: "90%",
    height: 120,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 20,
  },
  separator: {
    width: "90%",
    height: 1,
    backgroundColor: "#ddd",
    marginLeft: 20

  },
  descriptionText: {
    width: "60%",
    height: 60,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    color: color.black
  }

}


