function completedTenWorkouts(workouts) {
  return workouts >= 10;
}

function completedFiftyWorkouts(workouts) {
  return workouts >= 50;
}

function completedOneHundredWorkouts(workouts) {
  return workouts >= 100;
}

function completedTwoHundredWorkouts(workouts) {
  return workouts >= 200;
}

export default completedWorkouts => achievements => {
  const {
    didTenWorkouts,
    didFiftyWorkouts,
    didOneHundredWorkouts,
    didTwoHundredWorkouts
  } = achievements;

  return {
    ...achievements,
    didTenWorkouts: didTenWorkouts || completedTenWorkouts(completedWorkouts),
    didFiftyWorkouts: didFiftyWorkouts || completedFiftyWorkouts(completedWorkouts),
    didOneHundredWorkouts: didOneHundredWorkouts || completedOneHundredWorkouts(completedWorkouts),
    didTwoHundredWorkouts: didTwoHundredWorkouts || completedTwoHundredWorkouts(completedWorkouts)
  };
}