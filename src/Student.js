import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, AppRegistry } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { ListItem, Divider } from "react-native-elements";
import ClusterWS from "clusterws-client-js";
import ViewMoreText from 'react-native-view-more-text';
import {Image} from 'react-native' ;
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
   // let classID = this.state.classID;
    let classID = 'AAAA';
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
	  imgOpacity: 0
    };
	this.toggleImage=this.toggleImage.bind(this);
    channel.watch(wordSaid => {
      console.log(`student heard this message: ${wordSaid}`);
      let words = [...this.state.words];
      let word = words.find(w => w.word === wordSaid) || {
        word: wordSaid,
        count: 0
      };
      word.count += 1;
      words = words.filter(w => w.word !== wordSaid);
      words.unshift(word);
      this.setState({ words });
    });

    const testing = ["test", "test1", "test2", "test", "test2", "test3"];
    let idx = 0;
    (function publish() {
      channel.publish(testing[idx++]);
      if (idx < testing.length) setTimeout(publish, 2000);
    })();
  }

  componentWillMount() {
    this.props.navigation.addListener("didFocus", () =>
      this.props.navigation.getParam("callback")()
    );
  }

  componentWillUnmount() {
	this.props.navigation.getParam("channel").unsubscribe()
  }
  toggleImage() {
    if (this.state.imgOpacity === 1 ) {
      this.setState({
		imgOpacity: 0
    })
    } else {
	  this.setState({
        imgOpacity: 1
	  })
    }
   }


  render() {
    return (
	<View>
        {this.state.words.length > 0 &&
          this.state.words.map((w, i) => {
			  if(i%2===0){
				url='https://pmchollywoodlife.files.wordpress.com/2018/01/kanye-west-smiling-spl-ftr.jpg?w=412'
			  }else{
				url='https://i.imgur.com/0p7RZIG.jpg'
			  }
            return (
			<View>
              <ListItem
                key={i}
                title={w.word}
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
					onPress={ this.toggleImage}
				>
					<Text>image</Text>
				</Button>
				<Image 
				style={{width: 100, height: 100, opacity: this.state.imgOpacity}}
				source={{uri: url}}
				/>
				</View>
			);
          })}
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
