import React, { Component } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { gear, logo_white_love_seat_fitness, ic_back_white, icon_back_arrow_pink } from '../../images';

export class Header extends Component {
    
    constructor(props) {
        super(props);
    }

    onRightButtonPressed = () => {
        if(this.props.onRightPressed) {
            this.props.onRightPressed()
        }
    }
    onLeftButtonPressed = () => {
        if(this.props.onLeftButtonPressed) {
            this.props.onLeftButtonPressed()
        }
    }

    render() {
        const { container, contentContainer, logoStyle, gearStyle } = styles
        const { style } = this.props
        
        return (
            <View style={[container, style ]}>
                <View style={contentContainer}>
                    {this.props.displayBackButton && (
                        <TouchableOpacity onPress={this.onLeftButtonPressed}>
                            <Image style={[gearStyle,{tintColor:'#fff'}]} source={icon_back_arrow_pink} />
                        </TouchableOpacity>
                    )}
                    <Image style={logoStyle} source={logo_white_love_seat_fitness} />
                    <TouchableOpacity onPress={this.onRightButtonPressed}>
                        <Image style={gearStyle} source={gear} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexDirection: 'row',
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    logoStyle: {
        height: 40,
        width: '70%',
        resizeMode: 'contain',
    },
    gearStyle: {
        width: 24,
        height:24,
        resizeMode: 'contain',
    }
})

export default Header