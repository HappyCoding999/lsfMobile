export function validatePurchase(data) {
  const requiredFields = [
    "transactionReceipt",
    "platform",
    "productId",
    "transactionDate"
  ];

  for (let field of requiredFields) {
    const val = data[field];
    if (val === null || val === undefined) {
      throw new Error(`Purchase data must have a ${requiredField} field`);
    }
  }

  return data;
}

// export function validateAndroidPurchase(data) {

//   return data;
// }