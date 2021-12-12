import React, { Component } from "react";
import { View, Image, Text} from "react-native";
import Camera from "./Camera"

export default class extends Component {
    constructor(props) {

        
        super(props);

        this.state = {

        };
    }

    render(){
        return(
            <Camera {...this.props}/>
        );
    }

}
