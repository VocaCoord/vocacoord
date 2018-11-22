import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Button, TextInput, HelperText } from "react-native-paper";
import { Divider } from "react-native-elements";
import ClusterWS from "clusterws-client-js";

let api = "https://temp-vocacoord.herokuapp.com/api/";

export class StudentScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classId: null || "AAAA",
      isConnecting: false,
      classIdError: false
    };
  }

  connectToClass() {
    if (!this.validateClassId()) return;

    let classId = this.state.classId;

    if (classId && classId.length === 4) {
      this.setState({ isConnecting: true, classIdError: false });

      this.socket = new ClusterWS({
        url: "wss://temp-vocacoord.herokuapp.com/"
      });
      this.socket.on("connect", () => {
        console.log("connected to the socket");
        this.channel = this.socket.subscribe(classId);
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
    this.setState({ isConnecting: false });
  }

  componentWillUnmount() {
    if (this.socket) this.socket.disconnect();
  }

  validateClassId() {
    let classId = this.state.classId,
      classIdError = false;
    if (!classId || classId.length !== 4) classIdError = true;
    this.setState({ classIdError });
    return !classIdError;
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.isConnecting ? (
          <View>
            <Text>Hold on while we try to connect you to the classroom...</Text>
            <ActivityIndicator size="large" color="#ffa500" />
          </View>
        ) : (
          <View>
            <TextInput
              onBlur={this.validateClassId}
              style={styles.textbox}
              label="Class ID"
              mode="outlined"
              value={this.state.classId}
              onChangeText={classId =>
                this.setState({ classId }, () => {
                  if (this.state.classIdError) this.validateClassId();
                })
              }
              error={this.state.classIdError}
            />
            <HelperText type="error" visible={this.state.classIdError}>
              Classroom codes must be exactly 4 characters long.
            </HelperText>
            <Divider style={styles.divider} />
            <Button
              color="#ffa500"
              style={styles.button}
              mode="contained"
              onPress={() => this.connectToClass()}
            >
              <Text style={styles.buttonText}>Connect</Text>
            </Button>
          </View>
        )}
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
  button: {
    minWidth: "60%",
    maxWidth: "60%"
  },
  textbox: {
    minWidth: "60%",
    maxWidth: "60%"
  },
  divider: {
    height: "10%",
    backgroundColor: "#fff"
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black"
  }
});
