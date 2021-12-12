import React, { Component } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { moderateScale } from 'react-native-size-matters'
import { connect } from 'react-redux'
import { colorNew } from '../../../modules/styles/theme'
import { Card } from './Card'

  class SweatStreak extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { container, title, circleContainer, currentStreak, currentStreakNumber,
            currentStreakDays, streakText, longestStreak, longestStreakDays } = styles
    const colors = [ colorNew.lightPink, colorNew.darkPink ];

    const { workoutStreak } = this.props
    const { current = '-', longest = '-' } = workoutStreak || { }

    const currentDayText = isNaN(current) || current > 1 ? 'days' : 'day'
    const longestDayText = isNaN(longest) || longest > 1 ? 'days' : 'day'

    return(
        <Card>
            <Text style={title}>Sweat Streak</Text>
            <View style={circleContainer}>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1.5 }}
                    colors={colors}
                    style={currentStreak}>
                        <Text style={currentStreakNumber}>{current}</Text>
                        <Text style={currentStreakDays}>{currentDayText}</Text>
                        <Text style={streakText}>Current Streak</Text>
                </LinearGradient>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={colors}
                    style={longestStreak}>
                    <Image style={{ marginBottom: 5  }} source={require('../images/water-droplets.png')} />
                    <Text style={longestStreakDays}>{longest} {longestDayText}</Text>
                    <Text style={streakText}>Longest Streak</Text>
                </LinearGradient>
            </View>
        </Card>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 10,
        shadowColor: 'black',
        shadowOffset: { 
            width: 0, 
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        borderRadius: 15,
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    title: {
        fontWeight: '600',
        fontSize: 18,
        marginBottom: 5
    },
    circleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    currentStreak: {
        height: moderateScale(175),
        width: moderateScale(175),
        borderRadius: moderateScale(175),
        alignItems: 'center',
        justifyContent: 'center',
    },
    longestStreak: {
        height: moderateScale(140),
        width: moderateScale(140),
        borderRadius: moderateScale(140),
        alignItems: 'center',
        justifyContent: 'center',
    },
    currentStreakNumber: { 
        fontSize: 65,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: "SF Pro Text",
    },
    currentStreakDays: { 
        fontSize: 15,
        color: 'white',
        fontWeight: '600',
        marginTop: -5,
        fontFamily: "SF Pro Text",
    },
    streakText: { 
        fontSize: 13,
        color: 'white',
        fontFamily: "SF Pro Text",
    },
    longestStreakDays: {
        fontSize: 25,
        color: 'white',
        fontWeight: 'bold',
        marginTop: -5,
        fontFamily: "SF Pro Text",
    },
})

const mapStateToProps = ({ userData }) => {
    const { goals } = userData
    const { workoutStreak } = goals || { }

    return {
        workoutStreak
    }
}

export default connect(mapStateToProps)(SweatStreak)