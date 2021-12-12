import React from 'react';
import { View, Text } from 'react-native';
import { color } from '../../modules/styles/theme';

const Header = ({ headerText, backgroundColor, textColor}) => {
  const viewStyle = { ...styles.viewStyle, backgroundColor };
  const textStyle = { ...styles.textStyle, textColor };
  return (
    <View style={viewStyle}>
      <Text allowFontScaling={false} style={textStyle}>{headerText}</Text>
    </View>
  );
};

const styles = {
  textStyle: { 
    fontSize: 20,
    color: color.hot_pink
  },

  viewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    paddingTop: 15,
    position: 'relative'
  }
};

export { Header };
