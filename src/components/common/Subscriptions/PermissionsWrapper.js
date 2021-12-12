import React, { Component } from "react";
import { View } from "react-native";
import * as RNIap from "react-native-iap";


export default PayWallComponent => ComposedComponent => (
  class extends Component {

    state = {
      showComponent: true,
    };

    async componentDidMount() {
      const { latestReceipt } = this.props;
      const { platform } = latestReceipt;
      try {
        if (platform === "ios") {
          const showComponent = await RNIap.validateReceiptIos({ "receipt-data": latestReceipt.transactionReceipt })

          this.setState({ showComponent });
        } else {
          console.log("android receipt!");
        }
      } catch (err) {
        console.log(err.stack);
      }
    }

    render() {
      const { showComponent } = this.state;
      const passedProps = Object.keys(this.props).reduce((filteredProps, prop) => {
        if (prop !== "latestReceipt") {
          return { ...filteredProps, [prop]: this.props[prop] };
        }

        return filteredProps
      }, {});

      if (showComponent) {
        return <ComposedComponent {...passedProps} />;
      }

      return (
        <View style={{flex: 1}}>
          
        </View>
      );
    }
  }
)
