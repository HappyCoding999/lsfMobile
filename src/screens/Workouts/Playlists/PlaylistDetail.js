import React, { Component } from "react";
import { View, Text, Image, Button, SafeAreaView, StyleSheet, TouchableOpacity, SectionList, FlatList} from "react-native";
import {Header, ListItem, List} from "react-native-elements"
import { color } from "../../../modules/styles/theme";
import { LargeButton } from "../../../components/common";
import {withNavigation} from "react-navigation"

var songs = [
    {title: "Promises (with Sam Smith)", songID: 1},
    {title: "Miracle - Manila Killa Remix", songID: 2},
    {title: "Miracle - Manila Killa Remix", songID: 3},
    {title: "Miracle - Manila Killa Remix", songID: 4},
    {title: "Miracle - Manila Killa Remix", songID: 5},
    {title: "Miracle - Manila Killa Remix", songID: 6},
    {title: "Miracle - Manila Killa Remix", songID: 7},
    {title: "Miracle - Manila Killa Remix", songID: 8},
]

class PlaylistDetail extends Component {

    constructor(props) {
        super(props);



        this.state = {

        };
    }

    onBackPressed = () => (
        this.props.navigation.goBack()
    )

    renderSectionHeader = ({section}) => (
        <View style={{backgroundColor:"#fff", height:0}}>
        </View>
    )

    renderItem = ({item}) => (
        <View style={{ 
            flexDirection: "column",
            justifyContent:"center", 
            borderTopColor: '#ffffff',
            borderLeftColor: '#ffffff',
            borderRightColor: '#ffffff',
            borderBottomColor: "#d8d8d8", 
            borderWidth: .5}}>
            <TouchableOpacity
            onPress={this.onPressRow}>
                <View style={styles.cellContainer}>
                    <View style={{ flexDirection: "column", width: "100%" }}>
                        <Text allowFontScaling={false} style={styles.cellPrimaryText}>{item.songID}. {item.title}</Text>
                    </View>
                </View>
            </TouchableOpacity>

        </View>
    )

    keyExtractor(item) {
        return item.title
    }

    render() {
        return (
            <View style={{ backgroundColor: "#fff"}}>
                <SafeAreaView style={styles.safeArea} />
                <Header
                    leftComponent={
                        <TouchableOpacity style={styles.button} onPress={this.onBackPressed}>
                            <Image source={require("./images/iconBackArrow.png")} />
                        </TouchableOpacity>
                    }
                    centerComponent={{ text: this.props.title, style: styles.headerTitle }}
                    barStyle="light-content"
                    backgroundColor={"#ffffff"}
                    outerContainerStyles={{ borderBottomWidth: 0 }}
                />
                <View>
                    <SectionList
                        sections={[
                            { title: "", data: songs },
                        ]}
                        renderSectionHeader={this.renderSectionHeader}
                        renderItem={this.renderItem}
                        keyExtractor={this.keyExtractor}
                    />
                    <LargeButton >
                        <Text>PUMP UP THE JAMS</Text>
                    </LargeButton>
                </View>
                <View style={styles.bottomContainer}>
                    <LargeButton 
                        onPress={()=>{alert("you clicked me")}}>
                        <Text>PUMP UP THE JAMS</Text>
                    </LargeButton>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    safeArea:{
        flex: 1,
        backgroundColor: "#fff"
    },
    headerTitle: {
        color: color.hotPink, 
        fontFamily: "SF Pro Text", 
        fontSize: 15, 
        fontWeight: "bold" 
    },
    cellContainer:{
        flexDirection: "row",  
        height: 48
    },
    cellPrimaryText:{
        width: "100%",
        height: 18,
        fontFamily: "SF Pro Text",
        fontSize: 15,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0,
        color: color.darkGrey,
        marginLeft: 33,
        marginTop: 20
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
    },
    bottomContainer: {
        width: '100%', 
        height: 50,  
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        backgroundColor: "#fff"
    }
})

export default withNavigation(PlaylistDetail);