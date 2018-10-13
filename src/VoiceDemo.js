import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import Voice from "react-native-voice";

export class VoiceDemo extends React.Component {
  constructor(props) {
    super(props);
    Voice.onSpeechStart = this.onSpeechStartHandler.bind(this);
    Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
    Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResultsHandler.bind(this);
  }

  onSpeechStartHandler(e) {
    console.log('starting', e)
  }

  onSpeechEndHandler(e) {
    console.log('ending', e)
  }

  onSpeechResultsHandler(e) {
    console.log('results', e)
  }

  onSpeechPartialResultsHandler(e) {
    console.log('partial', e)
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
