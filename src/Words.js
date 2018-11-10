import React, { Component } from "react";
import Swipeout from "react-native-swipeout";
import { View, Text, StyleSheet } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import Dialog from "react-native-dialog";
import { connect } from "react-redux";
import { addWord, editWord, removeWord } from "./actions/index.js";
import ClusterWS from "clusterws-client-js";
import Voice from "react-native-voice";

class Words extends Component {
  constructor(props) {
    super(props);
    this.state = {
      className: props.navigation.getParam("className"),
      classCode: props.navigation.getParam("classCode"),
      classId: props.navigation.getParam("classId"),
      wordBankName: props.navigation.getParam("wordBankName"),
      wordBankId: props.navigation.getParam("wordBankId"),
      addingDialog: false,
      currentWord: {},
      editingDialog: false,
      newWordName: "",
      speechText: ""
    };
    this.handleWordAdd = this.handleWordAdd.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleWordBankStartEdit = this.handleWordStartEdit.bind(this);
    this.handleWordEdit = this.handleWordEdit.bind(this);
    Voice.onSpeechStart = this.onSpeechStartHandler.bind(this);
    Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
    Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResultsHandler.bind(this);
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
        )}/${navigation.getParam("wordBankName")}`}</Text>
      ),
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

  handleWordAdd() {
    if (this.state.newWordName === "")
      return this.setState({ dialogError: true });

    const { wordbank } = this.props.match.params;
    this.props.dispatch(addWord(wordbank, this.state.newWordName));
    this.setState({ addingDialog: false, newWordName: "" });
  }

  handleWordStartEdit(currentWord) {
    this.setState({ editingDialog: true, currentWord });
  }

  handleWordEdit() {
    if (this.state.newWordName === "")
      return this.setState({ dialogError: true });

    const id = this.state.currentWord.id,
      name = this.state.newWordName;
    this.props.dispatch(editWord(id, name));
    this.setState({ editingDialog: false });
  }

  handleWordRemove(word) {
    const { wordBankId, id } = word;
    this.props.dispatch(removeWord(wordBankId, id));
  }

  handleDialogOpen = () => this.setState({ addingDialog: true });

  handleDialogClose() {
    this.setState({
      addingDialog: false,
      editingDialog: false,
      newWordName: ""
    });
  }

  onSwipeOpen(rowID) {
    this.setState({ rowID });
  }
  onSwipeClose(rowID) {
    if (rowID === this.state.rowID) this.setState({ rowID: null });
  }

  componentDidMount() {
    this.props.navigation.setParams({ openDialog: this.openDialog });
    let classID = this.state.classId;
    console.log(`Voice ClassID: ${classID}`);
    this.socket = new ClusterWS({
      url: "wss://temp-vocacoord.herokuapp.com/"
    });
    this.socket.on("connect", () => {
      console.log("connected to the socket");
      /* this is for testing, only the student app will be subscribing to and watching the channel in prod. */
      this.channel = this.socket.subscribe(classID);
      this.channel.watch(msg => {
        console.log(`heard this message: ${msg}`);
      });
    });
    this.socket.on("error", err => {
      console.error("error: ", err);
    });
    this.socket.on("disconnect", (code, reason) => {
      console.log(`disconnected with code ${code} and reason ${reason}`);
      this.channel.unsubscribe();
    });
  }

  componentWillUnmount() {
    if (this.socket) this.socket.disconnect();
  }

  onSpeechStartHandler(e) {
    console.log("starting voice activity:", e);
  }

  onSpeechEndHandler(e) {
    console.log("ending voice activity:", e);
  }

  onSpeechResultsHandler(e) {
    console.log("final voice results:", e);
    this.toStudent(e.value[0]);
  }

  onSpeechPartialResultsHandler(e) {
    console.log("partial voice results:", e);
    this.toStudent(e.value[0]);
  }

  toStudent(newSpeechString) {
    const oldString = this.state.speechText.toLowerCase().split(" ");
    const newString = newSpeechString.toLowerCase().split(" ");
    let newWords = [];

    const { wordbanks, words } = this.props;
    const wordBankId = this.props.navigation.getParam("wordBankId");
    const wordIds = wordbanks[wordBankId] ? wordbanks[wordBankId].words : [];
    const wordbank = wordIds.map(word => words[word]);

    for (let i = 0; i < newString.length; i++) {
      if (i < oldString.length && !oldString.includes(newString[i])) {
        newWords.push(newString[i]);
      } else if (i >= oldString.length) {
        newWords.push(newString[i]);
      }
    }

    console.log(`Old String: ${oldString}`);
    console.log(`New String: ${newString}`);
    console.log(`New words to potentially publish: ${newWords}`);

    newWords.forEach(word => {
      wordbank.forEach(wordBankWord => {
        if (wordBankWord.name === word) console.log(`Publishing ${word}`);
      });
    });

    this.setState({ speechText: newSpeechString });
  }

  render() {
    const { wordbanks, words } = this.props;
    const wordbank = this.props.navigation.getParam("wordBankId");
    const wordIds = wordbanks[wordbank] ? wordbanks[wordbank].words : [];
    const wordList = wordIds.map(word => words[word]);
    return (
      <View>
        <Dialog.Container visible={this.state.addingDialog}>
          <Dialog.Input
            label="Word Name"
            onChangeText={newWordName => this.setState({ newWordName })}
          />
          <Dialog.Button label="Cancel" onPress={this.handleDialogClose} />
          <Dialog.Button label="Okay" onPress={this.handleWordAdd} />
        </Dialog.Container>
        <Dialog.Container visible={this.state.editingDialog}>
          <Dialog.Input
            label="Word Name"
            onChangeText={newWordName => this.setState({ newWordName })}
          />
          <Dialog.Button label="Cancel" onPress={this.handleDialogClose} />
          <Dialog.Button label="Change" onPress={this.handleWordEdit} />
        </Dialog.Container>
        {wordList.length > 0 &&
          wordList.map((word, i) => (
            <Swipeout
              right={[
                {
                  text: <Icon name="edit" size={25} color="white" />,
                  onPress: () => this.handleWordStartEdit(word)
                },
                {
                  text: <Icon name="delete" size={25} color="white" />,
                  backgroundColor: "#ff0000",
                  onPress: () => this.handleWordRemove(word)
                }
              ]}
              onOpen={(sectionID, rowID) => this.onSwipeOpen(rowID)}
              close={this.state.rowID !== i}
              onClose={(sectionID, rowID) => this.onSwipeClose(rowID)}
              key={i}
              rowID={i}
            >
              <View>
                <ListItem
                  title={word.name}
                  hideChevron={true}
                  subtitle={
                    word.definition ? `Definition: ${word.definition}` : null
                  }
                />
              </View>
            </Swipeout>
          ))}
        {wordList.length === 0 && (
          <View style={styles.container}>
            <Text>
              It looks like you haven't added any words yet, {"\n"}
              click the + above to start adding words
            </Text>
          </View>
        )}
        <View style={styles.micButton}>
          <Icon
            name="mic"
            onPress={() => Voice.start("en-US")}
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
  },
  micButton: {
    flexDirection: "row-reverse",
    alignSelf: "flex-end",
    bottom: 0,
    position: "absolute"
  }
});

const mapStateToProps = state => {
  return {
    wordbanks: state.userData.wordbanks,
    words: state.userData.words
  };
};

export default connect(mapStateToProps)(Words);
