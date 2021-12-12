import React, { Component } from "react";
import { View, Image, Text} from "react-native";
import EntryDetail from "./EntryDetail"

export default class extends Component {
    constructor(props) {
      
        super(props);

        this.state = {

        };
    }

    render(){
        return(
            <EntryDetail {...this.props}/>
        );
    }

}