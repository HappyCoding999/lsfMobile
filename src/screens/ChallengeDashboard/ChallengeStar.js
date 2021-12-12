import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { StarBurst } from '../../components/common/AnimatedComponents/StarBurst';
import { color } from "../../modules/styles/theme";
import { icon_weekday_star } from "../../images";

const DISPLAY_TYPE = {
    UNFILLED: 0,
    FILLED: 1,
    ANIMATE: 2,
}

export default class ChallengeStar extends Component {

    constructor(props) {
        super(props)
        const { filled } = props
        console.log('filled', filled)
        this.state = {
            displayType: filled == true ? DISPLAY_TYPE.FILLED : DISPLAY_TYPE.UNFILLED
        }
    }
    
    componentDidUpdate(prevProps) {
        const { filled: prevFilled } = prevProps
        const { filled } = this.props

        if(!prevFilled && filled == true) {
            this.setState({ displayType: DISPLAY_TYPE.ANIMATE })
        } else if(prevFilled == true && !filled) {
            this.setState({ displayType: DISPLAY_TYPE.UNFILLED })
        }
    }
    
    render() {
        const { displayType } = this.state
        
        const showAnimated = displayType == DISPLAY_TYPE.ANIMATE
        const progress = displayType == DISPLAY_TYPE.FILLED ? 1 : 0

        return (
            <View style={{ height:25,width:25, marginBottom:15}}>
                <StarBurst showAnimated={showAnimated} progress={progress} />
            </View>
        )
    }
}