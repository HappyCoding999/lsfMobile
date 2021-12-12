
export function validateGoalsObj(data) {
  const validators = [
    [validateWeightGoal, "weight"], 
    [validateWorkoutStreak, "workoutStreak"], 
    [validateDailyWaterIntake, "dailyWaterIntake"], 
    [validateWeeklyWorkout, "weeklyWorkout"]
  ];

  return validators.reduce((result, [validator, field]) => {
    validator(result[field]);
    return result;
  }, data);
}


export function validateWeightGoal(data) {
  const requiredFields = [
    "current",
    "goalAchieved"
  ];

  requiredFields.forEach(requiredField => {
    const val = data[requiredField];
    if (val === null || val === undefined) {
      throw new Error(`Weight Goal data must have a ${requiredField} field`);
    }
  });

  return data;
}

export function validateWorkoutStreak(data) {
  const requiredFields = [
    "longest",
    "current",
  ];

  requiredFields.forEach(requiredField => {
    const val = data[requiredField];
    if (val === null || val === undefined) {
      throw new Error(`Workout Streak Goal data must have a ${requiredField} field`);
    }
  });

  return data;
}

export function validateDailyWaterIntake(data) {
  const requiredFields = [
    "target",
    "current",
    "lastReset"
  ];

  requiredFields.forEach(requiredField => {
    const val = data[requiredField];
    if (val === null || val === undefined) {
      throw new Error(`Daily Water Intake Goal data must have a ${requiredField} field`);
    }
  });

  return data;
}

export function validateWeeklyWorkout(data) {
  const requiredFields = [
    "target",
    "current",
    "lastReset"
  ];

  requiredFields.forEach(requiredField => {
    const val = data[requiredField];
    if (val === null || val === undefined) {
      throw new Error(`Weekly Workout Goal data must have a ${requiredField} field`);
    }
  });

  return data;
}