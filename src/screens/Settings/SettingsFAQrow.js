import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native'
import { color, colorNew } from "../../modules/styles/theme";


export class SettingsFAQrow extends Component {

  state = {
    isExpanded: false
  }

  expand = () => {
    this.setState(prevState => ({ isExpanded: !prevState.isExpanded }))
  }

  updateSubscriptionLink = () => {
    return (
      <View>
        <Text style={[{...styles.text}, { color: '#818285' }]}>
          {'\u2022'} If you signed up through the App Store or Google Play, you can manage your subscription directly from your account in that specific store. If you signed up on the LSF site,
          <Text 
            style={[{...styles.text}, { color: '#ff99cc' }]}
            onPress={() => Linking.openURL('https://lovesweatfitness.com/lsf-login-form')}
          > click here </Text>
          to make any updates to your subscription.
        </Text>
      </View>
    )
  }

  render() {

    const { question, answer, id } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => this.expand()}>
          <View style={[styles.textContainer]}>
            <Text style={styles.text}>
              {question}
            </Text>
          </View>
        </TouchableOpacity>
        { 
          this.state.isExpanded == true ?

          <View style={[{...styles.textContainer}, { paddingLeft: 20, paddingRight: 20 }]}>
            {
              (id == 14) ?
                this.updateSubscriptionLink()
              :
              <Text style={[{...styles.text}, { color: '#818285' }]}>
                {answer}
              </Text>
            }
          </View>

          :
          null
        }
      </View>
    );
  }
}

const styles = {
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: '#dedee8',
    borderBottomWidth: 1,
    paddingTop: 20,
    paddingBottom: 20
  },
  text: {
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    color: colorNew.mediumPink
  }
}