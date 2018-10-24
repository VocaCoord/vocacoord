import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { Divider } from "react-native-elements";

let api = "https://temp-vocacoord.herokuapp.com/api/";

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
    const { firstName, lastName, email, password } = this.state;
    fetch(api + "signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ firstName, lastName, email, password })
    })
      .then(res => {
        if (res.status === 200) {
          console.log("handle signed in");
        } else if (res.status === 400) {
          console.log("handle account already exists");
        }
      })
      .catch(err => console.log(err));
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
		  <Divider style={styles.fieldsDiv}/>
          <TextInput
            label="Last Name"
            mode="outlined"
            value={this.state.lastName}
            onChangeText={lastName => this.setState({ lastName })}
          />
		  <Divider style={styles.fieldsDiv}/>
          <TextInput
            label="Email Address"
            mode="outlined"
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          />
		  <Divider style={styles.fieldsDiv}/>
          <TextInput
            secureTextEntry={true}
            label="Password"
            mode="outlined"
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
          />
		  <Divider style={styles.fieldsButtonDiv}/>
          <Button color="#ffa500" mode="contained" onPress={() => this.createAccount()}>
            <Text style={styles.buttonText}>Create Account</Text>
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
	  color: 'black'
  }
});
