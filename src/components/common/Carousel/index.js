import React, { Component } from 'react'
import Carousel from 'react-native-snap-carousel';

export default class extends Component {
    
  triggerRenderingHack = () => {
    if(this._carousel) {
      this._carousel.triggerRenderingHack()
    }
  }
  
    onRef = (view) => {
        if(!this._carousel) {
            this._carousel = view
        }
        this.triggerRenderingHack()
        setTimeout(this.triggerRenderingHack, 500)
    }

    render() {
        return <Carousel {...this.props} ref={this.onRef} />
    }
}