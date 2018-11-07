import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, AppRegistry,ScrollView,TouchableHighlight } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { ListItem, Divider } from "react-native-elements";
import ClusterWS from "clusterws-client-js";
import ViewMoreText from 'react-native-view-more-text';
import {Image} from 'react-native' ;
import Modal from "react-native-modal";

let api = "https://temp-vocacoord.herokuapp.com/api/";

export class StudentScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classID: null,
      loading: false
    };
  }

  connectToClass() {
    let classID = this.state.classID;
  //  let classID = 'Aaaa';
    console.log(`Student ClassID: ${classID}`);
	if (classID && classID.length === 4) {
      this.setState({ loading: true });

      this.socket = new ClusterWS({
        url: "wss://temp-vocacoord.herokuapp.com/"
      });
      this.socket.on("connect", () => {
        console.log("connected to the socket");
        this.channel = this.socket.subscribe(classID);
        const { navigate } = this.props.navigation;
        setTimeout(
          () =>
            navigate("ClassScreen", {
              channel: this.channel,
              callback: this.isConnected.bind(this)
            }),
          3000
        );
      });
      this.socket.on("error", err => {
        console.error("error: ", err);
      });
      this.socket.on("disconnect", (code, reason) => {
        console.log(`disconnected with code ${code} and reason ${reason}`);
        this.channel.unsubscribe();
      });
    }
  }

  isConnected() {
    this.setState({ loading: false });
  }

  componentWillUnmount() {
    if (this.socket) this.socket.disconnect();
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading ? (
          <View>
            <Text>Hold on while we try to connect you to the classroom...</Text>
            <ActivityIndicator size="large" color="#ffa500" />
          </View>
        ) : (
          <View>
            <TextInput
              style={styles.textboxes}
              label="Class ID"
              mode="outlined"
              value={this.state.classID}
              onChangeText={classID => this.setState({ classID })}
            />
			<Divider style={styles.fieldDiv}/>
            <Button
			  color="#ffa500"
              style={styles.buttons}
              mode="contained"
              onPress={() => this.connectToClass()}
            >
              <Text style={styles.buttonText}>Connect</Text>
            </Button>
          </View>
        )}
      </View>
    );
  }
}

/* Class screen for showing the word bank and words that popped up */
export class ClassScreen extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    channel = navigation.getParam("channel");
    this.state = {
      words: [],
	  modalVisible: false,
    };
	this.toggleModal=this.toggleModal.bind(this);
    channel.watch(wordSaid => {
      console.log(`student heard this message: ${wordSaid}`); //future wordSaid ->wordSaid.wordName
      let words = [...this.state.words];
      let word = words.find(w => w.word === wordSaid) || { //future wordSaid ->wordSaid.wordName
        word: wordSaid,    //future wordSaid ->wordSaid.wordName
//		definition: wordSaid.wordDefinition,
		picture: 'data:image/gif;base64,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',    //wordSaid.image,
        count: 0
      };
      word.count += 1;
      words = words.filter(w => w.word !== wordSaid); //future wordSaid ->wordSaid.wordName
      words.unshift(word);
      this.setState({ words });
    });

 /*   const testing = ["test", "test1", "test2", "test", "test2", "test3","test4","test5","test6","test7","test8", "test9","test10","tes11","test12","test13","test14"];
    let idx = 0;
    (function publish() {
      channel.publish(testing[idx++]);
      if (idx < testing.length) setTimeout(publish, 2000);
    })();*/
  }

  componentWillMount() {
    this.props.navigation.addListener("didFocus", () =>
      this.props.navigation.getParam("callback")()
    );
  }

  componentWillUnmount() {
	this.props.navigation.getParam("channel").unsubscribe()
  }
  toggleModal = pic => {
	Alert.alert(pic);
	this.setState({ modalVisible: visible });

   }


  render() {
    return (
	<ScrollView>
        {this.state.words.length > 0 &&
          this.state.words.map((w, i) => {
            return (
			<View>
              <ListItem
                key={i}
                title={w.word}
				subtitle={"word definition place holder"}
				avatar={{ uri: w.picture } }
                titleStyle={{
                  color: i == 0 ? "red" : "black",
                  fontSize: 32
                }}
                rightTitle={`Times said: ${w.count}`}
                rightTitleStyle={{
                  color: "black",
                  fontSize: 24
                }}
                hideChevron={true}
				/>
					<Button
							onPress={() => this.toggleImage(w.picture)}
					>
						<Text>image</Text>
					</Button>
				</View>
			);
          })}
	</ScrollView>
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
  fieldDiv: {
	  height: "10%",
	  backgroundColor: "#fff"
  },
  buttonText: {
	  fontSize: 24,
	  fontWeight: "bold",
	  color: 'black'
  }
});
