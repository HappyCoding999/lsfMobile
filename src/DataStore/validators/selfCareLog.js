export function validateSelfCareLog(data) {
  const requiredFields = ["activities"];

  requiredFields.forEach(requiredField => {
    const val = data[requiredField];
    if (val === null || val === undefined) {
      throw new Error(`Self care data must have a ${requiredField} field`);
    }
  });

  return data;
}