import React, { Component } from 'react'
import { Modal } from "react-native"
import {  gestureHandlerRootHOC } from 'react-native-gesture-handler';
import HowItWorksScreen from './HowItWorksScreen';

class HowItWorksModal extends Component {

  render() {
    const { visible, onDismiss } = this.props
 
    return (
      <Modal animationType='slide' transparent={true} visible={visible}>
        <HowItWorksScreen visible={visible} onDismiss={onDismiss} />
      </Modal>
    );
  }
}

export default HowItWorksModal;