import { Component } from 'react';

export default class BaseAnimatedComponent extends Component {

  animate = () => {
    if(!this.animation) {
      return
    }

    this.animation.play()
  }
  
  reset = () => {
    if(!this.animation) {
      return
    }
    
    this.animation.reset()
  }

  componentDidUpdate(prevProps) {
    const { showAnimated: prevShowAnimated } = prevProps
    const { showAnimated } = this.props

    if ((!prevShowAnimated || prevShowAnimated == false) && showAnimated == true) {
      this.animate();      
    } else if(prevShowAnimated == true && (!showAnimated || showAnimated == false)) {
      this.reset();
    }
  }
}