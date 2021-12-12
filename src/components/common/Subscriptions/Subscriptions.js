import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  ScrollView,
  Dimensions,
  ImageBackground,
  NativeModules,
  Alert,
} from "react-native";
//import * as RNIap from 'react-native-iap';
import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
  type ProductPurchase,
  type PurchaseError,
} from "react-native-iap";
import { color, colorNew } from "../../../modules/styles/theme";
import { subscribeUserToEmailList } from "../../../utils";
import firebase from "react-native-firebase";

import {
  upArrow,
  logo_white_love_seat_fitness,
  icon_back_arrow_pink,
  paywall1_top,
} from "../../../images";
import { LargeButtonAnimated } from "../AnimatedComponents/LargeButtonAnimated";

const ProdChecker = NativeModules.ProdChecker;

const { height, width } = Dimensions.get("window");

const nextArrow = require("./images/sub_next_arrow.png");

const itemSkus = Platform.select({
  ios: ["001", "002", "003"],
  android: ["01", "002", "003"],
});

export const SubscriptionButton = ({
  planTitle,
  planSubtitle,
  saveText,
  onPress,
}) => {
  const elevation = 5;
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginTop: 20,
      }}
    >
      <LargeButtonAnimated
        style={{ width: "95%", height: "100%" }}
        onPress={onPress}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            marginLeft: 30,
            marginBottom: 25,
            marginTop: 25,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "flex-start",
              justifyContent: "space-around",
              width: "85%",
              height: "100%",
            }}
          >
            <Text style={styles.planTitleSelected} numberOfLines={1}>
              {planTitle} -{" "}
              <Text style={styles.planSubtitleSelected}>{planSubtitle}</Text>
            </Text>
            {saveText != "" && (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <View
                  style={[
                    styles.bubbleSelected,
                    {
                      // backgroundColor: color.mediumPink,
                      height: 30,
                      paddingHorizontal: 10,
                      paddingVertical: 0,
                    },
                  ]}
                >
                  <Text
                    style={{ ...styles.planSaveText, color: color.hotPink }}
                  >
                    {saveText}
                  </Text>
                </View>
              </View>
            )}
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "15%",
              height: "100%",
            }}
          >
            <Image
              style={{ width: 25, height: 25, resizeMode: "contain" }}
              source={nextArrow}
            />
          </View>
        </View>
      </LargeButtonAnimated>
    </View>
  );
};

class Subscriptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productsList: null,
      checked: false,
      isRequested: false,
      selected_sku: "000",
      sku: "000",
    };
  }

  purchaseUpdateSubscription = null;
  purchaseErrorSubscription = null;

  componentWillUnmount() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
  }
  // async componentDidMount() {
  //   try {
  //     const result = await RNIap.initConnection();
  //     if (result) {
  //       this.getSubscriptions()
  //     }
  //   } catch (err) {
  //     console.warn(err.code, err.message);
  //   }
  // }
  componentDidMount() {
    console.log("Vishal - initConnection done");
    this.getSubscriptions();
    console.log("Vishal - 1");
    RNIap.flushFailedPurchasesCachedAsPendingAndroid()
      .catch(() => {})
      .then(() => {
        console.log("Vishal - 2");
        if (this.purchaseUpdateSubscription) {
          this.purchaseUpdateSubscription.remove();
          this.purchaseUpdateSubscription = null;
        }
        if (this.purchaseErrorSubscription) {
          this.purchaseErrorSubscription.remove();
          this.purchaseErrorSubscription = null;
        }
        this.purchaseUpdateSubscription = purchaseUpdatedListener(
          (
            purchase: InAppPurchase | SubscriptionPurchase | ProductPurchase
          ) => {
            console.log("Vishal - 3");
            // console.log(purchase);
            const receipt = purchase.transactionReceipt;
            // console.log(receipt);
            console.log(this.state.isRequested);
            if (receipt && this.state.isRequested) {
              console.log("Vishal - 5");
              this._savePurchase(purchase, __DEV__);
              RNIap.finishTransaction(purchase, false);
            } else {
              console.log("Vishal - 6");
              if (this.state.isRequested) {
                console.log("Vishal - 7");
                this.setState({
                  isRequested: false,
                });
              } else {
                console.log("Vishal - 8");
                RNIap.finishTransaction(purchase, false);
              }
            }
          }
        );
        console.log("Vishal - 4");
        this.purchaseErrorSubscription = purchaseErrorListener(
          (error: PurchaseError) => {
            console.warn("purchaseErrorListener", error);
            if (this.state.isRequested) {
              this.setState({
                isRequested: false,
              });
            }
          }
        );
      });
  }
  getSubscriptions = async () => {
    console.log("getSubscriptions");
    try {
      const products = await RNIap.getSubscriptions(itemSkus);
      let prods = products.reduce((result, product) => {
        return {
          ...result,
          [product.productId]: product,
        };
      }, {});
      console.log(prods);
      this.setState({ productsList: prods });
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };
  subscribeItem = async (sku) => {
    console.log("subscribeItem called");
    console.log(sku);
    console.log("subscribeItem called 1");
    console.log(this.state);
    setTimeout(() => {
      console.log("subscribeItem called 2");
      this.setState({
        selected_sku: sku,
        isRequested: true,
      });
    }, 300);
    try {
      await RNIap.requestSubscription(sku);
    } catch (err) {
      console.warn(err.code, err.message);
    }

    /*try {
      console.log("subscribeItem called - 1")
      // const purchase = await RNIap.buySubscription(sku);
      const purchase = await RNIap.requestSubscription(sku);
      this.setState({
      isRequested:false
    });
      console.log("subscribeItem called - 2")
      // if purchase is canceled, these lines won't be reached and the catch will be initiated
      this._savePurchase(purchase, __DEV__);
      subscribeUserToEmailList(true);

    } catch (err) {

      // console.error('error: ', err.stack);
      console.log('error: ', err.stack);
      // this.setState({
      //   isRequested:false,
      //   selected_sku:this.state.sku
      // });
      this.setState({
        isRequested:false,
      });
      console.log("subscribeItem called - 3")
      const subscription = RNIap.addAdditionalSuccessPurchaseListenerIOS(async (purchase) => {
        this._savePurchase(purchase, __DEV__);
        subscription.remove();
      });
    }*/
  };
  buySubscribeItem = async (sku) => {
    const { purchasePlatform } = this.props.screenProps;
    if (purchasePlatform == "stripe") {
      Linking.openURL("https://lovesweatfitness.com/lsf-login-form");
      return;
    }
    if (this.state.isRequested || this.state.productsList == null) {
      return;
    }
    setTimeout(() => {
      this.setState({
        selected_sku: sku,
        isRequested: true,
      });
    }, 100);
    this.subscribeItem(sku);
  };

  getAvailablePurchases = async () => {
    try {
      console.log("getAvailablePurchases");
      await RNIap.prepare();
      console.log("getAvailablePurchases1");
      const purchases = await RNIap.getAvailablePurchases();
      console.log("getAvailablePurchases2");
      console.log(purchases);
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
  };

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
          transactionDate: purchase.transactionDate,
        };

        this.props.onClose();
        this.props.savePurchase(newPurchase);
      } else {
        ProdChecker.isTestflight()
          .then((env) => env === "TESTFLIGHT")
          .then((isTestflight) => {
            newPurchase = {
              transactionReceipt: purchase.transactionReceipt,
              platform: "ios",
              isDevEnvironment: isDevEnv, //is live or dev to check receipt according to it.
              isFromTestflight: isTestflight, //is live or dev to check receipt according to it.
              productId: purchase.productId,
              transactionDate: purchase.transactionDate,
            };

            this.props.onClose();
            this.props.savePurchase(newPurchase);
          });
      }
    } else {
      const transactionReceipt = JSON.parse(purchase.transactionReceipt);

      newPurchase = {
        transactionReceipt,
        platform: "android",
        isDevEnvironment: false,
        isFromTestflight: false,
        productId: transactionReceipt.productId,
        transactionDate: transactionReceipt.purchaseTime,
      };

      this.props.onClose();
      this.props.savePurchase(newPurchase);
    }
  }
  renderRestoreButton() {
    return (
      <TouchableOpacity style={styles.restoreButtomContainer}>
        <Text
          style={{
            fontFamily: "Sofia Pro",
            color: colorNew.mediumPink,
            fontSize: 10,
            fontWeight: "700",
            textAlign: "center",
            padding: 10,
          }}
        >
          RESTORE SUBSCRIPTIONS
        </Text>
      </TouchableOpacity>
    );
  }
  renderSkipForNow() {
    return (
      <View
        style={{
          width: "90%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.props.onClose();
          }}
          style={{
            flex: 1,
            width: "90%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Sofia Pro",
              color: colorNew.mediumPink,
              fontSize: 14,
              fontWeight: "500",
              textAlign: "center",
              padding: 20,
            }}
          >
            {"SKIP FOR NOW"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  renderSeprator() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          height: 1,
          width: "90%",
          backgroundColor: "#727272",
          marginTop: 30,
        }}
      />
    );
  }
  renderSelectedPlanViewWith(
    planTitle,
    planSubtitle,
    saveText,
    isSelected,
    sku
  ) {
    if (isSelected) {
      return (
        <SubscriptionButton
          planTitle={planTitle}
          planSubtitle={planSubtitle}
          saveText={saveText}
          onPress={() => this.buySubscribeItem(sku)}
        />
      );
    } else {
      return (
        <View style={styles.planViewContainer}>
          <View style={[this.elevationShadowStyle(5), styles.planView]}>
            <TouchableOpacity
              style={{
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => this.buySubscribeItem(sku)}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "95%",
                  height: "90%",
                  margin: 25,
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "flex-start",
                    width: "95%",
                    height: "100%",
                  }}
                >
                  <Text style={styles.planTitle}>
                    {planTitle} -{" "}
                    <Text style={styles.planSubtitle}>{planSubtitle}</Text>
                  </Text>
                  {saveText == "" ? null : (
                    <View
                      style={{
                        ...styles.bubbleSelected,

                        backgroundColor: color.mediumPink,
                        height: 30,
                        paddingHorizontal: 10,
                        paddingVertical: 0,
                      }}
                    >
                      <Text
                        style={{ ...styles.planSaveText, textAlign: "center" }}
                      >
                        {saveText}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
  elevationShadowStyle(elevation) {
    return {
      elevation,
      shadowColor: "black",
      shadowOffset: { width: 0, height: 0.5 * elevation },
      shadowOpacity: 0.3,
      shadowRadius: 0.8 * elevation,
      backgroundColor: "white",
    };
  }
  renderFullScrollable() {
    let selected_sku = this.state.selected_sku;
    return (
      <View style={{ width: "100%", height: "100%" }}>
        <ScrollView
          style={{ flex: 1, backgroundColor: "#fff" }}
          contentContainerStyle={{
            justifyContent: "flex-start",
            alignItems: "center",
            width: width,
            backgroundColor: "#fff",
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              top: 0,
            }}
          >
            <View
              style={{
                width: "100%",
                height: height * 0.35,
                backgroundColor: colorNew.bgGrey,
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <ImageBackground
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                }}
                source={paywall1_top}
              ></ImageBackground>
            </View>
          </View>
          <View
            style={{
              width: "90%",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 50,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                fontFamily: "Sofia Pro",
                color: "#000",
                fontSize: 24,
                fontWeight: "bold",
                textAlign: "center",
                width: "90%",
              }}
            >
              Your trial has ended
            </Text>
            <Text
              style={{
                fontFamily: "Sofia Pro",
                color: "#000",
                fontSize: 14,
                textAlign: "center",
                width: "90%",
                marginTop: 10,
                lineHeight: 18,
              }}
            >
              {
                "Update your subscription to gain access\n to a premium workout plan, full-length\nexcercise videos, goal tracking, and more!"
              }
            </Text>
          </View>
          <View style={styles.planViewContainer}>
            {this.renderSelectedPlanViewWith(
              "Annual ",
              "$99.00 billed annually",
              "SAVE 41%",
              selected_sku == "003",
              "003"
            )}
            {this.renderSelectedPlanViewWith(
              "3 Month ",
              "$35.97 billed every 3 months",
              "SAVE 14%",
              selected_sku == "002",
              "002"
            )}
            {this.renderSelectedPlanViewWith(
              "Monthly",
              "$13.99 billed every month",
              "",
              selected_sku == (Platform.OS === "ios" ? "001" : "01"),
              Platform.OS === "ios" ? "001" : "01"
            )}
          </View>
          {this.renderSeprator()}
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              marginTop: 40,
            }}
          >
            <Text
              style={{
                fontFamily: "Sofia Pro",
                color: colorNew.mediumPink,
                fontSize: 15,
                fontWeight: "500",
                textAlign: "left",
                width: "90%",
              }}
            >
              RENEW SUBSCRIPTION
            </Text>
            <Text
              style={{
                fontFamily: "Sofia Pro",
                color: "#000",
                fontSize: 14,
                textAlign: "left",
                fontWeight: "300",
                width: "90%",
                marginTop: 10,
              }}
            >
              Renew your subscription by choosing one of three plans above.
            </Text>
            <View style={{ width: "90%", marginTop: 20 }}>
              {this.renderRestoreButton()}
            </View>

            {this.renderSeprator()}
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: 25,
              paddingRight: 25,
              marginTop: 30,
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: 15,
              }}
            >
              <Image
                style={{ width: 30, height: 30, resizeMode: "contain" }}
                source={upArrow}
              />
            </View>
            <Text
              style={{
                fontFamily: "Sofia Pro",
                color: "#000",
                fontSize: 15,
                fontWeight: "bold",
                textAlign: "center",
                width: "90%",
                margin: 10,
              }}
            >
              Subscriptions Terms
            </Text>
            <Text
              style={{
                fontFamily: "Sofia Pro",
                color: "#000",
                fontSize: 12,
                textAlign: "justify",
              }}
            >
              If you choose to purchase our premium subscription, you will be
              given a free 7 day trial of all premium features. After the 7 day
              period, you will be automatically billed for the subscription you
              selected. At that time payment will be charged to your iTunes
              account and the subscription will automatically renew and charge
              unless canceled 24 hours prior to the end of the current period.
              All payments made through iTunes are controlled and managed by
              Apple. Subscriptions may be managed by the user in their iTunes
              account settings after purchase. If your subscription was
              purchased through the Love Sweat Fitness website, it can be
              managed there.
            </Text>
          </View>
          <View
            style={[
              Platform.OS === "ios" ? { marginTop: 20 } : {},
              {
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                // height: 40,
                width: "100%",
              },
            ]}
          >
            <View style={{ width: 180, marginTop: 10 }}>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    "https://lovesweatfitness.com/terms-conditions/"
                  )
                }
              >
                <Text
                  style={{
                    color: colorNew.mediumPink,
                    textAlign: "right",
                    fontWeight: "bold",
                    fontFamily: "Sofia Pro",
                    textDecorationLine: "underline",
                    fontSize: 14,
                  }}
                >
                  TERMS & CONDITIONS
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ width: 180, marginTop: 10 }}>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    "https://lovesweatfitness.com/privacy-policy/"
                  )
                }
              >
                <Text
                  style={{
                    color: colorNew.mediumPink,
                    textAlign: "center",
                    fontWeight: "bold",
                    fontFamily: "Sofia Pro",
                    textDecorationLine: "underline",
                    fontSize: 14,
                  }}
                >
                  PRIVACY POLICY
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {this.renderSeprator()}
          {this.renderSkipForNow()}
        </ScrollView>
        {this.renderTransperantHeaderview()}
      </View>
    );
  }
  renderTransperantHeaderview() {
    return (
      <View
        style={{
          height: 44,
          width: "100%",
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{
            height: 44,
            width: 44,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 5,
          }}
          onPress={this.props.onClose}
        >
          <Image
            style={{ flex: 1, top: 0 }}
            resizeMode="contain"
            source={icon_back_arrow_pink}
          />
        </TouchableOpacity>
        <Image
          style={{ flex: 1, top: 0 }}
          resizeMode="contain"
          source={logo_white_love_seat_fitness}
        />
        <View
          style={{
            height: 44,
            width: 44,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 5,
          }}
        ></View>
      </View>
    );
  }
  render() {
    return this.renderFullScrollable();
  }
  // renderOld() {
  //   const { productsList } = this.state;
  //   console.log(productsList);

  //   const monthNames = [
  //     "January",
  //     "February",
  //     "March",
  //     "April",
  //     "May",
  //     "June",
  //     "July",
  //     "August",
  //     "September",
  //     "October",
  //     "November",
  //     "December",
  //   ];

  //   var today = new Date();
  //   var dd = today.getDate();
  //   var mm = monthNames[today.getMonth()];
  //   var yyyy = today.getFullYear();

  //   if (dd < 10) {
  //     dd = "0" + dd;
  //   }

  //   if (mm < 10) {
  //     mm = "0" + mm;
  //   }

  //   today = mm + " " + dd + ", " + yyyy;

  //   return (
  //     <ScrollView
  //       style={{ flex: 1 }}
  //       contentContainerStyle={{
  //         justifyContent: "flex-start",
  //         alignItems: "center",
  //         width: width,
  //       }}
  //     >
  //       <View
  //         style={{
  //           flex: 1,
  //           justifyContent: "center",
  //           alignItems: "center",
  //           width: "100%",
  //           top: 10,
  //         }}
  //       >
  //         <Text
  //           style={{
  //             fontFamily: "Sofia Pro",
  //             color: "#000",
  //             fontSize: 25,
  //             fontWeight: "bold",
  //             textAlign: "left",
  //             width: "90%",
  //           }}
  //         >
  //           Your subscription details
  //         </Text>
  //         <Text
  //           style={{
  //             fontFamily: "Sofia Pro",
  //             color: "#727272",
  //             fontSize: 14,
  //             textAlign: "left",
  //             width: "90%",
  //             marginTop: 15,
  //           }}
  //         >
  //           Current Subscriptions:{" "}
  //           <Text
  //             style={{
  //               fontFamily: "Sofia Pro",
  //               color: "#b2b2b2",
  //               fontSize: 14,
  //               textAlign: "left",
  //               width: "90%",
  //               marginTop: 10,
  //             }}
  //           >
  //             Cancelled
  //           </Text>
  //         </Text>
  //         <Text
  //           style={{
  //             fontFamily: "Sofia Pro",
  //             color: "#727272",
  //             fontSize: 14,
  //             textAlign: "left",
  //             width: "90%",
  //             marginTop: 5,
  //           }}
  //         >
  //           Payment Method:{" "}
  //           <Text
  //             style={{
  //               fontFamily: "Sofia Pro",
  //               color: "#b2b2b2",
  //               fontSize: 14,
  //               textAlign: "left",
  //               width: "90%",
  //               marginTop: 10,
  //             }}
  //           >
  //             Apple App Store
  //           </Text>
  //         </Text>
  //         {this.renderSeprator()}
  //       </View>
  //       <View
  //         style={{
  //           flex: 1,
  //           justifyContent: "center",
  //           alignItems: "center",
  //           width: "100%",
  //           marginTop: 40,
  //         }}
  //       >
  //         <Text
  //           style={{
  //             fontFamily: "Sofia Pro",
  //             color: colorNew.mediumPink,
  //             fontSize: 15,
  //             fontWeight: "500",
  //             textAlign: "left",
  //             width: "90%",
  //           }}
  //         >
  //           RENEW SUBSCRIPTION
  //         </Text>
  //         <Text
  //           style={{
  //             fontFamily: "Sofia Pro",
  //             color: "#000",
  //             fontSize: 14,
  //             textAlign: "left",
  //             fontWeight: "300",
  //             width: "90%",
  //             marginTop: 10,
  //           }}
  //         >
  //           Renew your subscription by choosing one of three plans below.
  //         </Text>
  //         <View style={{ width: "90%", marginTop: 20 }}>
  //           {this.renderRestoreButton()}
  //         </View>

  //         {this.renderSkipForNow()}

  //         {this.renderSeprator()}
  //       </View>
  //       <View
  //         style={{
  //           flex: 1,
  //           justifyContent: "center",
  //           alignItems: "center",
  //           width: "100%",
  //           marginTop: 30,
  //         }}
  //       >
  //         <Text
  //           style={{
  //             fontFamily: "Sofia Pro",
  //             color: colorNew.mediumPink,
  //             fontSize: 15,
  //             fontWeight: "500",
  //             textAlign: "left",
  //             width: "90%",
  //           }}
  //         >
  //           SUBSCRIPTION OPTIONS
  //         </Text>
  //       </View>
  //       <View style={styles.planViewContainer}>
  //         <View
  //           style={{
  //             flex: 1,
  //             justifyContent: "center",
  //             alignItems: "center",
  //             width: "100%",
  //           }}
  //         >
  //           <View style={styles.planViewSelected}>
  //             <TouchableOpacity
  //               style={{
  //                 height: "100%",
  //                 justifyContent: "center",
  //                 alignItems: "center",
  //               }}
  //               onPress={() => this.buySubscribeItem("003")}
  //             >
  //               <View
  //                 style={{
  //                   flexDirection: "row",
  //                   justifyContent: "center",
  //                   alignItems: "center",
  //                   width: "95%",
  //                   height: "90%",
  //                   margin: 25,
  //                 }}
  //               >
  //                 <View
  //                   style={{
  //                     justifyContent: "center",
  //                     alignItems: "flex-start",
  //                     width: "85%",
  //                     height: "100%",
  //                   }}
  //                 >
  //                   <Text style={styles.planTitleSelected}>
  //                     Annual -{" "}
  //                     <Text style={styles.planSubtitleSelected}>
  //                       $99.00 billed annually
  //                     </Text>
  //                   </Text>
  //                   <View style={styles.bubbleSelected}>
  //                     <Text style={styles.planSaveText}>SAVE 41%</Text>
  //                   </View>
  //                 </View>
  //                 <View
  //                   style={{
  //                     justifyContent: "center",
  //                     alignItems: "center",
  //                     width: "15%",
  //                     height: "100%",
  //                   }}
  //                 >
  //                   <Image
  //                     style={{ width: 30, height: 30, resizeMode: "contain" }}
  //                     source={nextArrow}
  //                   />
  //                 </View>
  //               </View>
  //             </TouchableOpacity>
  //           </View>
  //         </View>
  //         <View style={styles.planViewContainer}>
  //           <View style={styles.planView}>
  //             <TouchableOpacity
  //               style={{
  //                 height: "100%",
  //                 justifyContent: "center",
  //                 alignItems: "center",
  //               }}
  //               onPress={() => this.buySubscribeItem("002")}
  //             >
  //               <View
  //                 style={{
  //                   flexDirection: "row",
  //                   justifyContent: "center",
  //                   alignItems: "center",
  //                   width: "95%",
  //                   height: "90%",
  //                   margin: 25,
  //                 }}
  //               >
  //                 <View
  //                   style={{
  //                     justifyContent: "center",
  //                     alignItems: "flex-start",
  //                     width: "95%",
  //                     height: "100%",
  //                   }}
  //                 >
  //                   <Text style={styles.planTitle}>
  //                     3 Month -{" "}
  //                     <Text style={styles.planSubtitle}>
  //                       $35.97 billed every 3 months
  //                     </Text>
  //                   </Text>
  //                   <View style={styles.bubbleSelected}>
  //                     <Text style={styles.planSaveText}>SAVE 14%</Text>
  //                   </View>
  //                 </View>
  //               </View>
  //             </TouchableOpacity>
  //           </View>
  //         </View>
  //         <View style={styles.planViewContainer}>
  //           <View style={styles.planView}>
  //             <TouchableOpacity
  //               style={{
  //                 height: "100%",
  //                 justifyContent: "center",
  //                 alignItems: "center",
  //               }}
  //               onPress={() =>
  //                 this.buySubscribeItem(Platform.OS === "ios" ? "001" : "01")
  //               }
  //             >
  //               <View
  //                 style={{
  //                   flexDirection: "row",
  //                   justifyContent: "center",
  //                   alignItems: "center",
  //                   width: "95%",
  //                   height: "90%",
  //                   margin: 25,
  //                 }}
  //               >
  //                 <View
  //                   style={{
  //                     justifyContent: "center",
  //                     alignItems: "flex-start",
  //                     width: "95%",
  //                     height: "100%",
  //                   }}
  //                 >
  //                   <Text style={styles.planTitle}>
  //                     Monthly -{" "}
  //                     <Text style={styles.planSubtitle}>
  //                       $13.99 billed every month
  //                     </Text>
  //                   </Text>
  //                 </View>
  //               </View>
  //             </TouchableOpacity>
  //           </View>
  //         </View>
  //       </View>

  //       <View
  //         style={{
  //           flex: 1,
  //           justifyContent: "center",
  //           alignItems: "center",
  //           paddingLeft: 25,
  //           paddingRight: 25,
  //           marginTop: 30,
  //         }}
  //       >
  //         <Text
  //           style={{
  //             fontFamily: "Sofia Pro",
  //             color: "#000",
  //             fontSize: 12,
  //             textAlign: "justify",
  //           }}
  //         >
  //           If you choose to purchase our premium subscription, you will be
  //           given a free 7 day trial of all premium features. After the 7 day
  //           period, you will be automatically billed for the subscription you
  //           selected. At that time payment will be charged to your iTunes
  //           account and the subscription will automatically renew and charge
  //           unless canceled 24 hours prior to the end of the current period. All
  //           payments made through iTunes are controlled and managed by Apple.
  //           Subscriptions may be managed by the user in their iTunes account
  //           settings after purchase. If your subscription was purchased through
  //           the Love Sweat Fitness website, it can be managed there.
  //         </Text>
  //       </View>
  //       <View
  //         style={[
  //           Platform.OS === "ios" ? { marginTop: 20 } : {},
  //           {
  //             flex: 1,
  //             flexDirection: "row",
  //             justifyContent: "center",
  //             alignItems: "center",
  //             height: 60,
  //             width: "100%",
  //           },
  //         ]}
  //       >
  //         <View style={{ width: 180, height: 60, marginTop: 10 }}>
  //           <TouchableOpacity
  //             onPress={() =>
  //               Linking.openURL(
  //                 "https://lovesweatfitness.com/terms-conditions/"
  //               )
  //             }
  //           >
  //             <Text
  //               style={{
  //                 color: colorNew.mediumPink,
  //                 textAlign: "right",
  //                 fontWeight: "bold",
  //                 fontFamily: "Sofia Pro",
  //                 textDecorationLine: "underline",
  //                 fontSize: 14,
  //               }}
  //             >
  //               TERMS & CONDITIONS
  //             </Text>
  //           </TouchableOpacity>
  //         </View>

  //         <View style={{ width: 180, height: 60 }}>
  //           <TouchableOpacity
  //             onPress={() =>
  //               Linking.openURL("https://lovesweatfitness.com/privacy-policy/")
  //             }
  //           >
  //             <Text
  //               style={{
  //                 color: colorNew.mediumPink,
  //                 textAlign: "center",
  //                 fontWeight: "bold",
  //                 fontFamily: "Sofia Pro",
  //                 textDecorationLine: "underline",
  //                 fontSize: 14,
  //               }}
  //             >
  //               PRIVACY POLICY
  //             </Text>
  //           </TouchableOpacity>
  //         </View>
  //       </View>
  //     </ScrollView>
  //   );
  // }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerTitle: {
    color: color.hotPink,
    fontFamily: "SF Pro Text",
    fontSize: 15,
    fontWeight: "bold",
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
    justifyContent: "center",
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
    marginLeft: 26,
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
    marginTop: -2,
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
    color: "#ffffff",
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
    color: "#ffffff",
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
    marginTop: 24,
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
    textDecorationLine: "underline",
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
    color: color.black,
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
    color: color.black,
  },
  bubbleSelected: {
    padding: 10,
    marginLeft: 5,
    height: 25,
    top: 10,
    backgroundColor: color.palePink,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    borderColor: color.mediumPink,
    borderWidth: 1,
  },
  planViewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  planSaveText: {
    fontFamily: "SF Pro Text",
    color: colorNew.white,
    fontSize: 13,
    letterSpacing: 0,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
    // height: 15,
    marginLeft: 5,
    marginRight: 5,
    alignSelf: "center",
  },
  planTitle: {
    fontFamily: "SF Pro Text",
    color: colorNew.darkPink,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
    marginLeft: 10,
  },
  planTitleSelected: {
    fontFamily: "SF Pro Text",
    color: color.white,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
    marginLeft: 10,
  },
  planSubtitleSelected: {
    fontFamily: "SF Pro Text",
    color: color.white,
    fontSize: 18,
    fontWeight: "500",
    textAlign: "left",
    width: "100%",
  },
  planSubtitle: {
    fontFamily: "SF Pro Text",
    color: colorNew.darkPink,
    fontSize: 18,
    fontWeight: "500",
    textAlign: "left",
    width: "100%",
  },
  planViewSelected: {
    width: "90%",
    backgroundColor: colorNew.darkPink,
    borderRadius: 20,
    marginTop: 15,
  },
  planView: {
    width: "90%",
    backgroundColor: color.white,
    borderRadius: 20,
    borderColor: colorNew.darkPink,
    borderWidth: 1,
    marginTop: 25,
  },
  restoreButtomContainer: {
    width: "45%",
    backgroundColor: color.white,
    borderRadius: 20,
    borderColor: colorNew.darkPink,
    borderWidth: 2,
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
    marginTop: 10,
  },
});

export default Subscriptions;
