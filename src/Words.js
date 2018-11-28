import React, { Component } from "react";
import Swipeout from "react-native-swipeout";
import { View, Text, StyleSheet, AppState, ScrollView } from "react-native";
import { ListItem, Icon, Avatar } from "react-native-elements";
import { Snackbar } from "react-native-paper";
import Dialog from "react-native-dialog";
import { connect } from "react-redux";
import { addWord, editWord, removeWord } from "./actions/index.js";
import ClusterWS from "clusterws-client-js";
import Voice from "react-native-voice";
import ImagePicker from "react-native-image-picker";
import * as Animatable from "react-native-animatable";

let isMounted = false;
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
      currentWord: {
        name: "",
        definition: "",
        image: ""
      },
      dialogError: false,
      editingDialog: false,
      lastSpeech: "",
      isConnectingSnack: false,
      isConnecting: false,
      socketDisconnected: false,
      socketDisconnectedSnack: false,
      socketShutDown: false,
      socketShutDownSnack: false,
      rowId: null
    };
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
    if (this.state.currentWord.name === "")
      return this.setState({ dialogError: true });

    const { wordBankId, currentWord } = this.state;

    this.props.dispatch(addWord(wordBankId, currentWord));
    this.handleDialogClose();
  };

  handleWordStartEdit = currentWord => {
    this.setState({ editingDialog: true, currentWord: { ...currentWord } });
  };

  handleWordEdit = () => {
    if (this.state.currentWord.name === "")
      return this.setState({ dialogError: true });

    const { id } = this.state.currentWord;
    this.props.dispatch(editWord(id, this.state.currentWord));
    this.handleDialogClose();
  };

  handleWordRemove = word => {
    const { wordBankId, id } = word;
    this.props.dispatch(removeWord(wordBankId, id));
  };

  handleDialogOpen = () => this.setState({ addingDialog: true });

  handleDialogClose = () => {
    this.setState({
      addingDialog: false,
      dialogError: false,
      editingDialog: false,
      currentWord: {
        name: "",
        definition: "",
        image: ""
      }
    });
  };

  handleDialogTextChange = newValue => {
    const { currentWord } = this.state;
    this.setState({ currentWord: { ...currentWord, ...newValue } });
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
        if (resp.data) {
          const { currentWord } = this.state;
          currentWord.image = `data:image/jpeg;base64,${resp.data}`;
          this.setState({ currentWord });
        }
      }
    );

  onSwipeOpen = (sectionId, rowId) => this.setState({ rowId });

  onSwipeClose = (sectionId, rowId) => {
    if (rowId === this.state.rowId) this.setState({ rowId: null });
  };

  handleAppStateChange = nextAppState => {
    if (
      this.state.appState === "active" &&
      nextAppState.match(/inactive|background/)
    ) {
      isMounted = true;
      this.closeSocket();
    }

    this.setState({ appState: nextAppState });
  };

  openSocket = () => {
    const { classCode } = this.state;
    if (this.socket && this.socket.disconnect) this.socket.disconnect();
    this.socket = new ClusterWS({
      url: "wss://temp-vocacoord.herokuapp.com/"
    });
    this.socket.on("connect", () => {
      console.log("connected to socket");
      setTimeout(
        () =>
          this.setState({
            socketDisconnected: false,
            socketDisconnectedSnack: false,
            socketShutDown: false,
            socketShutDownSnack: false,
            isConnecting: false,
            isConnectingSnack: false
          }),
        2000
      );
      this.channel = this.socket.subscribe(classCode);
      //AppState.addEventListener("change", this.handleAppStateChange);

      this.socket.on("error", err => {
        console.log("socket error", err);
        if (isMounted)
          this.setState({ socketShutDown: true, socketShutDownSnack: true });
        if (this.channel && this.channel.unsubscribe)
          this.channel.unsubscribe();
      });
      this.socket.on("disconnect", (code, reason) => {
        console.log("closing socket", isMounted);
        if (isMounted)
          this.setState({ socketDisconnected: true, socketDisconnected: true });
        if (this.channel && this.channel.unsubscribe)
          this.channel.unsubscribe();
      });
    });
  };

  closeSocket = () => {
    //AppState.removeEventListener("change", this.handleAppStateChange);
    if (this.socket && this.socket.disconnect) this.socket.disconnect();
    this.socket = null;
  };

  componentDidMount() {
    this.props.navigation.setParams({
      handleDialogOpen: this.handleDialogOpen
    });
    this.setState({ isConnectingSnack: true, isConnecting: true });
    isMounted = true;
    this.openSocket();
  }

  componentWillUnmount() {
    isMounted = false;
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
    this.sendToStudent(e.value[0]);
  }

  sendToStudent = nextSpeech => {
    const lastWords = this.state.lastSpeech.toLowerCase().split(" ");
    const nextWords = nextSpeech.toLowerCase().split(" ");

    const { wordbanks, words } = this.props;
    const { wordBankId } = this.state;
    const wordIds = wordbanks[wordBankId] ? wordbanks[wordBankId].words : [];
    const wordbank = wordIds.map(wordId => words[wordId]);
    const wordBankWords = wordbank.map(word => word.name.toLowerCase());

    nextWords.forEach((nextWord, i) => {
      if (lastWords[i] === nextWord) return;
      const wordIndex = wordBankWords.indexOf(nextWord);
      if (wordIndex !== -1) this.channel.publish(wordbank[wordIndex]);
    });

    this.setState({ lastSpeech: nextSpeech });
  };

  render() {
    const { wordbanks, words } = this.props;
    const wordbank = this.props.navigation.getParam("wordBankId");
    const wordIds = wordbanks[wordbank] ? wordbanks[wordbank].words : [];
    const wordList = wordIds.map(word => words[word]);

    const { socketDisconnected, socketShutDown, isConnecting } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Dialog.Container visible={this.state.addingDialog}>
          <Dialog.Input
            label="Word Name"
            value={this.state.currentWord.name}
            onChangeText={name => this.handleDialogTextChange({ name })}
          />
          <Dialog.Input
            label="Word Definition"
            value={this.state.currentWord.definition}
            onChangeText={definition =>
              this.handleDialogTextChange({ definition })
            }
          />
          <Dialog.Button label="Add Photo" onPress={this.handleSelectImage} />
          <Dialog.Button label="Cancel" onPress={this.handleDialogClose} />
          <Dialog.Button label="Okay" onPress={this.handleWordAdd} />
        </Dialog.Container>
        <Dialog.Container visible={this.state.editingDialog}>
          <Dialog.Input
            label="Word Name"
            value={this.state.currentWord.name}
            onChangeText={name => this.handleDialogTextChange({ name })}
          />
          <Dialog.Input
            label="Word Definition"
            value={this.state.currentWord.definition}
            onChangeText={definition =>
              this.handleDialogTextChange({ definition })
            }
          />
          <Dialog.Button label="Edit Photo" onPress={this.handleSelectImage} />
          <Dialog.Button label="Cancel" onPress={this.handleDialogClose} />
          <Dialog.Button label="Change" onPress={this.handleWordEdit} />
        </Dialog.Container>
        {wordList.length > 0 && (
          <ScrollView>
            {wordList.map((word, i) => (
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
                onOpen={this.onSwipeOpen}
                close={this.state.rowId !== i}
                autoClose={true}
                onClose={this.onSwipeClose}
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
          </ScrollView>
        )}
        {wordList.length === 0 && (
          <View style={styles.container}>
            <Text>
              It looks like you haven't added any words yet, {"\n"}
              click the + above to start adding words
            </Text>
          </View>
        )}
        {!socketDisconnected && !socketShutDown && !isConnecting && (
          <View style={styles.micButton}>
            <Icon
              name="mic"
              onPress={() => Voice.start("en-US")}
              raised
              reverse
              size={50}
            />
          </View>
        )}
        {socketDisconnected && (
          <View style={styles.micButton}>
            <Icon
              name="autorenew"
              onPress={() => this.openSocket()}
              raised
              reverse
              size={50}
            />
          </View>
        )}
        {socketShutDown && (
          <View style={styles.micButton}>
            <Icon
              name="cloud-off"
              onPress={() => this.openSocket()}
              raised
              reverse
              size={50}
            />
          </View>
        )}
        {isConnecting && (
          <Animatable.View
            style={styles.micButton}
            animation="rotate"
            easing="linear"
            iterationCount="infinite"
            duration={7000}
            useNativeDriver
          >
            <Icon name="autorenew" raised reverse size={50} />
          </Animatable.View>
        )}
        <Snackbar
          visible={this.state.socketDisconnectedSnack}
          onDismiss={() => this.setState({ socketDisconnectedSnack: false })}
        >
          You disconnected. Hit the button to try to reconnect.
        </Snackbar>
        <Snackbar
          visible={this.state.socketShutDownSnack}
          onDismiss={() => this.setState({ socketShutDownSnack: false })}
        >
          Something went wrong. Hit the button to try to reconnect.
        </Snackbar>
        <Snackbar
          visible={this.state.isConnectingSnack}
          onDismiss={() => this.setState({ isConnectingSnack: false })}
        >
          Hold on while we connect you to the server.
        </Snackbar>
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
    position: "absolute",
    zIndex: 2
  }
});

const mapStateToProps = state => {
  return {
    wordbanks: state.userData.wordbanks,
    words: state.userData.words
  };
};

export default connect(mapStateToProps)(Words);
