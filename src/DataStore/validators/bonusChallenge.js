export function validateBonusChallenge(data) {

  const requiredFields = [
    "exercisesInCircuit",
    "featureImageUrl",
    "title"
  ];

  requiredFields.forEach(requiredField => {
    const val = data[requiredField];
    if (val === null || val === undefined) {
      throw new Error(`Bonus Challenge data must have a ${requiredField} field`);
    }
  });

  return data;
}