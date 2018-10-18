import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, TextInput } from "react-native-paper";
import ClusterWS from "clusterws-client-js";

let api = "https://temp-vocacoord.herokuapp.com/api/";

export class StudentScreen extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      classID: null
    }
  }

  connectToClass() {
    let classID = this.state.classID;
    if (classID && classID.length === 4) {
      this.socket = new ClusterWS({
        url: "wss://temp-vocacoord.herokuapp.com/"
      });
      this.socket.on('connect', () => {
        console.log('connected to the socket');
        this.channel = this.socket.subscribe(classID);
        this.channel.watch(msg => {
          console.log(`student heard this message: ${msg}`);
        });
      });
      this.socket.on('error', (err) => {
        console.error('error: ', err);
      });
      this.socket.on('disconnect', (code, reason) => {
        console.log(`disconnected with code ${code} and reason ${reason}`);
        this.channel.unsubscribe();
      });

      /* navigate to the class here */

      
    }
  }

  componentWillUnmount() {
    if (this.socket) this.socket.disconnect();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>This is the student screen</Text>
        <TextInput
          style={styles.textboxes}
          label="Class ID"
          mode="outlined"
          value={this.state.classID}
          onChangeText={classID => this.setState({ classID })}
        />
        <Button
          style={styles.buttons}
          mode="contained"
          onPress={() => this.connectToClass()}
        >
          Connect
        </Button>
      </View>
    );
  }
}

/* Class screen for showing the word bank and words that popped up */
class ClassScreen extends Component {
  render() {
    return (
      <View></View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center"
  },
  buttons: {
    minWidth: "60%",
    maxWidth: "60%"
  },
  textboxes: {
    minWidth: "60%",
    maxWidth: "60%"
  }
});