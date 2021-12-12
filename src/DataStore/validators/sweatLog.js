export function validateSweatLogData(data) {
  /*const requiredFields = [
    "effort",
    "felt",
    "mood",
    "sore",
    "selfCare",
    "notes"
  ];*/
  const requiredFields = [
    "bonusChallenge",
    "createdAt",
    "Workout",
    "time",
    "weight",
    "isD10Completed",
    "distance",
    "felt",
    "mood",
    "selfCare",
    "accomplishments",
    "notes"
  ];

  requiredFields.forEach(requiredField => {
    const val = data[requiredField];
    if (val === null || val === undefined) {
      throw new Error(`Sweat Log data must have a ${requiredField} field`);
    }
  });

  return data;
}

export function validateSweatLogDataForOutsideWorkout(data) {

  const requiredFields = [
    "createdAt",
    "Workout",
    "outsideWorkoutTitle"
  ];

  requiredFields.forEach(requiredField => {
    const val = data[requiredField];
    if (val === null || val === undefined) {
      throw new Error(`Sweat Log data must have a ${requiredField} field for Outside Workout`);
    }
  });

  return data;
}