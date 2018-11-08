import React, { Component } from "react";
import Swipeout from "react-native-swipeout";
import { View, Text, StyleSheet, AsyncStorage } from "react-native";
import { ListItem, Button, Icon, Divider } from "react-native-elements";
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
      currentWordBank: {},
      editingDialog: false,
      newWordBankName: "",
      rowID: null
    };
    this.handleWordBankAdd = this.handleWordBankAdd.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleWordBankStartEdit = this.handleWordBankStartEdit.bind(this);
    this.handleWordBankEdit = this.handleWordBankEdit.bind(this);
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

  handleWordBankAdd() {
    this.props.dispatch(
      addBank(this.state.classId, this.state.newWordBankName)
    );
    this.setState({ addingDialog: false, newWordBankName: "" });
  }
  handleWordBankStartEdit(currentWordBank) {
    this.setState({ editingDialog: true, currentWordBank });
  }

  handleWordBankEdit() {
    const id = this.state.currentWordBank.id,
      name = this.state.newWordBankName;
    this.props.dispatch(editBank(id, name));
    this.setState({ editingDialog: false });
  }

  handleWordBankRemove(wordBank) {
    const { classId, id } = wordBank;
    this.props.dispatch(removeBank(classId, id));
  }

  handleDialogOpen = () => this.setState({ addingDialog: true });

  handleDialogClose() {
    this.setState({
      addingDialog: false,
      dialogError: false,
      editingDialog: false,
      newWordBankName: ""
    });
  }

  onSwipeOpen(rowID) {
    this.setState({ rowID });
  }
  onSwipeClose(rowID) {
    if (rowID === this.state.rowID) this.setState({ rowID: null });
  }

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
      <View style={styles.background}>
        <Dialog.Container visible={this.state.showDialog}>
          <Dialog.Input
            label="Word Bank Name"
            onChangeText={newWordBankName => this.setState({ newWordBankName })}
          />
          <Dialog.Button label="Cancel" onPress={this.handleDialogClose} />
          <Dialog.Button label="Add" onPress={this.handleWordBankAdd} />
        </Dialog.Container>
        <Dialog.Container visible={this.state.editingDialog}>
          <Dialog.Input
            label="Word Bank Name"
            onChangeText={newWordBankName => this.setState({ newWordBankName })}
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
                key={i}
                onOpen={(sectionID, rowID) => this.onSwipeOpen(rowID)}
                close={this.state.rowID !== i}
                onClose={(sectionID, rowID) => this.onSwipeClose(rowID)}
                rowID={i}
              >
                <View>
                  <ListItem
                    title={wordBank.name}
                    style={styles.wordBankStyle}
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
            <Text>{this.state.message}</Text>
          </View>
        )}
      </View>
    );
  }
}

export class WordBank extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    const { id, name, createdAt, words } = navigation.getParam("wordBank");

    this.state = {
      id,
      name,
      createdAt,
      words,
      wordName: "",
      showDialog: false
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <Icon
          onPress={navigation.getParam("openDialog")}
          name="add"
          raised
          reverse
        />
      )
    };
  };

  addWord = (id, word) => {
    const updateWords = this.props.navigation.getParam("updateWords");
    words = this.state.words;
    words.unshift(word);
    updateWords(id, words);
    this.setState({ words });
    this.closeDialog();
  };

  openDialog = () => this.setState({ showDialog: true });

  closeDialog = () => this.setState({ showDialog: false, wordName: "" });

  deleteWord = index => {
    const words = [...this.state.words];
    const updateWords = this.props.navigation.getParam("updateWords");
    words.splice(index, 1);
    this.setState({ words, rowID: null }, () => updateWords());
  };

  onSwipeOpen(rowID) {
    this.setState({ rowID });
  }
  onSwipeClose(rowID) {
    if (rowID === this.state.rowID) this.setState({ rowID: null });
  }

  componentDidMount() {
    this.props.navigation.setParams({ openDialog: this.openDialog });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.background}>
        <Dialog.Container visible={this.state.showDialog}>
          <Dialog.Input
            label="Word Name"
            onChangeText={wordName => this.setState({ wordName })}
          />
          <Dialog.Button label="Cancel" onPress={() => this.closeDialog()} />
          <Dialog.Button
            label="Okay"
            onPress={() => this.addWord(this.state.id, this.state.wordName)}
          />
        </Dialog.Container>
        {this.state.words.length > 0 ? (
          this.state.words.map((word, i) => (
            <Swipeout
              right={[
                {
                  text: <Icon name="edit" size={25} color="white" />
                },
                {
                  text: <Icon name="delete" size={25} color="white" />,
                  backgroundColor: "#ff0000",
                  onPress: () => this.deleteWord(i)
                }
              ]}
              onOpen={(sectionID, rowID) => this.onSwipeOpen(rowID)}
              close={this.state.rowID !== i}
              onClose={(sectionID, rowID) => this.onSwipeClose(rowID)}
              rowID={i}
            >
              <View>
                <ListItem key={i} title={word} hideChevron={true} />
              </View>
            </Swipeout>
          ))
          ) : (
            <View style={styles.container}>
              <Text>
                It looks like you haven't any words yet, {"\n"}
                click the + above to start adding words
              </Text>
            </View>
          )
        }
		<View style={styles.micButton}>
            <Icon name="mic"
            onPress={() => navigate("VoiceDemo")}
				raised
				reverse
				size={50}
				/>
		  </View>
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
	flexGrow: 1,
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
  return {
    classrooms: state.userData.classrooms,
    wordbanks: state.userData.wordbanks
  };
};

export default connect(mapStateToProps)(WordBanks);
