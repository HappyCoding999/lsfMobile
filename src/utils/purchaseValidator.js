import * as RNIap from "react-native-iap";
import { NativeModules, Platform } from "react-native";
import { flow, sortBy, last, maxBy } from "lodash/fp";
import store from '../../configureStore'

const ProdChecker = NativeModules.ProdChecker;
const API = "https://lsf-development.firebaseapp.com";

export function checkPurchaseHistory(purchaseHistory) {
  const { appData } = store.getState()
  const { skipPaywall } = appData
  console.log('checkPurchaseHistory skipPaywall', skipPaywall)

   // if(skipPaywall) {
    return Promise.resolve(true);
   // }
  
  const receiptValidators = {
    ios: (receipt) => checkIOSReceipt(receipt, __DEV__),
    android: validateAndroidReceipt,
    stripe: validateStripeReceipt
  };
  
  console.log('checkPurchaseHistory');
  const latestReceipt = flow(
    a => Object.values(a),
    sortBy(a => a.transactionDate),
    last
  )(purchaseHistory || []);
  if (latestReceipt) {
    console.log('checkPurchaseHistory 1');
    const receiptValidator = receiptValidators[latestReceipt.platform];
    const isValid = receiptValidator(latestReceipt);
    console.log('checkPurchaseHistory 3');
    console.log(isValid);
    return isValid !== undefined ? isValid : Promise.resolve(false);
  }
  console.log('checkPurchaseHistory 2');
  return Promise.resolve(false);
}

function validateStripeReceipt(latestReceipt) {
  const { id } = latestReceipt.transactionReceipt;
  const url = API + "/subscriptions/validate";
  const queryString = `?subscriptionID=${id}`;
  return fetch(url + queryString)
    .then(res => res.json())
    .then(({ isValid }) => {
      if (isValid) {
        return Promise.resolve(true);
      }

      return Promise.resolve(false);
    });
}

function checkIOSReceipt(latestReceipt, isDevEnv) {

  const password = "aebeadebb29347a6a6fb633a01138f4b";
  console.log("checkIOSReceipt")
  const validate = resp => {
    console.log("checkIOSReceipt1")
    console.log(resp);
    if (typeof resp === "object") {
      console.log("checkIOSReceipt7")
      const { status, latest_receipt_info } = resp;
      console.log(resp)
      console.log("checkIOSReceipt8")
      //return Promise.resolve(true);
      if (isInvalidEnvironment(status)) {
        return checkIOSReceipt(latestReceipt, !isDevEnv);
      }
      // return Promise.resolve(true);
      if (status === 0) {
        console.log("checkIOSReceipt9")
        const receipt_info = maxBy(r => parseInt(r.purchase_date_ms, 10))(latest_receipt_info);
        const { expires_date_ms,expires_date_pst,expires_date,original_purchase_date_pst } = maxBy(r => parseInt(r.purchase_date_ms, 10))(latest_receipt_info);
        const today = Date.now();
        const expiry = parseInt(expires_date_ms, 10);
        if (expiry > today) 
        {
          console.log("checkIOSReceipt10")
          return Promise.resolve(expiry > today);  
        }
        else
        {
          console.log("checkIOSReceipt11")
          return Promise.resolve(false);
        }
      }
      return Promise.resolve(false);
    }
    else
    {
      return Promise.resolve(false);
    }
  };
  console.log("checkIOSReceipt2")
  if (isDevEnv) {
    console.log("checkIOSReceipt3")
    return RNIap.validateReceiptIos({ "receipt-data": latestReceipt.transactionReceipt, password }, true)
      .then(validate);

  } else {
    console.log("checkIOSReceipt4")
    if (Platform.OS === "ios" && isDevEnv == false) {
    
      return ProdChecker.isTestflight()
        .then(env => env === "TESTFLIGHT")
        .then(isTest => RNIap.validateReceiptIos({ 
          "receipt-data": latestReceipt.transactionReceipt, 
          password 
        }, isTest))
        .then(validate);

    } else {
      console.log("checkIOSReceipt5")
      if (latestReceipt.isDevEnvironment || latestReceipt.environment || latestReceipt.isFromTestflight) {

        // if (latestReceipt.isFromTestflight && latestReceipt.isDevEnvironment == false) {

        //   alert("checking for TESTFLIGHT subscriptions in android platform");

        // } else {

        //   alert("checking for dev environment subscriptions in android platform");

        // }

        return RNIap.validateReceiptIos({ "receipt-data": latestReceipt.transactionReceipt, password }, true)
          .then(validate);
      }
      else
      {
        console.log("checkIOSReceipt6")
        if (Platform.OS === "ios") {
          console.log("checkIOSReceipt12")
          return ProdChecker.isTestflight()
            .then(env => env === "TESTFLIGHT")
            .then(isTest => RNIap.validateReceiptIos({ 
              "receipt-data": latestReceipt.transactionReceipt, 
              password 
            }, isTest))
            .then(validate);

        }
        else
        {
          console.log("checkIOSReceipt13")
          Promise.resolve(false);
        }
      }
    }
  }
}

function isInvalidEnvironment(status) {
  const WRONG_ENV_RESPONSES = [21007, 21008];
  return WRONG_ENV_RESPONSES.indexOf(parseInt(status, 10)) >= 0;
}

function validateAndroidReceipt(latestReceipt) {
  const { transactionReceipt } = latestReceipt;
  const { packageName, productId, purchaseToken } = transactionReceipt;
  const url = API + "/validateAndroidReceipt";
  const queryString = `?packageName=${packageName}&productId=${productId}&purchaseToken=${purchaseToken}`;

  return fetch(url + queryString)
    .then(res => {
      return res.json()
        .then(({ isValid }) => {
          if (isValid) {
            return Promise.resolve(true);
          }
          return Promise.resolve(false);
        }).catch(err => console.log(err.stack));
    }).catch(err => console.log(err.stack));
}