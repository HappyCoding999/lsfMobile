import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ArrowExpand } from './AnimatedComponents/ArrowExpand';
import { ArrowCollapse } from './AnimatedComponents/ArrowCollapse';

export default class ArrowToggle extends Component {

    constructor(props) {
        super(props)
        this.state = {
            expanded: false,
            animateCollapse: false,
            animateExpand: false,
        }
    }

    onArrowPressed = () => {
        const { expanded } = this.state

        const animateCollapse = expanded ? true : false
        const animateExpand = expanded ? false : true
        this.setState({ animateExpand, animateCollapse, expanding: true })

        if(!expanded && this.props.onArrowExpandPressed) {
            this.props.onArrowExpandPressed()
        }

        if(expanded && this.props.onArrowCollapsePressed) {
            this.props.onArrowCollapsePressed()
        }

    }
    
    render() {
        const { expanding, expanded, animateCollapse, animateExpand } = this.state

        return (
            <View style={{ height: 40, width: 40 }} pointerEvents={expanding ? 'none' : 'auto'}>
                <TouchableOpacity onPress={this.onArrowPressed} style={{ height: 40, width: 40 }}>
                    {expanded &&
                        <ArrowCollapse showAnimated={animateCollapse} onAnimationFinish={animateCollapse ? () => this.setState({ expanded: false, expanding: false }) : undefined}/>
                    }
                    {!expanded &&
                        <ArrowExpand showAnimated={animateExpand} onAnimationFinish={animateExpand ? () => this.setState({ expanded: true, expanding: false }) : undefined }/>
                    }
                </TouchableOpacity>
            </View>
        )
    }
}