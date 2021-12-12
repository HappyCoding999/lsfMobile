import React, { Component } from "react";
import { View, ImageBackground, Image, Text, TouchableOpacity, Dimensions, Animated, ScrollView, SectionList, Modal, Linking } from "react-native";
import { Header, ListItem, List } from "react-native-elements"
import { color } from "../../modules/styles/theme";
import firebase from "react-native-firebase"
import {SafeAreaView} from "react-navigation"

const { width, height } = Dimensions.get('window');

var fitnessLevels = [
    { name: "Monthly", description: "" },
    { name: "3-Month", description: "" },
    { name: "Yearly", description: "" }
]

export default class Settings extends Component {
    constructor(props) {

        super(props);

        this.state = {
            showModal: false
        };


        this._onCancelButtonPressed = this._onCancelButtonPressed.bind(this);
        this._onCloseButtonPressed = this._onCloseButtonPressed.bind(this);
        this._cancelSubscription = this._cancelSubscription.bind(this);


    }

    _cancelSubscription() {
      this.setState({
        showModal: true
      });
      Linking.openURL('app-settings://lsfmobile');
    }

    _onCancelButtonPressed() {
        this.setState({
            showModal: true
        });
    }

    _onCloseButtonPressed() {
        this.setState({
            showModal: false
        });
    }

    onPressRow = ({ item }) => (
        this.props.navigation.navigate('')
    )

    renderSectionHeader = ({ section }) => (
        <View></View>
    )

    renderItem = ({ item }) => (
        <View>
            <ListItem
                title={item.name}
                titleStyle={{
                    width: "60%",
                    height: 30,
                    fontFamily: "SF Pro Text",
                    fontSize: 14,
                    fontWeight: "bold",
                    fontStyle: "normal",
                    lineHeight: 20,
                    letterSpacing: 0.5,
                    color: color.black,
                    marginTop: 30
                }}
                subtitleStyle={{
                    width: "80%",
                    height: 22,
                    fontFamily: "SF Pro Text",
                    fontSize: 14,
                    fontWeight: "300",
                    fontStyle: "normal",
                    lineHeight: 22,
                    letterSpacing: 0,
                    color: color.black
                }}
                subtitle={item.description}
                chevronColor="white"
                chevron
                rightIcon={{ source: require('./images/iconCheckmark.png') }}
                onPress={() => this.props.navigation.goBack()}
                containerStyle={{borderBottomColor: color.lightGrey}}

            />
        </View>
    )

    keyExtractor(item) {
        return item.name
    }

    renderSectionList() {
        return (
          <View style={{ height: "100%" }}>
            <SafeAreaView style={{ flex: 1 }} forceInset={{ top: "always", bottom: "always" }}>

              <SectionList
                sections={[
                  { title: "", data: fitnessLevels }
                ]}
                renderSectionHeader={this.renderSectionHeader}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor} />
            </SafeAreaView>

          </View>
        );
    }

    render() {
        return (
            <View style={{ width: width, height: height, backgroundColor: "#fff", marginTop: 40 }}>
                <SafeAreaView />
                {this.renderSectionList()}
                {/* <Text allowFontScaling={false} style={styles.cancelText}><Text allowFontScaling={false} style={{ textDecorationLine: "underline" }} onPress={this._onCancelButtonPressed}>CANCEL SUBSCRIPTION</Text></Text> */}
                {this.renderCancelModal()}
            </View>
        );
    }

    renderCancelModal() {
        const { showModal } = this.state;

        return (
            <View style={styles.modalContainer}>
                <Modal
                    visible={showModal}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => ""}>
                    <View style={styles.window}>
                        <View style={styles.container}>
                            <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: -20, marginEnd: -10 }} onPress={this._onCloseButtonPressed}>
                                <Image source={require("./images/iconCircleclose.png")} />
                            </TouchableOpacity>
                            <Text allowFontScaling={false} style={styles.modalHeaderText}>Are you sure?</Text>
                            <Text allowFontScaling={false} style={styles.modalBodyText}>Don't lose all your progress now! You've been working out for 6 days. Are you surrrrrre you want to downgrade?</Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
                                <TouchableOpacity
                                onPress={this._cancelSubscription}>
                                <View style={styles.button1}>
                                    <Text allowFontScaling={false} style={styles.button1Text}>YES, DO IT</Text>
                                </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                onPress={this._onCloseButtonPressed}>
                                <View style={styles.button2}>
                                    <Text allowFontScaling={false} style={styles.button2Text}>NO, WAIT</Text>
                                </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
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
        marginLeft: 18
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
        color: color.black
    },
    cancelText: {
        width: "100%",
        height: 14,
        fontFamily: "SF Pro Text",
        fontSize: 14,
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 14,
        letterSpacing: 1,
        textAlign: "center",
        color: color.mediumPink,
        top: height * .60,
        position: "absolute"
    },
    modalContainer: {
        flex: 1,
    },
    window: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    container: {
        width: "90%",
        height: 272,
        backgroundColor: "#fff",
        alignItems: "center"
    },
    modalHeaderText: {
        width: 126,
        height: 24,
        fontFamily: "SF Pro Text",
        fontSize: 20,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "center",
        color: color.black
    },
    modalBodyText: {
        width: 281,
        height: 110,
        fontFamily: "SF Pro Text",
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 22,
        letterSpacing: 0,
        textAlign: "center",
        color: color.black,
        marginTop: 12
    },
    button1: {
        width: 140,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: color.mediumPink,
        justifyContent: "center",
        alignItems: "center"
    },
    button1Text: {
        width: 80,
        height: 20,
        fontFamily: "SF Pro Text",
        fontSize: 14,
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 20,
        letterSpacing: 1,
        textAlign: "center",
        color: color.mediumPink
    },
    button2: {
        width: 140,
        height: 48,
        borderRadius: 100,
        backgroundColor: color.mediumPink,
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOffset: {
            width: 0,
            height: 8
        },
        shadowRadius: 15,
        shadowOpacity: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    button2Text: {
        width: 73,
        height: 20,
        fontFamily: "SF Pro Text",
        fontSize: 14,
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 20,
        letterSpacing: 1,
        textAlign: "center",
        color: "#ffffff",
        textAlign: "center"

    }

}

