import React, { Component } from "react";
import { connect } from "react-redux";
import SettingsStack from "./SettingsStack";
import { saveLevel, savePurchase, updateUserData } from "../../actions";
import { chain } from "lodash";
import { Platform } from "react-native";

class SettingsWrapper extends Component {
  static router = SettingsStack.router;

  constructor(props) {
    super(props);
    this.state = {
      isComponentUpdate: false,
      purchaseHistory: [],
    };
  }
  componentWillReceiveProps(props) {
    console.log("componentWillReceiveProps called inside setting index.js");
    this.state = {
      purchaseHistory: this.props.screenProps.purchaseHistory,
    };
  }
  componentDidUpdate(prevProps, prevState) {
    for (let [tag, props] of Object.entries(prevProps)) {
      console.log("componentDidUpdate in SettingsWrapper");
      console.log("prevProps : ");
      console.log("tag : " + tag);
      console.log("props : ");
    }
  }
  render() {
    console.log("this.props in SettingsWrapper : " + this.props.screenProps);
    const { level, saveLevel, savePurchase, purchaseHistory, updateUserData } =
      this.props;
    const passedProps = {
      ...this.props.screenProps,
      user: this.props.user,
      level,
      saveLevel,
      savePurchase,
      updateUserData,
      purchaseHistory: purchaseHistory,
      purchasePlan: this._getPurchasePlan(),
      purchasePlatform: this._getPurchasePlatform(),
    };

    return (
      <SettingsStack
        navigation={this.props.navigation}
        screenProps={passedProps}
      />
    );
  }

  _getPurchasePlatform() {
    const { purchaseHistory } = this.props;
    const latestPurchase = chain(purchaseHistory)
      .sortBy((receipt) => {
        return receipt.transactionDate;
      })
      .last()
      .value();
    return !latestPurchase ? null : latestPurchase.platform;
  }
  _getPurchasePlan() {
    console.log("_getPurchasePlan called");
    var purchaseHistory = this.state.purchaseHistory;
    if (purchaseHistory.length == 0) {
      purchaseHistory = this.props.purchaseHistory;
    }
    const latestPurchase = chain(purchaseHistory)
      .sortBy((receipt) => {
        return receipt.transactionDate;
      })
      .last()
      .value();

    if (latestPurchase != null && latestPurchase != undefined) {
      console.log(
        "latestPurchase.productId : " + latestPurchase
          ? latestPurchase.productId
            ? latestPurchase.productId
            : "null"
          : "null"
      );
    } else {
      console.log("latestPurchase.productId : " + latestPurchase);
    }

    return !latestPurchase ? null : latestPurchase.productId;
  }
}

const mapStateToProps = ({ userData }) => ({
  user: userData,
  level: userData.level,
  purchaseHistory: userData.purchaseHistory,
});

export default connect(mapStateToProps, {
  saveLevel,
  savePurchase,
  updateUserData,
})(SettingsWrapper);
