import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Button, TextInput, HelperText, Snackbar } from "react-native-paper";
import { Divider } from "react-native-elements";

let api = "https://temp-vocacoord.herokuapp.com/api/";
import {
  authenticateUser,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE
} from "./actions/index.js";
import { connect } from "react-redux";

let wentBack = false;
class SignupScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      firstNameError: false,
      firstNameErrorMsg: "",
      lastName: "",
      lastNameError: false,
      lastNameErrorMsg: "",
      email: "",
      emailError: false,
      emailErrorMsg: "",
      password: "",
      passwordError: false,
      passwordErrorMsg: "",
      signingUp: false,
      signupError: false
    };
  }

  handleSignUp() {
    const { firstName, lastName, email, password } = this.state;
    const { navigate } = this.props.navigation;

    const validFirstName = this.validateFirstName(firstName);
    const validLastName = this.validateLastName(lastName);
    const validEmail = this.validateEmail(email);
    const validPassword = this.validatePassword(password);

    if (!validFirstName || !validLastName || !validEmail || !validPassword)
      return;

    this.setState({
      signingUp: true,
      firstNameError: false,
      firstNameErrorMsg: "",
      lastNameError: false,
      lastNameErrorMsg: "",
      emailError: false,
      emailErrorMsg: "",
      passwordError: false,
      passwordErrorMsg: ""
    });

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
        if (json.response.status === SIGNUP_SUCCESS)
          setTimeout(() => {
            if (wentBack) return;
            this.props.dispatch(authenticateUser(json));
            navigate("ClassroomScreen", {
              callback: this.isAuthenticated
            });
          }, 3000);
        if (json.response.status === SIGNUP_FAILURE)
          setTimeout(
            () => this.setState({ signingUp: false, signupError: true }),
            1000
          );
      })
      .catch(err => this.setState({ signupError: true }));
  }

  isAuthenticated = () => this.setState({ signingUp: false });

  componentDidMount() {
    wentBack = false;
  }

  componentWillUnmount() {
    wentBack = true;
  }

  validateFirstName = firstName => {
    if (!firstName)
      return !!this.setState({
        firstNameError: true,
        firstNameErrorMsg: "You must enter a first name."
      });

    return true;
  };

  validateLastName = lastName => {
    if (!lastName)
      return !!this.setState({
        lastNameError: true,
        lastNameErrorMsg: "You must enter a last name."
      });

    return true;
  };

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
              onChangeText={firstName =>
                this.setState({
                  firstName,
                  firstNameError: false,
                  firstNameErrorMsg: ""
                })
              }
              error={this.state.firstNameError}
            />
            <HelperText type="error" visible={this.state.firstNameError}>
              {this.state.firstNameErrorMsg}
            </HelperText>
            <Divider style={styles.fieldsDiv} />
            <TextInput
              label="Last Name"
              mode="outlined"
              value={this.state.lastName}
              onChangeText={lastName =>
                this.setState({
                  lastName,
                  lastNameError: false,
                  lastNameErrorMsg: ""
                })
              }
              error={this.state.lastNameError}
            />
            <HelperText type="error" visible={this.state.lastNameError}>
              {this.state.lastNameErrorMsg}
            </HelperText>
            <Divider style={styles.fieldsDiv} />
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
              onPress={() => this.handleSignUp()}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </Button>
          </View>
        )}
        <Snackbar
          visible={this.state.signupError}
          onDismiss={() => this.setState({ signupError: false })}
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
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black"
  }
});

export default connect()(SignupScreen);
