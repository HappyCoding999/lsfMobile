import React, { Component } from "react";
import Features from '../Features/Features'


export default class extends Component {
  render() {
    return (
      <Features {...this.props}/>
    );
  }

}