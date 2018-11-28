import React, { Component } from "react";
import Swipeout from "react-native-swipeout";
import { View, Text, StyleSheet } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import Dialog from "react-native-dialog";
import { connect } from "react-redux";
import { addBank, editBank, removeBank } from "./actions/index.js";

class WordBanks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      className: props.navigation.getParam("className"),
      classCode: props.navigation.getParam("classCode"),
      classId: props.navigation.getParam("classId"),
      addingDialog: false,
      currentWordBank: {
        name: ""
      },
      editingDialog: false,
      rowId: null
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleDialogOpen: this.handleDialogOpen
    });
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text>{`${navigation.getParam("classCode")}/${navigation.getParam(
          "className"
        )}`}</Text>
      ),
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

  handleWordBankAdd = () => {
    if (this.state.currentWordBank.name === "")
      return this.setState({ dialogError: true });

    const { classId, currentWordBank } = this.state;

    this.props.dispatch(addBank(classId, currentWordBank.name));
    this.handleDialogClose();
  };

  handleWordBankStartEdit = currentWordBank => {
    this.setState({
      editingDialog: true,
      currentWordBank: { ...currentWordBank }
    });
  };

  handleWordBankEdit = () => {
    const { id, name } = this.state.currentWordBank;

    this.props.dispatch(editBank(id, name));
    this.handleDialogClose();
  };

  handleWordBankRemove = wordBank => {
    const { classId, id } = wordBank;
    this.props.dispatch(removeBank(classId, id));
  };

  handleDialogOpen = () => this.setState({ addingDialog: true });

  handleDialogClose = () => {
    this.setState({
      addingDialog: false,
      dialogError: false,
      editingDialog: false,
      currentWordBank: {
        name: ""
      }
    });
  };

  handleDialogTextChange = newValue => {
    const { currentWordBank } = this.state;
    this.setState({ currentWordBank: { ...currentWordBank, ...newValue } });
  };

  onSwipeOpen = (sectionId, rowId) => this.setState({ rowId });

  onSwipeClose = (sectionId, rowId) => {
    if (rowId === this.state.rowId) this.setState({ rowId: null });
  };

  render() {
    const { navigate } = this.props.navigation;
    const { navigation } = this.props;
    const { wordbanks, classrooms } = this.props;
    const classroom = this.state.classId;
    const wordBankIds = classrooms[classroom]
      ? classrooms[classroom].wordbanks
      : [];
    const wordBankList = wordBankIds.map(Id => {
      return wordbanks[Id];
    });

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Dialog.Container visible={this.state.addingDialog}>
          <Dialog.Input
            label="Word Bank Name"
            value={this.state.currentWordBank.name}
            onChangeText={name => this.handleDialogTextChange({ name })}
          />
          <Dialog.Button label="Cancel" onPress={this.handleDialogClose} />
          <Dialog.Button label="Add" onPress={this.handleWordBankAdd} />
        </Dialog.Container>
        <Dialog.Container visible={this.state.editingDialog}>
          <Dialog.Input
            label="Word Bank Name"
            value={this.state.currentWordBank.name}
            onChangeText={name => this.handleDialogTextChange({ name })}
          />
          <Dialog.Button label="Cancel" onPress={this.handleDialogClose} />
          <Dialog.Button label="Change" onPress={this.handleWordBankEdit} />
        </Dialog.Container>
        {wordBankList.length > 0 &&
          wordBankList.map((wordBank, i) => {
            return (
              <Swipeout
                right={[
                  {
                    text: <Icon name="edit" size={25} color="white" />,
                    onPress: () => this.handleWordBankStartEdit(wordBank)
                  },
                  {
                    text: <Icon name="delete" size={25} color="white" />,
                    backgroundColor: "#ff0000",
                    onPress: () => this.handleWordBankRemove(wordBank)
                  }
                ]}
                onOpen={this.onSwipeOpen}
                close={this.state.rowId !== i}
                autoClose={true}
                onClose={this.onSwipeClose}
                key={i}
                rowID={i}
              >
                <View>
                  <ListItem
                    title={wordBank.name}
                    containerStyle={{ backgroundColor: "#fff" }}
                    onPress={() =>
                      navigate("WordBank", {
                        className: navigation.getParam("className"),
                        classCode: navigation.getParam("classCode"),
                        classId: navigation.getParam("classId"),
                        wordBankName: wordBank.name,
                        wordBankId: wordBank.id
                      })
                    }
                  />
                </View>
              </Swipeout>
            );
          })}
        {wordBankList.length === 0 && (
          <View style={styles.container}>
            <Text>
              It looks like you haven't added any wordbanks yet,
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
  return {
    classrooms: state.userData.classrooms,
    wordbanks: state.userData.wordbanks
  };
};

export default connect(mapStateToProps)(WordBanks);
