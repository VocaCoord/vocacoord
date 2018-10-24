import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { ListItem } from "react-native-elements";
import ClusterWS from "clusterws-client-js";

let api = "https://temp-vocacoord.herokuapp.com/api/";

export class StudentScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classID: null,
      loading: false
    };
  }

  connectToClass() {
    let classID = this.state.classID;
    console.log(`Student ClassID: ${classID}`);
	if (classID && classID.length === 4) {
      this.setState({ loading: true });

      this.socket = new ClusterWS({
        url: "wss://temp-vocacoord.herokuapp.com/"
      });
      this.socket.on("connect", () => {
        console.log("connected to the socket");
        this.channel = this.socket.subscribe(classID);
        const { navigate } = this.props.navigation;
        setTimeout(
          () =>
            navigate("ClassScreen", {
              channel: this.channel,
              callback: this.isConnected.bind(this)
            }),
          3000
        );
      });
      this.socket.on("error", err => {
        console.error("error: ", err);
      });
      this.socket.on("disconnect", (code, reason) => {
        console.log(`disconnected with code ${code} and reason ${reason}`);
        this.channel.unsubscribe();
      });
    }
  }

  isConnected() {
    this.setState({ loading: false });
  }

  componentWillUnmount() {
    if (this.socket) this.socket.disconnect();
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading ? (
          <View>
            <Text>Hold on while we try to connect you to the class...</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <View>
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
        )}
      </View>
    );
  }
}

/* Class screen for showing the word bank and words that popped up */
export class ClassScreen extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    channel = navigation.getParam("channel");
    this.state = {
      words: []
    };
    channel.watch(wordSaid => {
      console.log(`student heard this message: ${wordSaid}`);
      let words = [...this.state.words];
      let word = words.find(w => w.word === wordSaid) || {
        word: wordSaid,
        count: 0
      };
      word.count += 1;
      words = words.filter(w => w.word !== wordSaid);
      words.unshift(word);
      this.setState({ words });
    });
/*
    const testing = ["test", "test1", "test2", "test", "test2", "test3"];
    let idx = 0;
    (function publish() {
      channel.publish(testing[idx++]);
      if (idx < testing.length) setTimeout(publish, 2000);
    })();*/
  }

  componentWillMount() {
    this.props.navigation.addListener("didFocus", () =>
      this.props.navigation.getParam("callback")()
    );
  }

  componentWillUnmount() {
	this.channel.unsubscribe()
  }

  render() {
    return (
      <View>
        {this.state.words.length > 0 &&
          this.state.words.map((w, i) => {
            return (
              <ListItem
                key={i}
                title={w.word}
                titleStyle={{
                  color: i == 0 ? "red" : "black",
                  fontSize: 32
                }}
                rightTitle={`Times said: ${w.count}`}
                rightTitleStyle={{
                  color: "black",
                  fontSize: 24
                }}
                hideChevron={true}
              />
            );
          })}
      </View>
    );
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
