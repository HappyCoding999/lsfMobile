import React, { Component } from "react";
import { View, Image, Text, Dimensions, FlatList, TouchableOpacity} from "react-native";
import firebase from "react-native-firebase"
import {ListItem} from "react-native-elements"
import { color } from "../../../../modules/styles/theme";

const { height, width } = Dimensions.get('window');

export default class extends Component {
    constructor(props) {
        console.log(props)

        super(props);

        this.state = {
          datasource: [],
        };
    }

    componentDidMount(){

      var ref = firebase.database().ref("subcategoryTitles");
      ref.once('value').then((snapshot) => {
        this.setState({
          datasource: snapshot.val()
        })
      })

    }

    render(){
        return(
          <View style={styles.container}>
            <FlatList
              data={this.state.datasource}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                onPress={()=> this.props.navigation.navigate('VideoLibraryDetail', { videoListTitle: item.subcategory })}>
                <View style={styles.rowContainer}>
                  <Image style={{width: width, height: "98%"}} source={{uri: item.imageUrl}} resizeMode={"cover"}/>
                </View>
                </TouchableOpacity>

              )}
              keyExtractor={(item, index) => item.subcategory}
            />
          </View>
        );
    }

}

const styles = {
    container: {
      flex:1,
      width: width,
      backgroundColor: "#fff"
    },
    rowContainer: {
      width: width,
      height: 100,
      backgroundColor: "#fff",
      justifyContent: "center",
      alignItems: "center",

    }

}
