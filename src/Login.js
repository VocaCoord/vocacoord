import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Button, TextInput, HelperText, Snackbar } from "react-native-paper";
import { Divider } from "react-native-elements";
import { connect } from "react-redux";
import {
  authenticateUser,
  LOGIN_SUCCESS,
  LOGIN_FAILURE
} from "./actions/index.js";

let api = "https://temp-vocacoord.herokuapp.com/api/";

let wentBack = false;
class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      emailError: false,
      emailErrorMsg: "",
      password: "",
      passwordError: false,
      passwordErrorMsg: "",
      loggingIn: false,
      loginError: false
    };
  }

  handleLogIn = () => {
    const { email, password } = this.state;
    const { navigate } = this.props.navigation;

    const validEmail = this.validateEmail(email);
    const validPassword = this.validatePassword(password);

    if (!validEmail || !validPassword) return;

    this.setState({
      loggingIn: true,
      emailError: false,
      emailErrorMsg: "",
      passwordError: false,
      passwordErrorMsg: ""
    });

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
        if (json.response.status === LOGIN_SUCCESS)
          setTimeout(() => {
            if (wentBack) return;
            this.props.dispatch(authenticateUser(json));
            navigate("ClassroomScreen", {
              callback: this.isAuthenticated
            });
          }, 3000);
        if (json.response.status === LOGIN_FAILURE)
          setTimeout(() => {
            if (wentBack) return;
            this.setState({ loggingIn: false, loginError: true });
          }, 1000);
      })
      .catch(err => this.setState({ loginError: true }));
  };

  isAuthenticated = () => this.setState({ loggingIn: false });

  componentDidMount() {
    wentBack = false;
  }

  componentWillUnmount() {
    wentBack = true;
  }

  validateEmail = email => {
    if (!email)
      return !!this.setState({
        emailError: true,
        emailErrorMsg: "You must enter an email."
      });

    if (email.length > 254)
      return !!this.setState({
        emailError: true,
        emailErrorMsg: "Your email is too long."
      });

    const validEmail = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    const isValid = validEmail.test(email);
    if (!isValid)
      return !!this.setState({
        emailError: true,
        emailErrorMsg: "You entered an invalid email."
      });

    const parts = email.split("@");
    if (parts[0].length > 64)
      return !!this.setState({
        emailError: true,
        emailErrorMsg: "Your email username is too long."
      });

    const domains = parts[1].split(".");
    if (domains.some(part => part.length > 63))
      return !!this.setState({
        emailError: true,
        emailErrorMsg: "Your email domains are too long."
      });

    return true;
  };

  validatePassword = password => {
    if (!password)
      return !!this.setState({
        passwordError: true,
        passwordErrorMsg: "You must enter a password."
      });

    return true;
  };

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
              onChangeText={email =>
                this.setState({ email, emailError: false, emailErrorMsg: "" })
              }
              error={this.state.emailError}
              textContentType="emailAddress"
              keyboardType="email-address"
            />
            <HelperText type="error" visible={this.state.emailError}>
              {this.state.emailErrorMsg}
            </HelperText>
            <Divider style={styles.fieldsDiv} />
            <TextInput
              secureTextEntry={true}
              label="Password"
              mode="outlined"
              value={this.state.password}
              onChangeText={password =>
                this.setState({
                  password,
                  passwordError: false,
                  passwordErrorMsg: ""
                })
              }
              error={this.state.passwordError}
              textContentType="password"
            />
            <HelperText type="error" visible={this.state.passwordError}>
              {this.state.passwordErrorMsg}
            </HelperText>
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
        <Snackbar
          visible={this.state.loginError}
          onDismiss={() => this.setState({ loginError: false })}
        >
          Something went wrong. Try again shortly.
        </Snackbar>
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
