import React, { Component } from "react";
import Swipeout from "react-native-swipeout";
import { View, Text, StyleSheet, AppState } from "react-native";
import { ListItem, Icon, Avatar } from "react-native-elements";
import Dialog from "react-native-dialog";
import { connect } from "react-redux";
import { addWord, editWord, removeWord } from "./actions/index.js";
import ClusterWS from "clusterws-client-js";
import Voice from "react-native-voice";
import ImagePicker from "react-native-image-picker";
import SnackBar from "react-native-snackbar-component";

class Words extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      className: props.navigation.getParam("className"),
      classCode: props.navigation.getParam("classCode"),
      classId: props.navigation.getParam("classId"),
      wordBankName: props.navigation.getParam("wordBankName"),
      wordBankId: props.navigation.getParam("wordBankId"),
      addingDialog: false,
      currentWord: {},
      editingDialog: false,
      newWordName: "",
      newWordDefinition: "",
      newWordImage: "",
      lastSpeech: "",
      socketDisconnected: false
    };
    this.handleWordBankStartEdit = this.handleWordStartEdit.bind(this);
    Voice.onSpeechStart = this.onSpeechStartHandler.bind(this);
    Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
    Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResultsHandler.bind(
      this
    );
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
          onPress={navigation.getParam("handleDialogOpen")}
          name="add"
          raised
          reverse
        />
      )
    };
  };

  handleWordAdd = () => {
    if (this.state.newWordName === "")
      return this.setState({ dialogError: true });

    const {
      wordBankId,
      newWordName,
      newWordDefinition,
      newWordImage
    } = this.state;
    const word = {
      name: newWordName,
      definition: newWordDefinition,
      image: newWordImage
    };
    this.props.dispatch(addWord(wordBankId, word));
    this.handleDialogClose();
  };

  handleWordStartEdit(currentWord) {
    this.setState({ editingDialog: true, currentWord });
  }

  handleWordEdit = () => {
    if (this.state.newWordName === "")
      return this.setState({ dialogError: true });

    const id = this.state.currentWord.id;
    const { newWordName, newWordDefinition, newWordImage } = this.state;
    const word = {
      name: newWordName,
      definition: newWordDefinition,
      image: newWordImage
    };
    this.props.dispatch(editWord(id, word));
    this.handleDialogClose();
  };

  handleWordRemove(word) {
    const { wordBankId, id } = word;
    this.props.dispatch(removeWord(wordBankId, id));
  }

  handleDialogOpen = () => this.setState({ addingDialog: true });

  handleDialogClose = () => {
    this.setState({
      addingDialog: false,
      editingDialog: false,
      newWordName: "",
      newWordDefinition: "",
      newWordImage: ""
    });
  };

  handleSelectImage = () =>
    ImagePicker.showImagePicker(
      {
        mediaType: "photo",
        quality: 1.0,
        maxHeight: 500,
        maxWidth: 500
      },
      resp => {
        if (resp.data)
          this.setState({
            newWordImage: `data:image/jpeg;base64,${resp.data}`
          });
      }
    );

  onSwipeOpen(rowID) {
    this.setState({ rowID });
  }
  onSwipeClose(rowID) {
    if (rowID === this.state.rowID) this.setState({ rowID: null });
  }

  handleAppStateChange = nextAppState => {
    if (
      this.state.appState === "active" &&
      nextAppState.match(/inactive|background/)
    ) {
      this.closeSocket();
    }

    this.setState({ appState: nextAppState });
  };

  openSocket = () => {
    AppState.addEventListener("change", this.handleAppStateChange);
    const { classCode } = this.state;
    this.socket = new ClusterWS({
      url: "wss://temp-vocacoord.herokuapp.com/"
    });
    this.socket.on("connect", () => {
      console.log("connected to socket");
      this.setState({ socketDisconnected: false });
      this.channel = this.socket.subscribe(classCode);
    });
    this.socket.on("error", err => {
      console.error("error: ", err);
    });
    this.socket.on("disconnect", (code, reason) => {
      console.log("closing socket");
      this.setState({ socketDisconnected: true });
      this.channel.unsubscribe();
    });
  };

  closeSocket = () => {
    AppState.removeEventListener("change", this.handleAppStateChange);
    if (this.socket) this.socket.disconnect();
  };

  componentDidMount() {
    this.props.navigation.setParams({
      handleDialogOpen: this.handleDialogOpen
    });
    this.openSocket();
  }

  componentWillUnmount() {
    this.closeSocket();
  }

  onSpeechStartHandler(e) {
    console.log("starting voice activity:", e);
  }

  onSpeechEndHandler(e) {
    console.log("ending voice activity:", e);
  }

  onSpeechResultsHandler(e) {
    console.log("final voice results:", e);
    this.sendToStudent(e.value[0]);
  }

  onSpeechPartialResultsHandler(e) {
    console.log("partial voice results:", e);
    this.sendToStudent(e.value[0]);
  }

  sendToStudent(nextSpeech) {
    const lastWords = this.state.lastSpeech.toLowerCase().split(" ");
    const nextWords = nextSpeech.toLowerCase().split(" ");

    const { wordbanks, words } = this.props;
    const { wordBankId } = this.state;
    const wordIds = wordbanks[wordBankId] ? wordbanks[wordBankId].words : [];
    const wordbank = wordIds.map(wordId => words[wordId]);
    const wordBankWords = wordbank.map(word => word.name.toLowerCase());

    nextWords.forEach(nextWord => {
      if (lastWords.includes(nextWord)) return;
      const wordIndex = wordBankWords.indexOf(nextWord);
      if (wordIndex !== -1) this.channel.publish(wordbank[wordIndex]);
    });

    this.setState({ lastSpeech: nextSpeech });
  }

  render() {
    const { wordbanks, words } = this.props;
    const wordbank = this.props.navigation.getParam("wordBankId");
    const wordIds = wordbanks[wordbank] ? wordbanks[wordbank].words : [];
    const wordList = wordIds.map(word => words[word]);
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Dialog.Container visible={this.state.addingDialog}>
          <Dialog.Input
            label="Word Name"
            onChangeText={newWordName => this.setState({ newWordName })}
          />
          <Dialog.Input
            label="Word Definition"
            onChangeText={newWordDefinition =>
              this.setState({ newWordDefinition })
            }
          />
          <Dialog.Button label="Add Photo" onPress={this.handleSelectImage} />
          <Dialog.Button label="Cancel" onPress={this.handleDialogClose} />
          <Dialog.Button label="Okay" onPress={this.handleWordAdd} />
        </Dialog.Container>
        <Dialog.Container visible={this.state.editingDialog}>
          <Dialog.Input
            label="Word Name"
            onChangeText={newWordName => this.setState({ newWordName })}
          />
          <Dialog.Input
            label="Word Definition"
            onChangeText={newWordDefinition =>
              this.setState({ newWordDefinition })
            }
          />
          <Dialog.Button label="Edit Photo" onPress={this.handleSelectImage} />
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
              autoClose={true}
              onClose={(sectionID, rowID) => this.onSwipeClose(rowID)}
              key={i}
              rowID={i}
            >
              <View>
                <ListItem
                  title={word.name}
                  hideChevron={true}
                  subtitle={
                    word.definition !== ""
                      ? `Definition: ${word.definition}`
                      : null
                  }
                  avatar={
                    word.image !== "" && (
                      <Avatar large source={{ uri: word.image }} />
                    )
                  }
                  containerStyle={{ backgroundColor: "#fff" }}
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
          {this.state.socketDisconnected ? (
            <Icon
              name="autorenew"
              onPress={() => this.openSocket()}
              raised
              reverse
              size={50}
            />
          ) : (
            <Icon
              name="mic"
              onPress={() => Voice.start("en-US")}
              raised
              reverse
              size={50}
            />
          )}
        </View>
        <SnackBar
          visible={this.state.socketDisconnected}
          textMessage="You disconnected. Hit the button to reconnect."
        />
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
