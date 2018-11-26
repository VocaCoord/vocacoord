import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
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
      currentClass: {},
      editingDialog: false,
      rowId: null
    };
    this.handleClassroomAdd = this.handleClassroomAdd.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleClassroomStartEdit = this.handleClassroomStartEdit.bind(this);
    this.handleClassroomEdit = this.handleClassroomEdit.bind(this);
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
    this.setState({
      addingDialog: false,
      newClassName: "",
      editingDialog: false,
      rowId: null
    });

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
        this.handleDialogClose();
      });
  }

  handleClassroomStartEdit(currentClass) {
    this.setState({ editingDialog: true, currentClass });
  }

  handleClassroomEdit() {
    const id = this.state.currentClass.id,
      name = this.state.newClassName;
    this.props.dispatch(editClass(id, name));

    this.handleDialogClose();
  }

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
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Dialog.Container visible={this.state.addingDialog}>
          <Dialog.Input
            label="Classroom Name"
            onChangeText={newClassName => this.setState({ newClassName })}
          />
          <Dialog.Button label="Cancel" onPress={this.handleDialogClose} />
          <Dialog.Button label="Add" onPress={this.handleClassroomAdd} />
        </Dialog.Container>
        <Dialog.Container visible={this.state.editingDialog}>
          <Dialog.Input
            label="Classroom Name"
            onChangeText={newClassName => this.setState({ newClassName })}
          />
          <Dialog.Button label="Cancel" onPress={this.handleDialogClose} />
          <Dialog.Button label="Change" onPress={this.handleClassroomEdit} />
        </Dialog.Container>
        {classList.length > 0 &&
          classList.map((classroom, i) => {
            return (
              <Swipeout
                right={[
                  {
                    text: <Icon name="edit" size={25} color="white" />,
                    onPress: () => this.handleClassroomStartEdit(classroom)
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
                autoClose={true}
                onClose={(sectionId, rowId) => this.onSwipeClose(rowId)}
                rowID={i}
              >
                <View>
                  <ListItem
                    title={classroom.name}
                    containerStyle={{ backgroundColor: "#fff" }}
                    onPress={() =>
                      navigate("WordBanks", {
                        className: classroom.name,
                        classCode: classroom.code,
                        classId: classroom.id
                      })
                    }
                  />
                </View>
              </Swipeout>
            );
          })}
        {classList.length === 0 && (
          <View style={styles.container}>
            <Text>
              It looks like you haven't added any classrooms yet,
              {"\n"}
              click the + above to add some.
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#fff",
    flex: 1
  },
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
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
