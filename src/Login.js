import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Button, TextInput } from "react-native-paper";

let api = "https://temp-vocacoord.herokuapp.com/api/";

export class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loading: false
    };
  }

  authenticateUser() {
    const { email, password } = this.state;
    const { navigate } = this.props.navigation;

    this.setState({ loading: true });

    fetch(api + "login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
      .then(res => {
        if (res.status === 200) {
          setTimeout(
            () =>
              navigate("TeacherScreen", {
                callback: this.isAuthenticated.bind(this)
              }),
            3000
          );
        } else if (res.status === 400) {
          console.log("handle failed login");
        }
      })
      .catch(err => console.log(err));
  }

  isAuthenticated() {
    this.setState({ loading: false });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        {this.state.loading ? (
          <View>
            <Text>Hold on while we try to log you in...</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <View style={styles.buttons}>
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
            <Button mode="contained" onPress={() => this.authenticateUser()}>
              Login
            </Button>
            <Button mode="text" onPress={() => navigate("SignupScreen")}>
              No account? Create one
            </Button>
            <Button mode="contained" onPress={() => navigate("TeacherScreen")}>
              Get to Classroom screen
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
  }
});
