export function validateWeight(data) {
  const requiredFields = [
    "weight",
    "createdAt"
  ];

  requiredFields.forEach(requiredField => {
    const val = data[requiredField];
    if (val === null || val === undefined) {
      throw new Error(`Weight data must have a ${requiredField} field`);
    }
  });

  return data;
}