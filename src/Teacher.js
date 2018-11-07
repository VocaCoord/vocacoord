import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { Divider } from "react-native-elements";

let api = "https://temp-vocacoord.herokuapp.com/api/";

export class CreateClass extends Component {
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
            style={{ marginBottom: 1 }}
            label="Classroom Name"
            mode="outlined"
            value={this.state.className}
            onChangeText={className => this.setState({ className })}
          />
          <Divider style={styles.createCRoomDiv} />
          <Button
            color="#ffa500"
            mode="contained"
            disabled={!this.canSubmit}
            onPress={() =>
              navigate("ClassCreated", { className: this.state.className })
            }
          >
            <Text style={styles.buttonText}>Create Classroom</Text>
          </Button>
          <Divider style={styles.createCRoomDiv} />
          <Button
            color="#ffa500"
            mode="contained"
            disabled={!this.canSubmit}
            onPress={() => navigate("VoiceDemo")}
          >
            <Text style={styles.buttonText}>Voice Demo</Text>
          </Button>
        </View>
      </View>
    );
  }
}

export class ClassCreated extends Component {
  constructor(props) {
    super(props);
    this.state = {
      className: props.navigation.getParam("className"),
      classID: null,
      loading: true,
      loadingDelay: 2500
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <Text>{`${navigation.getParam("className")}`}</Text>
    };
  };

  componentDidMount() {
    fetch(api + "create", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(json => this.setState({ classID: json.classID }));

    this.timeoutID = setTimeout(
      () => this.setState({ loading: false }),
      this.state.loadingDelay
    );
    console.log(`Teacher ClassID: ${this.state.classID}`);
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
            <Text style={styles.classroomText}>
              Hold on while we create your classroom...
            </Text>
            <ActivityIndicator size="large" color="#ffa500" />
          </View>
        ) : (
          <View>
            <Text style={styles.classroomText}>
              Your classroom has been created with the following ID:{" "}
              <Text style={styles.idText}>{this.state.classID}</Text>
            </Text>
            <Divider style={styles.buttonDiv} />
            <Button
              color="#ffa500"
              style={styles.buttons}
              mode="contained"
              onPress={() =>
                navigate("WordBanks", {
                  classID: this.state.classID,
                  className: this.state.className
                })
              }
            >
              <Text style={styles.buttonText}>Go to your classroom</Text>
            </Button>
          </View>
        )}
      </View>
    );
  }
}

export class ExistingClass extends Component {
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
    alignItems: "center",
    justifyContent: "center"
  },
  buttons: {
    minWidth: "60%",
    maxWidth: "60%"
  },
  textboxes: {
    minWidth: "60%",
    maxWidth: "60%"
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black"
  },
  buttonDiv: {
    height: "15%",
    backgroundColor: "#fff"
  },
  createCRoomDiv: {
    height: "10%",
    backgroundColor: "#fff"
  },
  classroomText: {
    fontSize: 18,
    color: "black"
  },
  idText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black"
  }
});
