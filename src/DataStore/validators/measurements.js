export function validateMeasurements(data) {
  const requiredFields = [
    "weight",
    "waist",
    "biceps",
    "thighs",
    "hips"
  ];


  requiredFields.forEach(requiredField => {
    const val = data[requiredField];
    if (val === null || val === undefined) {
      throw new Error(`Measurement data must have a ${requiredField} field`);
    }
  });

  return data;
}