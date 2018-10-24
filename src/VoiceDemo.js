import React from "react";
import { View, Text, StyleSheet, AsyncStorage } from "react-native";
import { Button } from "react-native-paper";
import { Divider } from "react-native-elements";
import Voice from "react-native-voice";
import ClusterWS from "clusterws-client-js";

let api = "https://temp-vocacoord.herokuapp.com/api/";

export class VoiceDemo extends React.Component {
  constructor(props) {
    super(props);
    Voice.onSpeechStart = this.onSpeechStartHandler.bind(this);
    Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
    Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResultsHandler.bind(this);
	this.state = {
		speechText: '',
		wordBanks: [],
		message: ''
	}
  }

  componentDidMount() {
    fetch(api + "create", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json()).then(json => {
      let classID = json.classID;
      console.log(`Voice ClassID: ${classID}`);
	  this.socket = new ClusterWS({
        url: "wss://temp-vocacoord.herokuapp.com/"
      });
      this.socket.on('connect', () => {
        console.log('connected to the socket');
        /* this is for testing, only the student app will be subscribing to and watching the channel in prod. */
        this.channel = this.socket.subscribe(classID);
        this.channel.watch(msg => {
          console.log(`heard this message: ${msg}`);
        });
      });
      this.socket.on('error', (err) => {
        console.error('error: ', err);
      });
      this.socket.on('disconnect', (code, reason) => {
        console.log(`disconnected with code ${code} and reason ${reason}`);
        this.channel.unsubscribe();
      });
    });

	AsyncStorage.getItem('wordBanks')
       .then(r => {
		   if (r !== null) {
			   const { wordBanks } = JSON.parse(r)
			   this.setState({  wordBanks });
           } else {
			   const message = "Weird word bank error?"
			   this.setState({ message });
          }
        })
			.catch(e => {
			console.log(e);
        });

  }

  componentWillUnmount() {
    if (this.socket) this.socket.disconnect();
  }

  onSpeechStartHandler(e) {
    console.log('starting voice activity:', e)
  }

  onSpeechEndHandler(e) {
    console.log('ending voice activity:', e)
  }

  onSpeechResultsHandler(e) {
    console.log('final voice results:', e)
	this.toStudent((e.value[0]));
  }

  onSpeechPartialResultsHandler(e) {
    console.log('partial voice results:', e)
	this.toStudent(e.value[0]);
  }

  toStudent(newSpeechString){
	const oldString = this.state.speechText.toLowerCase().split(' ')
	const newString = newSpeechString.toLowerCase().split(' ')
	let newWords = []
	const wordbank = this.state.wordBanks[0].words.map(v => v.toLowerCase());

//	newString.forEach((word) => {
//		if(!oldString.includes(word))
//			newWords.push(word)
//	});

//	for(let i = oldString.length; i < newString.length; i++)
//		newWords.push(newString[i])

	for(let i = 0; i < newString.length;i++){
		if(i < oldString.length && !oldString.includes(newString[i])){
			newWords.push(newString[i]);
		}else if(i >= oldString.length){
			newWords.push(newString[i]);
		}
	}

	//Looking in word bank[0] for testing purposes
	console.log(`Old String: ${oldString}`);
	console.log(`New String: ${newString}`);
	console.log(`New words to potentially publish: ${newWords}`);
	
	newWords.forEach((word) => {
		if(wordbank.includes(word)){
			this.channel.publish(word)
			console.log(`Publishing ${word}`);
		}
	});

	this.setState({ speechText: newSpeechString });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.buttons}>
          <Button color="#ffa500" mode="contained" onPress={() => Voice.start('en-US')}>
            <Text style={styles.buttonText}>Listen</Text>
          </Button>
        </View>
		<Divider style={styles.buttonDiv}/>
        <View style={styles.buttons}>
          <Button color="#ffa500" mode="contained" onPress={() => Voice.stop()}>
            <Text style={styles.buttonText}>Stop Listening</Text>
          </Button>
        </View>
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
  buttonText: {
	  fontSize: 24,
	  fontWeight: "bold",
	  color: 'black'
  },
  buttonDiv: {
	  height: "5%",
	  backgroundColor: '#fff'
  }
});
