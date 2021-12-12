import React, { Component } from "react";
import Loading from "./Loading";

export default class extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Loading onCompletion={this.props.onCompletion} />;
  }
}
