import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { ListItem, Icon } from "react-native-elements";
import { connect } from "react-redux";
import Swipeout from "react-native-swipeout";
import { addClass, editClass, removeClass } from "./actions/index.js";
import Dialog from "react-native-dialog";

let api = "https://temp-vocacoord.herokuapp.com/api/";

class ClassroomScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addingDialog: false,
      rowId: null
    };
    this.handleClassroomAdd = this.handleClassroomAdd.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  componentWillMount() {
    this.props.navigation.addListener("didFocus", () =>
      this.props.navigation.getParam("callback")()
    );
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleDialogOpen: this.handleDialogOpen
    });
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <Icon
          onPress={navigation.getParam("handleDialogOpen")}
          name="add"
          raised
          reverse
        />
      )
    };
  };

  handleDialogOpen = () => this.setState({ addingDialog: true });

  handleDialogClose = () =>
    this.setState({ addingDialog: false, newClassName: "" });

  handleClassroomAdd() {
    this.setState({ addingDialog: false });
    fetch(api + "create", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(json => {
        const code = json.classID,
          name = this.state.newClassName;
        this.props.dispatch(addClass(code, name));
        this.setState({
          newClassName: ""
        });
      });
  }

  handleClassroomEdit(classroom) {}

  handleClassroomRemove(classroom) {
    this.props.dispatch(removeClass(classroom.id));
  }

  onSwipeOpen(rowId) {
    this.setState({ rowId });
  }

  onSwipeClose(rowId) {
    if (rowId === this.state.rowId) this.setState({ rowId: null });
  }

  render() {
    const { navigate } = this.props.navigation;
    const { classrooms } = this.props;
    const classList = Object.keys(classrooms).map(key => classrooms[key]);

    return (
      <View>
        <Dialog.Container visible={this.state.addingDialog}>
          <Dialog.Input
            label="Classroom Name"
            onChangeText={newClassName => this.setState({ newClassName })}
          />
          <Dialog.Button label="Cancel" onPress={this.handleDialogClose} />
          <Dialog.Button label="Add" onPress={this.handleClassroomAdd} />
        </Dialog.Container>
        {classList.length > 0 &&
          classList.map((classroom, i) => {
            console.log(classroom, classroom.name);
            return (
              <Swipeout
                right={[
                  {
                    text: <Icon name="edit" size={25} color="white" />,
                    onPress: () => this.handleClassroomEdit(classroom)
                  },
                  {
                    text: <Icon name="delete" size={25} color="white" />,
                    backgroundColor: "#ff0000",
                    onPress: () => this.handleClassroomRemove(classroom)
                  }
                ]}
                key={i}
                onOpen={(sectionId, rowId) => this.onSwipeOpen(rowId)}
                close={this.state.rowId !== i}
                onClose={(sectionId, rowId) => this.onSwipeClose(rowId)}
                rowID={i}
              >
                <View>
                  <ListItem
                    title={classroom.name}
                    style={styles.wordBankStyle}
                    onPress={() => navigate("WordBanks")}
                  />
                </View>
              </Swipeout>
            );
          })}
        {classList.length === 0 && (
          <View style={styles.container}>
            <Text>
              It looks like you haven't any classrooms yet,
              {"\n"}
              click the + below to start adding classrooms
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  wordBankStyle: {
    backgroundColor: "#fff"
  },
  filler: {
    height: "50%",
    backgroundColor: "#fff"
  }
});

const mapStateToProps = state => {
  const classrooms = state.userData.classrooms || {};
  return {
    classrooms
  };
};

export default connect(mapStateToProps)(ClassroomScreen);
