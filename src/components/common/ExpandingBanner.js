import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Animated, Easing } from 'react-native';
import { color } from '../../modules/styles/theme';
import ArrowToggle from './ArrowToggle';
const { height } = Dimensions.get("window");

export default class ExpandingBanner extends Component {

    constructor(props) {
        super(props)
        this.state = {
            expanded: false,
        }
        this.bannerHeight = new Animated.Value(0)
        this.contentsOpacity = new Animated.Value(0)
    }

    onExpand = () => {
        setTimeout(() => {
            this.toggleExpand()
        }, 250)
    }

    onCollapse = () => {
        setTimeout(() => {
            this.toggleExpand()
        }, 250)
    }
    
    toggleExpand = () => {
        const { expanded } = this.state
        console.log('toggleExpand', expanded)

        if(expanded) {
            this.startTextAnimation(expanded)
            setTimeout(() => {
                this.startHeightAnimation(expanded)
            }, 150)
        } else {
            this.startHeightAnimation(expanded)
            setTimeout(() => {
                this.startTextAnimation(expanded)
            }, 150)
        }

        this.setState({ expanded: !expanded })
    }

    startHeightAnimation = (expanded) => {
        const easing = Easing.inOut(Easing.ease);
        Animated.timing(this.bannerHeight, {
          toValue: expanded ? 0 : this.props.contentsHeight || 168,
          duration: expanded ? 100 : 250,
          easing
        }).start()
    }

    startTextAnimation = (expanded) => {
        const easing = Easing.inOut(Easing.ease);
        Animated.timing(this.contentsOpacity, {
          toValue: expanded ? 0 : 1,
          duration: 200,
          easing
        }).start()
    }
    
    render() {
        const { container, header, dropdownBannerStyle, bannerContentsStyle } = styles
        const { headerText } = this.props

        const height = this.bannerHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        })
        const opacity = this.contentsOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        })
        return (
            <View style={container}>
                <View style={header}>
                    <Text allowFontScaling={false} style={styles.headerTextStyle}>{headerText}</Text>
                    <ArrowToggle ref={(view) => this.arrowToggle = view} onArrowExpandPressed={this.onExpand} onArrowCollapsePressed={this.onCollapse} />
                </View>
                <Animated.View style={[dropdownBannerStyle, { height }]}>
                    <Animated.View style={[bannerContentsStyle, { opacity }]}>
                        {this.props.children}
                    </Animated.View>
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        width: '100%',
        backgroundColor: '#81B5C0',
        overflow: 'visible',
        zIndex: 500,
    },
    header: {
        height: 60,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerTextStyle: {
        fontFamily: "SF Pro Text",
        flex: 1,
        fontSize: height <= 667 ? 16 : 18,
        fontWeight: "bold",
        fontStyle: "normal",
        justifyContent: "flex-start", 
        alignItems: "center",
        paddingLeft:15,
        letterSpacing: 0.5,
        textAlign: "left",
        color: color.white,
    },
    dropdownBannerStyle: {
        top: 60,
        height,
        backgroundColor: '#81B5C0',
        width: '100%',
        position: 'absolute',
        zIndex: 500,
    },
    bannerContentsStyle: {
        flex: 1,
        height: '100%',
        width: '100%'
    }
})