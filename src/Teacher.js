import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Button, TextInput } from "react-native-paper";

let api = "https://temp-vocacoord.herokuapp.com/api/";

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
            label="Classroom Name"
            mode="outlined"
            value={this.state.className}
            onChangeText={className => this.setState({ className })}
          />
          <Button
            mode="contained"
            disabled={!this.canSubmit}
            onPress={() => navigate("ClassCreated", { className: this.state.className })}
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
      className: props.navigation.getParam('className'),
      classID: null,
      loading: true,
      loadingDelay: 2500
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <Text>{`${navigation.getParam('className')}`}</Text>
    };
  };

  componentDidMount() {
    fetch(api + "create", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json()).then(json => this.setState({ classID: json.classID }));

    this.timeoutID = setTimeout(() => this.setState({ loading: false }), this.state.loadingDelay);
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutID);
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        {!this.state.classID || this.state.loading ? (
          <View>
            <Text>
              Hold on while we create your class room...
            </Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <View>
            <Text>
              Your classroom has been created
            </Text>
            <Text>
              Your classroom ID is {this.state.classID}
            </Text>
            <Button
              style={styles.buttons}
              mode="contained"
              onPress={() => navigate("WordBanks", { classID: this.state.classID, className: this.state.className })}
            >
              Go to your classroom
            </Button>
          </View>
        )}
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
