import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { Divider } from "react-native-elements";
import { connect } from "react-redux";
import {
  authenticateUser,
  LOGIN_SUCCESS,
  LOGIN_FAILURE
} from "./actions/index.js";

let api = "https://temp-vocacoord.herokuapp.com/api/";

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loggingIn: false
    };
  }

  handleLogIn() {
    const { email, password } = this.state;
    const { navigate } = this.props.navigation;

    this.setState({ loggingIn: true });

    fetch(api + "login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
      .then(res => {
        if (res.status === 200) return res.json();
      })
      .then(json => {
        console.log(json);
        this.props.dispatch(authenticateUser(json));
        if (json.response.status === LOGIN_SUCCESS)
          setTimeout(
            () =>
              navigate("ClassroomScreen", {
                callback: this.isAuthenticated.bind(this)
              }),
            3000
          );
        if (json.response.status === LOGIN_FAILURE)
          setTimeout(
            () => this.setState({ loggingIn: false, loginError: true }),
            1000
          );
      })
      .catch(err => console.log(err));
  }

  isAuthenticated() {
    this.setState({ loggingIn: false });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        {this.state.loggingIn ? (
          <View>
            <Text>Hold on while we try to log you in...</Text>
            <ActivityIndicator size="large" color="#ffa500" />
          </View>
        ) : (
          <View style={styles.buttons}>
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
              onPress={() => this.handleLogIn()}
            >
              <Text style={styles.loginText}>Login</Text>
            </Button>
            <Button
              color="#ffa500"
              mode="text"
              onPress={() => navigate("SignupScreen")}
            >
              <Text style={styles.noAccountText}>No account?</Text>
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
  loginText: {
    fontSize: 24,
    fontWeight: "bold"
  },
  noAccountText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black"
  }
});

export default connect()(LoginScreen);
