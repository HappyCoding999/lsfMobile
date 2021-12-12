import { connect } from "react-redux";
import { savePurchase } from "../../../actions";
import SubscriptionsWrapper from "./SubscriptionsWrapper";
import createPermissionsWrapper from "./PermissionsWrapper";

const Subscriptions = connect(null, { savePurchase })(SubscriptionsWrapper);
const PermissionsWrapper = createPermissionsWrapper(Subscriptions);

export {
  Subscriptions,
  PermissionsWrapper
};