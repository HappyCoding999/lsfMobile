import React, { Component } from "react";
import {
  View,
  ImageBackground,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
  Platform,
  SectionList,
  Modal,
  Linking,
} from "react-native";
import { Header, ListItem, List } from "react-native-elements";
import { color, colorNew } from "../../modules/styles/theme";
import firebase from "react-native-firebase";
import { SafeAreaView } from "react-navigation";
// import * as RNIap from 'react-native-iap';
import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
  type ProductPurchase,
  type PurchaseError,
} from "react-native-iap";
import { SubscriptionButton } from "../../components/common/Subscriptions/Subscriptions";
import { subscribeUserToEmailList } from "../../utils";

const { width, height } = Dimensions.get("window");

const nextArrow = require("./images/sub_next_arrow.png");
const upArrow = require("./images/up_arrow.png");

var fitnessLevels = [
  { name: "Monthly", description: "" },
  { name: "3-Month", description: "" },
  { name: "Yearly", description: "" },
];
const itemSkus = Platform.select({
  ios: ["001", "002", "003"],
  android: ["01", "002", "003"],
});
export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      productsList: null,
      checked: false,
      isRequested: false,
      selected_sku: "000",
      sku: "000",
    };

    this._onCancelButtonPressed = this._onCancelButtonPressed.bind(this);
    this._onCloseButtonPressed = this._onCloseButtonPressed.bind(this);
    this._cancelSubscription = this._cancelSubscription.bind(this);
  }
  purchaseUpdateSubscription = null;
  purchaseErrorSubscription = null;
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

  async componentDidMount() {
    const {
      purchasePlan,
      purchasePlatform,
      membership,
      validPurchase,
      purchaseHistory,
    } = this.props.screenProps;
    // RNIap.initConnection().then(() => {
    // await RNIap.prepare();
    this.getSubscriptions();
    console.log("purchasePlan : " + purchasePlan);
    console.log("membership : " + membership);
    console.log("validPurchase : " + validPurchase);
    if (purchasePlan != null && membership != null && validPurchase != false) {
      this.setState({
        selected_sku: purchasePlan,
      });
    }
    RNIap.flushFailedPurchasesCachedAsPendingAndroid()
      .catch(() => {})
      .then(() => {
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
            const receipt = purchase.transactionReceipt;
            console.log(this.state.isRequested);
            console.log(receipt);
            if (receipt && this.state.isRequested) {
              console.log("Vishal - 5");
              this._savePurchase(purchase, __DEV__);
              subscribeUserToEmailList(true);
              RNIap.finishTransaction(purchase, false);
            } else {
              console.log("Vishal - 6");
              if (this.state.isRequested) {
                console.log("Vishal - 7");
                this.setState({
                  isRequested: false,
                });
              }
              console.log("Vishal - 8");
              RNIap.finishTransaction(purchase, false);
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
                selected_sku: "000",
                sku: "000",
              });
            }
          }
        );
      });
    // })
    // try {
    //   const result = await RNIap.initConnection();
    //   if (result) {
    //     this.getSubscriptions()
    //   }
    // } catch (err) {
    //   console.warn(err.code, err.message);
    // }
    // const { purchasePlan,purchasePlatform,membership,validPurchase,purchaseHistory} = this.props.screenProps;
    // console.log("purchasePlan : " + purchasePlan);
    // console.log("membership : " + membership);
    // console.log("validPurchase : " + validPurchase);
    // if (purchasePlan != null && membership != null && validPurchase != false) {
    //   this.setState({
    //     selected_sku: purchasePlan
    //   });
    // }
  }
  getSubscriptions = async () => {
    console.log("\n\n\ngetSubscriptions canceled ====> \n\n\n");
    try {
      const products = await RNIap.getSubscriptions(itemSkus);
      console.log("Product loaded");
      let prods = products.reduce((result, product) => {
        return {
          ...result,
          [product.productId]: product,
        };
      }, {});
      this.setState({ productsList: prods });
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };
  _cancelSubscription() {
    this.setState({
      showModal: true,
    });
    Linking.openURL("app-settings://lsfmobile");
  }

  _onCancelButtonPressed() {
    this.setState({
      showModal: true,
    });
  }

  _onCloseButtonPressed() {
    this.setState({
      showModal: false,
    });
  }

  onPressRow = ({ item }) => this.props.navigation.navigate("");

  renderSectionHeader = ({ section }) => <View></View>;

  renderItem = ({ item }) => (
    <View>
      <ListItem
        title={item.name}
        titleStyle={{
          width: "60%",
          height: 30,
          fontFamily: "SF Pro Text",
          fontSize: 14,
          fontWeight: "bold",
          fontStyle: "normal",
          lineHeight: 20,
          letterSpacing: 0.5,
          color: color.black,
          marginTop: 30,
        }}
        subtitleStyle={{
          width: "80%",
          height: 22,
          fontFamily: "SF Pro Text",
          fontSize: 14,
          fontWeight: "300",
          fontStyle: "normal",
          lineHeight: 22,
          letterSpacing: 0,
          color: color.black,
        }}
        subtitle={item.description}
        chevronColor="white"
        chevron
        rightIcon={{ source: require("./images/iconCheckmark.png") }}
        onPress={() => this.props.navigation.goBack()}
        containerStyle={{ borderBottomColor: color.lightGrey }}
      />
    </View>
  );

  keyExtractor(item) {
    return item.name;
  }

  renderSectionList() {
    return (
      <View style={{ height: "100%" }}>
        <SafeAreaView
          style={{ flex: 1 }}
          forceInset={{ top: "always", bottom: "always" }}
        >
          <SectionList
            sections={[{ title: "", data: fitnessLevels }]}
            renderSectionHeader={this.renderSectionHeader}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
          />
        </SafeAreaView>
      </View>
    );
  }
  renderTrialSection() {
    return;
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
    </View>;
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
  renderOld() {
    /*this.renderFullScrollable()*/
    return this.renderFullScrollable();
  }
  renderRestoreButton() {
    return (
      <TouchableOpacity style={styles.restoreButtomContainer}>
        <Text
          style={{
            fontFamily: "Sofia Pro",
            color: colorNew.mediumPink,
            fontSize: 13,
            fontWeight: "700",
            textAlign: "center",
            paddingVertical: 10,
          }}
        >
          RESTORE SUBSCRIPTION
        </Text>
      </TouchableOpacity>
    );
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
          transactionDate: purchase.transactionDate,
        };

        // this.props.onClose();
        this.props.screenProps.savePurchase(newPurchase);
        setTimeout(() => {
          this.props.navigation.goBack();
        }, 1000);

        // this.props.savePurchase(newPurchase);
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

            // this.props.onClose();
            this.props.screenProps.savePurchase(newPurchase);
            setTimeout(() => {
              this.props.navigation.goBack();
            }, 1000);
            // this.props.savePurchase(newPurchase);
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

      this.props.screenProps.savePurchase(newPurchase);
      setTimeout(() => {
        this.props.navigation.goBack();
      }, 1000);
      // this.props.savePurchase(newPurchase);
    }
  }

  render() {
    const { productsList } = this.state;
    // console.log(productsList);
    // console.log("this.props : " + Object.keys(this.props.screenProps || {}));
    // console.log("this.props : " + Object.values(this.props.screenProps || {}));

    const { purchasePlatform, membership, validPurchase, purchaseHistory } =
      this.props.screenProps;
    console.log("membership : " + membership);
    console.log("validPurchase : " + validPurchase);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    var today = new Date();
    var dd = today.getDate();
    var mm = monthNames[today.getMonth()];
    var yyyy = today.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }

    today = mm + " " + dd + ", " + yyyy;

    let selected_sku = this.state.selected_sku;

    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: "#fff" }}
        contentContainerStyle={{
          backgroundColor: "#fff",
          justifyContent: "flex-start",
          alignItems: "center",
          width: width,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            top: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Sofia Pro",
              color: "#000",
              fontSize: 25,
              fontWeight: "bold",
              textAlign: "left",
              width: "90%",
            }}
          >
            Your subscription details
          </Text>
          <Text
            style={{
              fontFamily: "Sofia Pro",
              color: "#727272",
              fontSize: 14,
              textAlign: "left",
              width: "90%",
              marginTop: 15,
            }}
          >
            Current Subscription:{" "}
            <Text
              style={{
                fontFamily: "Sofia Pro",
                color: "#b2b2b2",
                fontSize: 14,
                textAlign: "left",
                width: "90%",
                marginTop: 10,
              }}
            >
              {membership ? "Active" : "Cancelled"}
            </Text>
          </Text>
          <Text
            style={{
              fontFamily: "Sofia Pro",
              color: "#727272",
              fontSize: 14,
              textAlign: "left",
              width: "90%",
              marginTop: 5,
            }}
          >
            Payment Method:{" "}
            <Text
              style={{
                fontFamily: "Sofia Pro",
                color: "#b2b2b2",
                fontSize: 14,
                textAlign: "left",
                width: "90%",
                marginTop: 10,
              }}
            >
              {purchasePlatform == "ios"
                ? "Apple App Store"
                : purchasePlatform == "stripe"
                ? "Stripe"
                : "Android App Store"}
            </Text>
          </Text>
          {this.renderSeprator()}
        </View>
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
            Renew your subscription by choosing one of three plans below.
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
            width: "100%",
            marginTop: 30,
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
            SUBSCRIPTION OPTIONS
          </Text>
        </View>
        <View style={styles.planViewContainer}>
          {this.renderSelectedPlanViewWith(
            "Annual",
            "$99.00 billed annually",
            "SAVE 41%",
            selected_sku == itemSkus[2]
          )}
          {this.renderSelectedPlanViewWith(
            "3 Month ",
            "$35.97 billed every 3 months",
            "SAVE 14%",
            selected_sku == itemSkus[1],
            itemSkus[1]
          )}
          {this.renderSelectedPlanViewWith(
            "Monthly",
            "$13.99 billed every month",
            "",
            selected_sku == itemSkus[0],
            itemSkus[0]
          )}
          {/*<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%'}}>
            <SubscriptionButton
                planTitle={'Annual'}
                planSubtitle={'$99.00 billed annually'}
                saveText={'SAVE 41%'}
                onPress={() => this.buySubscribeItem(sku)}
              />
          </View>
          <View style={styles.planViewContainer}>
            <View style={styles.planView}>
              <TouchableOpacity style={{ height: "100%",justifyContent: 'center', alignItems: 'center'}} onPress={() => this.buySubscribeItem("002")}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '95%', height: "90%",margin:25}}>
              <View style={{ justifyContent: 'center', alignItems: 'flex-start', width: '95%', height: "100%"}}>
                <Text style={styles.planTitle}>
                  3 Month - <Text style={styles.planSubtitle}>
                  $35.97 billed every 3 months 
                </Text>
                </Text>
                <View style={styles.bubbleSelected}>
                  <Text style={styles.planSaveText}>
                    SAVE 14%
                  </Text>
                </View>
              </View>
              </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.planViewContainer}>
            <View style={styles.planView}>
              <TouchableOpacity style={{ height: "100%",justifyContent: 'center', alignItems: 'center'}} onPress={() => this.buySubscribeItem(Platform.OS === 'ios' ? "001" : "01")}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '95%', height: "90%",margin:25}}>
              <View style={{ justifyContent: 'center', alignItems: 'flex-start', width: '95%', height: "100%"}}>
                <Text style={styles.planTitle}>
                  Monthly - <Text style={styles.planSubtitle}>
                  $13.99 billed every month
                </Text>
                </Text>
              </View>
              </View>
              </TouchableOpacity>
            </View>
          </View>*/}
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
            unless canceled 24 hours prior to the end of the current period. All
            payments made through iTunes are controlled and managed by Apple.
            Subscriptions may be managed by the user in their iTunes account
            settings after purchase. If your subscription was purchased through
            the Love Sweat Fitness website, it can be managed there.
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
              height: 60,
              width: "100%",
            },
          ]}
        >
          <View style={{ width: 180, height: 60, marginTop: 10 }}>
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

          <View style={{ width: 180, height: 60, marginTop: 10 }}>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("https://lovesweatfitness.com/privacy-policy/")
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
      </ScrollView>
    );
  }
  renderSelectedPlanViewWith(
    planTitle,
    planSubtitle,
    saveText,
    isSelected,
    sku
  ) {
    console.log("renderSelectedPlanViewWith");
    console.log(sku);

    if (isSelected) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <SubscriptionButton
            planTitle={planTitle}
            planSubtitle={planSubtitle}
            saveText={saveText}
            onPress={() => this.buySubscribeItem(sku)}
          />
          {/*<View style={styles.planViewSelected}>
                    <TouchableOpacity style={{ height: "100%",justifyContent: 'center', alignItems: 'center'}} onPress={() => this.buySubscribeItem(sku)}>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '95%', height: "90%",margin:25}}>
                  <View style={{ justifyContent: 'center', alignItems: 'flex-start', width: '85%', height: "100%"}}>
                    <Text style={styles.planTitleSelected}>
                      {planTitle} - <Text style={styles.planSubtitleSelected}>
                      {planSubtitle}
                    </Text>
                    </Text>
                    {
                      saveText == '' ? null : <View style={styles.bubbleSelected}><Text style={styles.planSaveText}>{saveText}</Text></View>
                    }
                  </View>
                  <View style={{ justifyContent: 'center', alignItems: 'center', width: '15%', height: "100%"}}>
                    <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={nextArrow} />
                  </View>
                  </View>
                  </TouchableOpacity>
                </View>*/}
        </View>
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
                  <Text style={styles.planTitle} numberOfLines={1}>
                    {planTitle} -{" "}
                    <Text style={styles.planSubtitle}>{planSubtitle}</Text>
                  </Text>
                  {saveText == "" ? null : (
                    <View style={styles.bubbleSelected}>
                      <Text style={styles.planSaveText}>{saveText}</Text>
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
  renderFullScrollable() {
    console.log("renderFullScrollable");
    let selected_sku = this.state.sku;
    console.log("Vishal : selected_sku 1 => " + selected_sku);
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: "#fff" }}
        contentContainerStyle={{
          justifyContent: "flex-start",
          alignItems: "center",
          width: width,
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
            }}
          ></View>
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
            "Annual",
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
            unless canceled 24 hours prior to the end of the current period. All
            payments made through iTunes are controlled and managed by Apple.
            Subscriptions may be managed by the user in their iTunes account
            settings after purchase. If your subscription was purchased through
            the Love Sweat Fitness website, it can be managed there.
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
              height: 60,
              width: "100%",
            },
          ]}
        >
          <View style={{ width: 180, height: 60, marginTop: 10 }}>
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

          <View style={{ width: 180, height: 60, marginTop: 10 }}>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("https://lovesweatfitness.com/privacy-policy/")
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
      </ScrollView>
    );
  }
  renderTopSticky() {
    console.log("renderTopSticky");
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View
          style={{
            width: "100%",
            height: height * 0.35,
            backgroundColor: colorNew.bgGrey,
            alignItems: "center",
          }}
        ></View>
        <ScrollView
          style={{ flex: 1, backgroundColor: "#fff" }}
          contentContainerStyle={{
            justifyContent: "flex-start",
            alignItems: "center",
            width: width,
          }}
        >
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
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <View style={styles.planViewSelected}>
                <TouchableOpacity
                  style={{
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => this.buySubscribeItem("003")}
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
                        width: "85%",
                        height: "100%",
                      }}
                    >
                      <Text style={styles.planTitleSelected}>
                        Annual -{" "}
                        <Text style={styles.planSubtitleSelected}>
                          $99.00 billed annually
                        </Text>
                      </Text>
                      <View style={styles.bubbleSelected}>
                        <Text style={styles.planSaveText}>SAVE 41%</Text>
                      </View>
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
                        style={{ width: 30, height: 30, resizeMode: "contain" }}
                        source={nextArrow}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.planViewContainer}>
              <View style={styles.planView}>
                <TouchableOpacity
                  style={{
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => this.buySubscribeItem("002")}
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
                        3 Month -{" "}
                        <Text style={styles.planSubtitle}>
                          $35.97 billed every 3 months
                        </Text>
                      </Text>
                      <View style={styles.bubbleSelected}>
                        <Text style={styles.planSaveText}>SAVE 14%</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.planViewContainer}>
              <View style={styles.planView}>
                <TouchableOpacity
                  style={{
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() =>
                    this.buySubscribeItem(Platform.OS === "ios" ? "001" : "01")
                  }
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
                        Monthly -{" "}
                        <Text style={styles.planSubtitle}>
                          $13.99 billed every month
                        </Text>
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
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
                backgroundColor: "#b2b2b2",
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
                height: 60,
                width: "100%",
              },
            ]}
          >
            <View style={{ width: 180, height: 60, marginTop: 10 }}>
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

            <View style={{ width: 180, height: 60, marginTop: 10 }}>
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
        </ScrollView>
      </View>
    );
  }

  subscribeItem = async (sku) => {
    console.log("subscribeItem called");
    console.log(sku);
    console.log("subscribeItem called 1");
    console.log("subscribeItem called 2");
    this.setState({
      selected_sku: sku,
      isRequested: true,
    });
    try {
      await RNIap.requestSubscription(sku);
    } catch (err) {
      console.warn(err.code, err.message);
    }

    /*try {
      console.log("buySubscribeItem 1")
      const purchase = await RNIap.buySubscription(sku);
      console.log("buySubscribeItem 2")
      this.setState({
      isRequested:false
    });
      console.log("buySubscribeItem for SKU : ",sku)
      console.log("buySubscribeItem for SKU : ",sku)
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
      const subscription = RNIap.addAdditionalSuccessPurchaseListenerIOS(async (purchase) => {
        console.log("addAdditionalSuccessPurchaseListenerIOS called");
        // this._savePurchase(purchase, __DEV__);
        subscription.remove();
      });
    }*/
  };

  buySubscribeItem = async (sku) => {
    console.log("buySubscribeItem clicked sku");
    console.log(sku);
    var newSKU = sku;

    const {
      purchasePlan,
      purchasePlatform,
      membership,
      validPurchase,
      purchaseHistory,
    } = this.props.screenProps;
    if (purchasePlatform == "stripe") {
      Linking.openURL("https://lovesweatfitness.com/lsf-login-form");
      return;
    }
    if (this.state.isRequested || this.state.productsList == null) {
      return;
    }
    console.log("buySubscribeItem clicked sku 1");
    setTimeout(() => {
      this.setState({
        selected_sku: sku,
        isRequested: true,
      });
    }, 100);
    this.subscribeItem(sku);
  };
  renderCancelModal() {
    const { showModal } = this.state;

    return (
      <View style={styles.modalContainer}>
        <Modal
          visible={showModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => ""}
        >
          <View style={styles.window}>
            <View style={styles.container}>
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  marginTop: -20,
                  marginEnd: -10,
                }}
                onPress={this._onCloseButtonPressed}
              >
                <Image source={require("./images/iconCircleclose.png")} />
              </TouchableOpacity>
              <Text allowFontScaling={false} style={styles.modalHeaderText}>
                Are you sure?
              </Text>
              <Text allowFontScaling={false} style={styles.modalBodyText}>
                Don't lose all your progress now! You've been working out for 6
                days. Are you surrrrrre you want to downgrade?
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  width: "100%",
                }}
              >
                <TouchableOpacity onPress={this._cancelSubscription}>
                  <View style={styles.button1}>
                    <Text allowFontScaling={false} style={styles.button1Text}>
                      YES, DO IT
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._onCloseButtonPressed}>
                  <View style={styles.button2}>
                    <Text allowFontScaling={false} style={styles.button2Text}>
                      NO, WAIT
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = {
  sectionTitle: {
    width: 88,
    height: 15,
    fontFamily: "SF Pro Text",
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: 0.5,
    color: color.black,
    marginLeft: 18,
  },
  rowText: {
    width: 63,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 0.5,
    color: color.black,
  },
  cancelText: {
    width: "100%",
    height: 14,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 14,
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink,
    top: height * 0.6,
    position: "absolute",
  },
  modalContainer: {
    flex: 1,
  },
  window: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    width: "90%",
    height: 272,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  modalHeaderText: {
    width: 126,
    height: 24,
    fontFamily: "SF Pro Text",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
  },
  modalBodyText: {
    width: 281,
    height: 110,
    fontFamily: "SF Pro Text",
    fontSize: 16,
    fontWeight: "normal",
    fontStyle: "normal",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    color: color.black,
    marginTop: 12,
  },
  button1: {
    width: 140,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: color.mediumPink,
    justifyContent: "center",
    alignItems: "center",
  },
  button1Text: {
    width: 80,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: color.mediumPink,
  },
  button2: {
    width: 140,
    height: 48,
    borderRadius: 100,
    backgroundColor: color.mediumPink,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button2Text: {
    width: 73,
    height: 20,
    fontFamily: "SF Pro Text",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "normal",
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
    color: "#ffffff",
    textAlign: "center",
  },
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
    height: 35,
    top: 10,
    backgroundColor: color.mediumPink,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  planViewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 15,
  },
  planSaveText: {
    fontFamily: "Sofia Pro",
    color: colorNew.white,
    fontSize: 16,
    letterSpacing: 0,
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
    marginLeft: 0,
  },
  planTitle: {
    fontFamily: "Sofia Pro",
    color: colorNew.darkPink,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
    marginLeft: 10,
  },
  planTitleSelected: {
    fontFamily: "Sofia Pro",
    color: color.white,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
    marginLeft: 10,
  },
  planSubtitleSelected: {
    fontFamily: "Sofia Pro",
    color: color.white,
    fontSize: 18,
    fontWeight: "normal",
    textAlign: "left",
    width: "100%",
  },
  planSubtitle: {
    fontFamily: "Sofia Pro",
    color: colorNew.mediumPink,
    fontSize: 18,
    fontWeight: "normal",
    textAlign: "left",
    width: "100%",
  },
  planViewSelected: {
    width: "90%",
    backgroundColor: colorNew.darkPink,
    borderRadius: 20,
  },
  planView: {
    width: "90%",
    backgroundColor: color.white,
    borderRadius: 20,
    borderColor: colorNew.darkPink,
    borderWidth: 1,
  },
  restoreButtomContainer: {
    width: "60%",
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
};
