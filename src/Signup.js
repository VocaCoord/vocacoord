import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export class SignupScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    };
  }

  createAccount() {

  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttons}>
          <TextInput
            label="First Name"
            mode="outlined"
            value={this.state.firstName}
            onChangeText={firstName => this.setState({ firstName })}
          />
          <TextInput
            label="Last Name"
            mode="outlined"
            value={this.state.lastName}
            onChangeText={lastName => this.setState({ lastName })}
          />
          <TextInput
            label="Email Address"
            mode="outlined"
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          />
          <TextInput
            secureTextEntry={true}
            label="Password"
            mode="outlined"
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
          />
          <Button mode="contained" onPress={() => createAccount()}>
            Create Account
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
