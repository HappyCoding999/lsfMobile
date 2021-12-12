import React, { Component } from "react"
import { View, FlatList, Text, Dimensions, TouchableOpacity, ScrollView, Platform } from 'react-native'
import { SafeAreaView } from "react-navigation"
import { ListItem } from 'react-native-elements'
import { color } from "../../modules/styles/theme"
import { SettingsFAQrow as FAQrow } from './SettingsFAQrow'

const { width, height } = Dimensions.get('window')

const questions = [
  {
    id: 0,
    q: "How long are the workouts?",
    a: "\u2022 30-45 minutes depending on your fitness level and the specific workout."
  },
  {
    id: 1,
    q: "Is any equipment required or is it all body weight?",
    a: "\u2022 The amount of equipment depends on your level (beginner, intermediate, advanced). Early levels can be done almost entirely with body weight to build endurance, strength, and balance. As you progress, weights and booty bands are introduced to up-level your workouts."
  },
  {
    id: 2,
    q: "How are the workouts structured?",
    a: "\u2022 Following Katie’s 3 : 1 Method, the workouts are designed to get more challenging each day as you progress. You’ll have 3 strength/circuit focused workouts and 3 cardio based workouts weekly. For cardio days you can either choose 1 of the amazing full length videos in the app or “sweat solo” and choose to do something on your own like a class or outdoor run."
  },
  {
    id: 3,
    q: "What do I do for Cardio days?",
    a: "\u2022 You have the option to do a full length video from the app library or sweat solo. If you choose to sweat solo you can go for a walk, run, or take a class. Just make sure to log that you completed your workout in the app! Depending on your level and weeks in the app, the program will automatically take you to the appropriate videos for the type of cardio on your schedule (LISS,MISS,HIIT)"
  },
  {
    id: 4,
    q: "How do I log a workout outside of the app, like a fitness class?",
    a: "\u2022 Depending on the class, you can just hit “log workout” on whatever day you’re on. Then in your journaling note, write what you did so you can keep track. For example, if you decide to take a yoga class on your cardio day, log your cardio sweat sesh and write “60 minute yoga flow class” in your journaling notes."
  },
  {
    id: 5,
    q: "How often will there be new content?",
    a: "\u2022 The app is loaded with over a year’s worth of brand new workouts from the start! We will continue adding new workout content including new exclusive videos regularly."
  },
  {
    id: 6,
    q: "Do I have to log every workout in the app?",
    a: "\u2022 The app programing is designed to act as your own personal trainer. Safety and results are Katie’s #1 priority so, the goal is to do each workout, in order, including self care days! Logging each day (or skipping it) is how your app knows you’re ready to move to the next week. Otherwise, it will wait until you complete all workouts in the week before moving you forward."
  },
  {
    id: 7,
    q: "What are “Sweat Challenges”?",
    a: "\u2022 These are short little bonus workouts you can do as a finisher to really push yourself after a workout or you can do them anytime you want to focus on a certain body part. You’ll also find our BIG challenges here!"
  },
  {
    id: 8,
    q: "What is in the video library?",
    a: "\u2022 Here you’ll find exclusive full-length and body part specific workout videos. You’ll also have access to fitness education videos, how-to’s, and fitness tips from Katie!"
  },
  {
    id: 9,
    q: "How Do I Get Trophies?",
    a: "\u2022 The trophies are given based on both your goals entered and predetermined goals set up by Katie. They’re fun surprises you will continue to get the more you sweat!"
  },
  {
    id: 10,
    q: "How do I update levels within the app?",
    a: "\u2022 Go to your profile, then click settings on the top left. From there, you can adjust your fitness level"
  },
  {
    id: 11,
    q: "What if I’m still not sure how to do an exercise?",
    a: "\u2022 You will find a small “i” in the upper right corner of each exercise move. Tap on it to open a step-by-step written “how-to” guide for the exercise."
  },
  {
    id: 12,
    q: "Are the daily 10 workouts really free?",
    a: "\u2022 Yep! If you’ve downloaded the app and created an account you can access the FREE daily 10 workouts without a paid subscription."
  },
  {
    id: 13,
    q: "How much does a subscription cost?",
    a: "\u2022 All users can access the premium features with a free 7-day trial. After your trial, the premium version of the app is $13.99 monthly, $11.99/month with a 3-month plan, or $8.25/month with an annual plan (our best value)."
  },
  {
    id: 14,
    q: "How do I change or cancel my subscription?",
    a: "\u2022 If you signed up through the App Store or Google Play, you can manage your subscription directly from your account in that specific store. If you signed up on the LSF site, click here to make any updates to your subscription."
  }
]

export default class SettingsFAQ extends Component {

  render() {

    return (
      <View style={styles.faqContainer}>
        <SafeAreaView forceInset={{ top: "always", bottom: "always" }}>
          {this.renderFAQList()}
        </SafeAreaView>
      </View>
    )
  }

  renderFAQList = () => {
    return (
      <ScrollView>
        <FlatList
          data={questions}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => item.id.toString()}
        />
      </ScrollView>
    )
  }

  renderItem = ({item}) => {
    return (
      <FAQrow
        question={item.q}
        answer={item.a}
        id={item.id}
        key={item.id}
      />
    )
  }
}

const styles = {
  faqContainer: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: "#fff",
    paddingTop: 0
  }
}