import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import Voice from "react-native-voice";
import ClusterWS from "clusterws-client-js";

let api = "https://temp-vocacoord.herokuapp.com/api/";

export class VoiceDemo extends React.Component {
  constructor(props) {
    super(props);
    Voice.onSpeechStart = this.onSpeechStartHandler.bind(this);
    Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
    Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResultsHandler.bind(this);
  }

  componentDidMount() {
    fetch(api + "create", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json()).then(json => {
      let classID = json.classID;

      this.socket = new ClusterWS({
        url: "wss://temp-vocacoord.herokuapp.com/"
      });
      this.socket.on('connect', () => {
        console.log('connected to the socket');
        /* this is for testing, only the student app will be subscribing to and watching the channel in prod. */
        this.channel = this.socket.subscribe(classID);
        this.channel.watch(msg => {
          console.log(`heard this message: ${msg}`);
        });
      });
      this.socket.on('error', (err) => {
        console.error('error: ', err);
      });
      this.socket.on('disconnect', (code, reason) => {
        console.log(`disconnected with code ${code} and reason ${reason}`);
        this.channel.unsubscribe();
      });
    });
  }

  componentWillUnmount() {
    if (this.socket) this.socket.disconnect();
  }

  onSpeechStartHandler(e) {
    console.log('starting voice activity:', e)
  }

  onSpeechEndHandler(e) {
    console.log('ending voice activity:', e)
  }

  onSpeechResultsHandler(e) {
    console.log('final voice results:', e)
  }

  onSpeechPartialResultsHandler(e) {
    console.log('partial voice results:', e)
    this.channel.publish(JSON.stringify(e));
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.buttons}>
          <Button mode="contained" onPress={() => Voice.start('en-US')}>
            Listen
          </Button>
        </View>
        <View style={styles.buttons}>
          <Button mode="contained" onPress={() => Voice.stop()}>
            Stop Listening
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  buttons: {
    minWidth: "60%",
    maxWidth: "60%"
  }
});
