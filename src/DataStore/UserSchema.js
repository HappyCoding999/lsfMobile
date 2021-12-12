import achievements from "./AchievementsSchema";

export default incomingData => {
  const data = validateUserData(incomingData);
  var newLevel = "Beginner";

  if (data.fitnessLevel == "INTERMIDIATE") {
    newLevel = "Intermediate";
  }
  else if (data.fitnessLevel == "ADVANCED")
  {
    newLevel = "Advanced";
  }
  return {
    name: data.name,
    lastname: data.lastname ? data.lastname : "",
    email: data.email,
    avatar: data.avatar,
    birthday: data.birthday,
    username: data.userName,
    weight: [{weight: parseInt(data.weight), createdAt: Date.now()}],
    feet: data.feet,
    inches: data.inches,
    height: data.height ? data.height : '',
    heightFormate: data.heightFormate ? data.heightFormate : '',
    country: data.country ? data.country : '',
    state: data.state ? data.state : '',
    city: data.city ? data.city : '',
    weekly: data.weeklyWorkoutValue,
    level: newLevel,
    currentWeek: 1,
    createdAt: Date.now(),
    goals: {
      weight: {
        target: null,
        current: parseInt(data.weight),
        goalAchieved: false
      },
      workoutStreak: {
        longest: 0,
        current: 0
      },
      dailyWaterIntake: {
        target: 4,
        current: 0,
        bottoleOunces:'20oz',
        lastReset: Date.now()
      },
      weeklyWorkout: {
        target: 7,
        current: 0,
        lastReset: Date.now()
      }
    },
    measurements: [],
    achievements,
    onBoarded: true
  };
};

function validateUserData(data) {
  const requiredFields = [
    "userName",
    "email",
    "weight",
    "feet",
    "inches",
  ];

  requiredFields.forEach(rf => {
    const val = data[rf];

    if (val === null || val === undefined) {
      throw new Error(`${rf} is a require field for a new user`);
    }
  });

  return data;
}

