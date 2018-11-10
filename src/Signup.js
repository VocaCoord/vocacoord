import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { Divider } from "react-native-elements";

let api = "https://temp-vocacoord.herokuapp.com/api/";
import {
  authenticateUser,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE
} from "./actions/index.js";
import { connect } from "react-redux";

class SignupScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      signingUp: false
    };
  }

  handleSignUp() {
    this.setState({ signingUp: true });

    const { firstName, lastName, email, password } = this.state;
    const { navigate } = this.props.navigation;

    fetch(api + "signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ firstName, lastName, email, password })
    })
      .then(res => {
        if (res.status === 200) return res.json();
      })
      .then(json => {
        this.props.dispatch(authenticateUser(json));
        if (json.response.status === SIGNUP_SUCCESS)
          setTimeout(
            () =>
              navigate("TeacherScreen", {
                callback: this.isAuthenticated.bind(this)
              }),
            3000
          );
        if (json.response.status === SIGNUP_FAILURE)
          setTimeout(
            () => this.setState({ signingUp: false, signupError: true }),
            1000
          );
      })
      .catch(err => console.log(err));
  }

  isAuthenticated() {
    this.setState({ signingUp: false });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.signingUp ? (
          <View>
            <Text>Hold on while we try to sign you up...</Text>
            <ActivityIndicator size="large" color="#ffa500" />
          </View>
        ) : (
          <View style={styles.buttons}>
            <TextInput
              label="First Name"
              mode="outlined"
              value={this.state.firstName}
              onChangeText={firstName => this.setState({ firstName })}
            />
            <Divider style={styles.fieldsDiv} />
            <TextInput
              label="Last Name"
              mode="outlined"
              value={this.state.lastName}
              onChangeText={lastName => this.setState({ lastName })}
            />
            <Divider style={styles.fieldsDiv} />
            <TextInput
              label="Email Address"
              mode="outlined"
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
            />
            <Divider style={styles.fieldsDiv} />
            <TextInput
              secureTextEntry={true}
              label="Password"
              mode="outlined"
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
            />
            <Divider style={styles.fieldsButtonDiv} />
            <Button
              color="#ffa500"
              mode="contained"
              onPress={() => this.handleSignUp()}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
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
  buttons: {
    minWidth: "60%",
    maxWidth: "60%"
  },
  fieldsDiv: {
    height: "5%",
    backgroundColor: "#fff"
  },
  fieldsButtonDiv: {
    height: "10%",
    backgroundColor: "#fff"
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black"
  }
});

export default connect()(SignupScreen);
