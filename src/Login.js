import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

let api = "https://temp-vocacoord.herokuapp.com/api/";

export class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  validateUser() {
    const { email, password } = this.state;
    fetch(api + "login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
      .then(res => {
        if (res.status === 200) {
          console.log("handle login");
        } else if (res.status === 400) {
          console.log("handle failed login");
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
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
          <Button mode="contained" onPress={() => this.validateUser()}>
            Login
          </Button>
          <Button mode="text" onPress={() => navigate("SignupScreen")}>
            No account? Create one
          </Button>
          <Button mode="contained" onPress={() => navigate("TeacherScreen")}>
            Get to Classroom screen
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
