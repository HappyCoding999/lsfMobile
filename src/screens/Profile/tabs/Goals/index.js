import React from "react";
import Goals from "./Goals";

export default props => {
  const {
    goals,
    achievements, 
    historicalWeight,
    measurements,
    saveWeightGoal,
    saveWeight
  } = props.screenProps;

  return <Goals
    goals={goals}
    achievements={achievements}
    historicalWeight={historicalWeight}
    measurements={measurements || []}
    saveWeightGoal={saveWeightGoal}
    saveWeight={saveWeight}
  />;
}