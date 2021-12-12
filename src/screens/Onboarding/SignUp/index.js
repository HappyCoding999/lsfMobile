import React, { Component } from "react";
import SignUp from "./SignUp";


export default class extends Component {
    constructor(props) {

        super(props);

        this.state = {

        };
    }

    render(){
        return(
            <SignUp {...this.props}/>
        );
    }

}
