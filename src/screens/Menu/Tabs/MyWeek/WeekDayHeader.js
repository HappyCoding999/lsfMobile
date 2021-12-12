import React from "react";
import { View, TouchableOpacity, FlatList, Text, ImageBackground, Image, SectionList } from "react-native";
import { color } from "../../../../modules/styles/theme";
import moment from 'moment';

const d = new Date();
const today = d.getDay()

export default (props) => {

  var dates = []
  props.completed.map(obj => {
    var day = new Date(obj.createdAt)
    if (moment(day).isSame(new Date(), 'week')){
      dates.push(day.getDay())
    } 
  })

  const waterDropActive = <Image style={styles.waterDropPosition} source={require('./images/waterDropActive.png')} />;
  const waterDrop = <Image style={styles.waterDropPosition} source={require('./images/waterDrop.png')} />;

  /* 
    if there is a workout logged for this day, render a droplet 
    but then check if its on the current day or a past day
    else don't render a droplet
  */
  activeDays = (day) => {

    var droplet;

    if (dates.includes(day))
      droplet = (today === day) ? waterDropActive : waterDrop;
    else {
      droplet = <View></View>
    }

    return droplet;
  }

  return (

    <View style={{ width: "100%", height: 90, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}>
      <View style={{ flexDirection: "row", width: "90%", justifyContent: "space-evenly" }}>
        <TouchableOpacity
        activeOpacity={.6}
        onPress={props.onDayPressed}>
        <View style={{ flexDirection: "column" }}>
          <Text allowFontScaling={false} style={styles.weekDay}>
            SUN
        </Text>
          <View style={styles.weekdayCircles(0)}>
            <View style={styles.waterDrop}>
              {activeDays(0)}
            </View>
          </View>
        </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={.6}
          onPress={props.onDayPressed}>
        <View style={{ flexDirection: "column" }}>
          <Text allowFontScaling={false} style={styles.weekDay}>
            MON
        </Text>
          <View style={styles.weekdayCircles(1)}>
            <View style={styles.waterDrop}>
              {activeDays(1)}
            </View>
          </View>
        </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={.6}
          onPress={props.onDayPressed}>
        <View style={{ flexDirection: "column" }}>
          <Text allowFontScaling={false} style={styles.weekDay}>
            TUE
        </Text>
          <View style={styles.weekdayCircles(2)}>
            <View style={styles.waterDrop}>
              {activeDays(2)}
            </View>
          </View>
        </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={.6}
          onPress={props.onDayPressed}>
        <View style={{ flexDirection: "column" }}>
          <Text allowFontScaling={false} style={styles.weekDay}>
            WED
        </Text>
          <View style={styles.weekdayCircles(3)}>
            <View style={styles.waterDrop}>
              {activeDays(3)}
            </View>
          </View>
        </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={.6}
          onPress={props.onDayPressed}>
          <View style={{ flexDirection: "column" }}>
            <Text allowFontScaling={false} style={styles.weekDay}>
              THU
            </Text>
            <View style={styles.weekdayCircles(4)}>
              <View style={styles.waterDrop}>
                {activeDays(4)}
                </View>
              </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={.6}
          onPress={props.onDayPressed}>
        <View style={{ flexDirection: "column" }}>
          <Text allowFontScaling={false} style={styles.weekDay}>
            FRI
        </Text>
          <View style={styles.weekdayCircles(5)}>
            <View style={styles.waterDrop}>
              {activeDays(5)}
            </View>
          </View>
        </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={.6}
          onPress={props.onDayPressed}>
        <View style={{ flexDirection: "column" }}>
          <Text allowFontScaling={false} style={styles.weekDay}>
            SAT
        </Text>
          <View style={styles.weekdayCircles(6)}>
            <View style={styles.waterDrop}>
              {activeDays(6)}
            </View>
          </View>
        </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  weekDay: {
    width: 31,
    height: 15,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0.5,
    textAlign: "center",
    color: color.darkGrey
  },
  waterDropPosition: {
    position: "absolute",
    top: 0,
    left: 0,
    resizeMode: 'contain',
    width: '100%',
    height: '100%'
  },
  weekdayCircles: (day) => ({
    justifyContent: 'center',
    alignItems: 'center',
    width: 28,
    height: 28,
    backgroundColor: today === day ? color.hotPink : color.lightPink,
    borderRadius: 14,
    marginTop: 7 
  }),
  waterDrop: {
    height: 18,
    width: 18
  }
}