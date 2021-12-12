import React, { Component } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, Platform, ScrollView, Dimensions, NativeModules } from "react-native";
import * as RNIap from 'react-native-iap';
import { color } from "../../../modules/styles/theme";
import { subscribeUserToEmailList } from '../../../utils';
import firebase from 'react-native-firebase';

const ProdChecker = NativeModules.ProdChecker;

const { height, width } = Dimensions.get('window');

const itemSkus = Platform.select({
  ios: [
    "001",
    "002",
    "003"
  ],
  android: [
    "01",
    "002",
    "003"
  ]
})

class Subscriptions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      productsList: null,
      checked: false
    }
  }

  async componentDidMount() {
    try {
      const result = await RNIap.initConnection();
      if (result) {
        this.getSubscriptions()
      }
    } catch (err) {
      console.warn(err.code, err.message);
    }
  }

  getSubscriptions = async () => {
    try {
      const products = await RNIap.getSubscriptions(itemSkus);

      let prods = products.reduce((result, product) => {
        return {
          ...result,
          [product.productId]: product
        }
      }, {});
      this.setState({ productsList: prods });
    } catch (err) {
      console.warn(err.code, err.message);
    }
  }

  buySubscribeItem = async (sku) => {

    try {
      const purchase = await RNIap.buySubscription(sku);

      // if purchase is canceled, these lines won't be reached and the catch will be initiated
      this._savePurchase(purchase, __DEV__);
      subscribeUserToEmailList(true);

    } catch (err) {

      console.error('error: ', err.stack);

      const subscription = RNIap.addAdditionalSuccessPurchaseListenerIOS(async (purchase) => {
        this._savePurchase(purchase, __DEV__);
        subscription.remove();
      });
    }
  }

  getAvailablePurchases = async () => {
    try {

      const purchases = await RNIap.getAvailablePurchases();

      if (purchases && purchases.length > 0) {
        this.setState({
          availableItemsMessage: `Got ${purchases.length} items.`,
          receipt: purchases[0].transactionReceipt,
        });
      }
    } catch (err) {
      console.warn(err.code, err.message);
      Alert.alert(err.message);
    }
  }

  _savePurchase(purchase, isDevEnv) {
    let newPurchase;

    if (Platform.OS === "ios") {

      if (isDevEnv) {

          newPurchase = {
            transactionReceipt: purchase.transactionReceipt,
            platform: "ios",
            isDevEnvironment: isDevEnv, //is live or dev to check receipt according to it.
            isFromTestflight: false, //is live or dev to check receipt according to it.
            productId: purchase.productId,
            transactionDate: purchase.transactionDate
          };

          this.props.onClose();
          this.props.savePurchase(newPurchase);

      } else {

        ProdChecker.isTestflight()
          .then(env => env === "TESTFLIGHT")
          .then(isTestflight => {

            newPurchase = {
              transactionReceipt: purchase.transactionReceipt,
              platform: "ios",
              isDevEnvironment: isDevEnv, //is live or dev to check receipt according to it.
              isFromTestflight: isTestflight, //is live or dev to check receipt according to it.
              productId: purchase.productId,
              transactionDate: purchase.transactionDate
            };

            this.props.onClose();
            this.props.savePurchase(newPurchase);
          })
      }
    } else {

      const transactionReceipt = JSON.parse(purchase.transactionReceipt);

      newPurchase = {
        transactionReceipt,
        platform: "android",
        isDevEnvironment: false,
        isFromTestflight: false,
        productId: transactionReceipt.productId,
        transactionDate: transactionReceipt.purchaseTime
      };
      
      this.props.onClose();
      this.props.savePurchase(newPurchase);

    }
  }

  render() {

    const { productsList } = this.state;
    console.log(productsList);

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    var today = new Date();
    var dd = today.getDate();
    var mm = monthNames[today.getMonth()]
    var yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    today = mm + " " + dd + ', ' + yyyy;

    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ justifyContent: "flex-start", alignItems: "center", width: width }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: 40, top: 10 }}>
          <Image style={{ width: '90%', resizeMode: 'contain' }} source={require('./images/lsfBanner.png')} />
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 140, width: '100%' }}>
          <Image style={{ width: '90%', height: '100%', resizeMode: 'contain' }} source={require('./images/subscriptionDescription.png')} />
        </View>

        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', width: '100%', height: 170 }}>
          <View style={{ width: 170, height: 170 }}>
            <TouchableOpacity onPress={() => this.buySubscribeItem(Platform.OS === 'ios' ? "001" : "01")}>
              <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={require('./images/monthlyPlan.png')} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => this.buySubscribeItem("002")}>
            <View style={{ width: 170, height: 170 }}>
              <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={require('./images/3MonthPlan.png')} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 180, width: '100%' }}>
          <View style={{ width: '90%' }}>
            <TouchableOpacity style={{ height: 160 }} onPress={() => this.buySubscribeItem("003")}>
              <Image style={{ width: '100%', height: '100%', resizeMode: 'contain' }} source={require('./images/annualPlan.png')} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 25, paddingRight: 25 }}>
          <Text style={{ fontFamily: 'Sofia Pro', color: 'white', fontSize: 12, textAlign: 'justify' }}>
            If you choose to purchase our premium subscription, you will be given a free 7 day trial of all premium features. After the 7 day period, you will be automatically billed for the subscription you selected. At that time payment will be charged to your iTunes account and the subscription will automatically renew and charge unless canceled 24 hours prior to the end of the current period. All payments made through iTunes are controlled and managed by Apple. Subscriptions may be managed by the user in their iTunes account settings after purchase. If your subscription was purchased through the Love Sweat Fitness website, it can be managed there.
          </Text>
        </View>

        <View style={[(Platform.OS === 'ios') ? { marginTop: 20 } : {}, { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 60, width: '100%' }]}>

            <View style={{ width: 180, height: 60, marginTop: 10 }}>
              <TouchableOpacity onPress={() => Linking.openURL('https://lovesweatfitness.com/terms-conditions/')}>
                <Text style={{ color: 'white', textAlign: 'right', fontWeight: 'bold', fontFamily: 'Sofia Pro', textDecorationLine: 'underline', fontSize: 14 }}>TERMS & CONDITIONS</Text>
              </TouchableOpacity>
            </View>

          <View style={{ width: 180, height: 60 }}>
            <TouchableOpacity onPress={() => Linking.openURL('https://lovesweatfitness.com/privacy-policy/')}>
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontFamily: 'Sofia Pro', textDecorationLine: 'underline', fontSize: 14 }}>PRIVACY POLICY</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff"
  },
  headerTitle: {
    color: color.hotPink,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold"
  },
  mainTitle: {
    width: "100%",
    height: 120,
    fontFamily: "Northwell",
    fontSize: 72,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.hotPink,
    justifyContent: "center"
  },
  primaryText: {
    width: 120,
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "900",
    fontStyle: "normal",
    letterSpacing: 2,
    color: "#ffffff",
    marginTop: 12,
    marginLeft: 26
  },
  secondaryText: {
    width: 200,
    height: 44,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0,
    color: "#f7f7f7",
    marginLeft: 26,
    marginTop: -2
  },
  priceText: {
    width: 100,
    height: 18,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "300",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0.57,
    textAlign: "left",
    color: "#ffffff"
  },
  priceText2: {
    width: 100,
    height: 18,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0.57,
    textAlign: "left",
    color: "#ffffff"
  },
  readyText: {
    width: 146,
    height: 26,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 26,
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink,
    marginTop: 24
  },
  freeWorkoutsText: {
    width: 175,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink,
    marginTop: 24,
    textDecorationLine: "underline"
  },
  legalText: {
    width: "96%",
    height: 200,
    fontFamily: "SF Pro Text",
    fontSize: 10,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "left",
    color: color.black
  },
  legalText2: {
    width: 300,
    height: 54,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 18,
    letterSpacing: 0,
    textAlign: "center",
    color: color.black
  },
  membershipText: {
    width: 330,
    height: 22,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
    marginTop: 10
  }
})

export default Subscriptions;