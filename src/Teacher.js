import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";

export class TeacherScreen extends React.Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.buttons}>
          <Button mode="contained" onPress={() => navigate("CreateClass")}>
            Create a new classroom
          </Button>
          <Button mode="contained" onPress={() => navigate("ExistingClass")}>
            Use an existing classroom
          </Button>
        </View>
      </View>
    );
  }
}

export class CreateClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      className: ""
    };
    this.canSubmit = true; //for testing, should be false in production
  }

  componentWillUpdate(nextProps, nextState) {
    this.canSubmit = true; //for testing, should be false in production
    for (let field in nextState) {
      if (nextState[field] == "") return;
    }
    this.canSubmit = true;
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View style={styles.textboxes}>
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
            label="Classroom Name"
            mode="outlined"
            value={this.state.className}
            onChangeText={className => this.setState({ className })}
          />
          <Button
            mode="contained"
            disabled={!this.canSubmit}
            onPress={() => navigate("ClassCreated")}
          >
            Create Classroom
          </Button>
          <Button
            mode="contained"
            disabled={!this.canSubmit}
            onPress={() => navigate("VoiceDemo")}
          >
            Voice Demo
          </Button>
        </View>
      </View>
    );
  }
}

export class ClassCreated extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classID: Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()
    };
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <Text>
          Your classroom has been created
        </Text>
        <Text>
          Your classroom ID is {this.state.classID}
        </Text>
        <Button
          style={styles.buttons}
          mode="contained"
          onPress={() => navigate("WordDemo", { classID: this.state.classID })}
        >
          Go to your classroom
        </Button>
      </View>
    );
  }
}

export class ExistingClass extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Class exists</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center"
    //justifyContent: 'center',
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
