import React, { Component } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Modal, TouchableOpacity, Animated, Easing } from 'react-native';
import { verticalScale } from 'react-native-size-matters';

export class CircleModal extends Component {

  constructor(props) {
    super(props)
  }

  onDismiss = () => {
    if(this.props.onDismiss) {
      this.props.onDismiss()
    }
  }
  render() {
    const { visible } = this.props
    if(!visible) {
      return <View />
    }

    return (
      <Modal
        animationType='slide'
        onDismiss={this.onDismiss}
        transparent={true}
        visible={visible}>
            <View style={[styles.container]}>
              <View style={[styles.contentsContainer]}>
                {this.props.children}
              </View>
            </View>
          <TouchableOpacity onPress={this.onDismiss} style={{ position: 'absolute', width: '100%', height: '20%' }} />
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
  },
  contentsContainer: {
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: .5,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingBottom: 20,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  }
});