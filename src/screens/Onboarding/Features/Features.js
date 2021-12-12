import React, { Component } from "react";
import { View, Image, Text, Dimensions, TextInput, TouchableHighlight, Alert,TouchableOpacity } from "react-native";
import { color,colorNew} from "../../../modules/styles/theme"
import firebase from "react-native-firebase"
import LinearGradient from "react-native-linear-gradient";
import Carousel from "../../../components/common/Carousel";
import { Pagination } from 'react-native-snap-carousel';

const { height, width } = Dimensions.get('window');
const SLIDER_WIDTH = width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 4 / 3);

const SLIDER_1_FIRST_ITEM = 1;

export default class extends Component {
  constructor(props) {
    console.log(props)
    super(props);
    this.state = {
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
      entries: [
    {
        title: 'Beautiful and dramatic Antelope Canyon',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration: 'https://i.imgur.com/UYiroysl.jpg'
    },
    {
        title: 'Earlier this morning, NYC',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: 'https://i.imgur.com/UPrs1EWl.jpg'
    },
    {
        title: 'White Pocket Sunset',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
        illustration: 'https://i.imgur.com/MABUbpDl.jpg'
    },
    {
        title: 'Acrocorinth, Greece',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration: 'https://i.imgur.com/KZsmUi2l.jpg'
    },
    {
        title: 'The lone tree, majestic landscape of New Zealand',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: 'https://i.imgur.com/2nCt3Sbl.jpg'
    },
    {
        title: 'Middle Earth, Germany',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: 'https://i.imgur.com/lceHsT6l.jpg'
    }
],
    };
  }

_renderItem = ({item, index}) => {
        return (
            <View style={styles.itemContainer}>
            </View>
        );
  }
  render() {
    const { slider1ActiveSlide } = this.state;
    var { emailValue } = this.state;
    const colors = [colorNew.gradientsPinkStart, colorNew.gradientsPinkEnd];
    return (
      <View style={styles.container}>
        <View style={{alignItems: "center", justifyContent: "center", marginTop: 90,height : height * 0.15 ,backgroundColor: color.white}}>
          <Text allowFontScaling={false} style={styles.primaryText}>Browse features</Text>
          <Text style={styles.textBlock}>{'Video library featuring 54 full length,\n workout you can access anytime.'}</Text>
        </View>
        <View style={{ flex: 1, width: width, alignItems: 'center', flexDirection: "column", justifyContent: "center",marginBottom: 10}}>
        <Carousel
              ref={(c) => { this._carousel = c; }}
              data={this.state.entries}
              renderItem={this._renderItem}
              sliderWidth={SLIDER_WIDTH}
              itemWidth={ITEM_WIDTH}
              firstItem={SLIDER_1_FIRST_ITEM}
              containerCustomStyle={styles.carouselContainer}
              autoplay={false}
              autoplayDelay={1}
              autoplayInterval={3000}
              onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
            />
            <Pagination
                dotsLength={this.state.entries.length}
                activeDotIndex={slider1ActiveSlide}
                containerStyle={styles.paginationContainer}
                dotStyle={styles.paginationDot}
                inactiveDotStyle={styles.paginationDotInactive}
                dotColor="#f08fa3"
                inactiveDotColor="#000"
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
                carouselRef={this._slider1Ref}
                tappableDots={!!this._slider1Ref}
              />
        </View>
        <View style={{alignItems: "center", justifyContent: "center", marginTop: 0,height : height * 0.20 ,backgroundColor: color.white}}>
           <View style={{ flex: 1, width: "100%", alignItems: "center", justifyContent: "center",marginBottom: 40}}>
           <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={colors}
          style={styles.linearGradient}>

           <TouchableHighlight
              style={styles.buttonStyle}
              onPress={() => this.props.navigation.navigate("SignUp")}
              underlayColor={'#ee90af'}>
              <Text allowFontScaling={false} style={styles.buttonText}>Create Account</Text>
            </TouchableHighlight>

        </LinearGradient>
          </View>
          <View style={{ flex: 1, alignItems: "center",justifyContent: "center", marginBottom: 40,height : 34}}>
            <Text allowFontScaling={false} style={styles.secondaryText}>Already have account?        <Text onPress={() => this.props.navigation.navigate("Login")} style = {styles.secondaryTextWithLink}>Log In</Text></Text>
          </View>                
        </View>
      </View>
    );
  }

}

const styles = {
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: color.white
  },
  sectionStyle: {
    height: 40,
    width: width * .84,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: "#fff",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 20
  },
  textInputStyle: {
    fontFamily: "SF Pro Text",
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#fff",
  },
  buttonStyle: {
    width: 315,
    height: 48,
    borderRadius: 100,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20

  },
  buttonText: {
    width: 155,
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff"
  },
  secondaryText: {
    width: 270,
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    color: color.mediumGrey
  },
  secondaryTextWithLink: {
    width: 270,
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    textDecorationLine: 'underline',
    color: "#000"
  },
   primaryText: {
    width: '100%',
    height: 38,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    marginTop:20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: "#000"
  },
  linearGradient: {
    width: 315,
    height: 48,
    borderRadius: 100,
    backgroundColor: 'color.mediumPink',
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2,
    paddingRight: 12,
    margin: 20
  },
  textBlock: {
    width: "80%",
    height: 100,
    color: "#000",
    fontFamily: "SF Pro Text",
    fontWeight: "normal",
    fontStyle: "normal",
    fontSize: 14,
    textAlign: "center",
    margin: 20

  },
  carouselContainer: {
    marginTop: 0,
    marginBottom: 10
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: "95%",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorNew.bgGrey
  },
  paginationContainer: {
        paddingVertical: 8,
        paddingBottom: 25,
    },
    paginationDot: {
      marginTop: 5,
      marginBottom: 5,
      width: 8,
      height: 8,
      borderWidth: 1,
      borderRadius: 4,
      borderColor: colorNew.mediumPink,
      marginHorizontal: 1
    },
    paginationDotInactive: {
      marginTop: 5,
      marginBottom: 5,
      width: 8,
      height: 8,
      borderWidth: 0,
      borderRadius: 4,
      marginHorizontal: 1
    }

}


