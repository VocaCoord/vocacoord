import React from "react";
import Swipeout from 'react-native-swipeout';
import { View, Text, StyleSheet, AsyncStorage } from "react-native";
import { ListItem, Button, Icon } from "react-native-elements";
import Dialog from "react-native-dialog";

export class WordBanks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      className: props.navigation.getParam('className'),
      classID: props.navigation.getParam('classID'),
      wordBankID: 0,
      showDialog: false,
      wordBankName: "",
      wordBanks: [],
      message: 'Looking for your word banks...',
	  rowID: null
    };
    this.updateWords = this.updateWords.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({ openDialog: this.openDialog });
    
    AsyncStorage.getItem('wordBanks')
      .then(r => {
        if (r !== null) {
          const { wordBankID, wordBanks } = JSON.parse(r)
          this.setState({ wordBankID, wordBanks });
        } else {
          const message = "It looks like you haven't added a word bank yet,\nclick the + above to start adding word banks"
          this.setState({ message });
        }
      })
      .catch(e => {
        console.log(e);
      });

  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <Text>{`${navigation.getParam('className')}/${navigation.getParam('classID')}`}</Text>,
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

  addWordBank = name => {
    const date = new Date();
    const dateString = `Created on ${date.getDate()}/${date.getMonth() +
      1}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}`;
    const wordBankID = this.state.wordBankID + 1;
    const wordBank = {
      id: wordBankID,
      name: name,
      createdAt: dateString,
      words: []
    };
    wordBanks = this.state.wordBanks;
    wordBanks.unshift(wordBank);
    this.setState({ wordBanks, wordBankID }, () => this.storeWordBanks());
    this.closeDialog();
  };

  storeWordBanks = async () => {
    await AsyncStorage
      .setItem('wordBanks', JSON.stringify(this.state))
      .catch(e => console.log(e));
  }

  updateWords = (id, words) => {
    let wordBanks = this.state.wordBanks;
    for (let i in wordBanks) {
      if (wordBanks[i].id === id) {
        wordBanks[i].words = words;
        this.setState({ wordBanks }, () => this.storeWordBanks());
        return;
      }
    }
  }

  openDialog = () => this.setState({ showDialog: true });

  closeDialog = () => this.setState({ showDialog: false, wordBankName: "" });

  deleteWordBank = index => {
	const wordBanks = [...this.state.wordBanks];
	wordBanks.splice(index, 1);
	this.setState({ wordBanks, rowID: null }, () => this.storeWordBanks());
  }

  onSwipeOpen (rowID) {
		this.setState({ rowID })
	}
  onSwipeClose(rowID) {
		if (rowID === this.state.rowID) this.setState({ rowID: null });
	}
  
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Dialog.Container visible={this.state.showDialog}>
          <Dialog.Input
            label="Word Bank Name"
            onChangeText={wordBankName => this.setState({ wordBankName })}
          />
          <Dialog.Button
            label="Cancel"
            onPress={() => this.closeDialog()}
          />
          <Dialog.Button
            label="Okay"
            onPress={() => this.addWordBank(this.state.wordBankName)}
          />
        </Dialog.Container>
        {
          this.state.wordBanks.length > 0 &&
          this.state.wordBanks.map((wordBank, i) => {
            return (
			<Swipeout right={[{
				text: 'Edit'
			},
			{
				text: 'Delete',
				backgroundColor: '#ff0000',
				onPress: () => this.deleteWordBank(i)
				}]}
				key={i}
				onOpen={(sectionID, rowID) => this.onSwipeOpen(rowID)}
				close={this.state.rowID !== i}
				onClose={(sectionID, rowID) => this.onSwipeClose(rowID)}
				rowID={i}
			>
			<View>
              <ListItem
                title={wordBank.name}
                subtitle={wordBank.createdAt ? wordBank.createdAt : null}
                onPress={() => navigate('WordBank', { wordBank, updateWords: this.updateWords })}
              />
			  </View>
			  </Swipeout>
            )
          })
        }
        {
          this.state.wordBanks.length == 0 &&
          <View style={styles.container}>
            <Text>{this.state.message} </Text>
          </View>
        }
      </View>
    );
  }
}

export class WordBank extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    const { id, name, createdAt, words } = navigation.getParam('wordBank');

    this.state = {
      id,
      name,
      createdAt,
      words,
      wordName: '',
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
    const updateWords = this.props.navigation.getParam('updateWords');
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
	const updateWords = this.props.navigation.getParam('updateWords');
	words.splice(index, 1);
	this.setState({ words, rowID: null }, () => updateWords());
  }

  onSwipeOpen (rowID) {
		this.setState({ rowID })
	}
  onSwipeClose(rowID) {
		if (rowID === this.state.rowID) this.setState({ rowID: null });
	}

  componentDidMount() {
    this.props.navigation.setParams({ openDialog: this.openDialog });
  }

  render() {
    return (
      <View>
        <Dialog.Container visible={this.state.showDialog}>
          <Dialog.Input
            label="Word Name"
            onChangeText={wordName => this.setState({ wordName })}
          />
          <Dialog.Button
            label="Cancel"
            onPress={() => this.closeDialog()}
          />
          <Dialog.Button
            label="Okay"
            onPress={() => this.addWord(this.state.id, this.state.wordName)}
          />
        </Dialog.Container>
        {
          this.state.words.length > 0 ? (
          this.state.words.map((word, i) => (
		  ////
			<Swipeout right={[{
				text: 'Edit'
			}
			,{
				text: 'Delete',
				backgroundColor: '#ff0000',
				onPress: () => this.deleteWord(i)
				}]}
				onOpen={(sectionID, rowID) => this.onSwipeOpen(rowID)}
				close={this.state.rowID !== i}
				onClose={(sectionID, rowID) => this.onSwipeClose(rowID)}
				rowID={i}
			>
			<View>
            <ListItem
              key={i}
              title={word}
              hideChevron={true}
            />
		</View>
		</Swipeout>
			//////
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
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
