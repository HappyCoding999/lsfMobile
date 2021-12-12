import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { CheckmarkFlipAnimation } from './AnimatedComponents/CheckmarkFlipAnimation';
import { CheckmarkBurstAnimation } from './AnimatedComponents/CheckmarkBurstAnimation';

export const CHECK_STATE = {
    UNCHECKED: 0,
    CHECKED: 1,
    CHECKED_ANIMATE: 3,
    CHECKED_BURST: 4,
}

export default class WeekdayCheck extends Component {

    constructor(props) {
        super(props)
    }
    
    render() {
        const { checkState } = this.props
        const showAnimated = checkState == CHECK_STATE.CHECKED_BURST || checkState == CHECK_STATE.CHECKED_ANIMATE
        const showFlipped = checkState == CHECK_STATE.UNCHECKED || checkState == CHECK_STATE.CHECKED_ANIMATE
        const showBurst = checkState == CHECK_STATE.CHECKED  || checkState == CHECK_STATE.CHECKED_BURST
        
        return (
            <View style={{ height:25, width:25 }}>
                {showFlipped &&
                    <CheckmarkFlipAnimation showAnimated={showAnimated} progress={0} onAnimationFinish={this.props.onFlipAnimationEnd} />
                }
                {showBurst &&
                    <CheckmarkBurstAnimation showAnimated={showAnimated} />
                }
            </View>
        )
    }
}