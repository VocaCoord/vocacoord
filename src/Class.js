import React, { Component } from "react";
import { View, StyleSheet, ScrollView, PixelRatio } from "react-native";
import { ListItem, Text, Avatar } from "react-native-elements";
import { Image } from "react-native";

/* Class screen for showing the word bank and words that popped up */
export class ClassScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    channel = navigation.getParam("channel");
    this.state = {
      words: [],
      currentWord: {},
      imgWidth: 0,
      imgHeight: 0
    };

    channel.watch(wordSaid => {
      const { name } = wordSaid;
      let words = [...this.state.words];
      let word = words.find(w => w.name === name) || { ...wordSaid, count: 0 };
      word.count += 1;
      words = words.filter(w => w.name !== name);
      words.unshift(word);
      this.setState({ words });
    });
  }

  componentWillMount() {
    this.props.navigation.addListener("didFocus", () =>
      this.props.navigation.getParam("callback")()
    );
  }

  componentWillUnmount() {
    this.props.navigation.getParam("channel").unsubscribe();
  }

  selectWord(word) {
    if (!word.image || word.image === "")
      return this.setState({ currentWord: word });
    let ratio = PixelRatio.get();
    Image.getSize(word.image, (width, height) => {
      this.setState({
        currentWord: word,
        imgWidth: width * ratio,
        imgHeight: height * ratio
      });
    });
  }

  render() {
    const { words } = this.state || [];
    const { currentWord } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View
          style={{
            flex: 0.46,
            backgroundColor: "black",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Image
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              width: this.state.imgWidth,
              height: this.state.imgHeight
            }}
            source={{
              uri: currentWord.image !== "" ? currentWord.image : null
            }}
          />
        </View>
        <View
          style={{
            flex: 0.14,
            borderColor: "gray",
            borderBottomWidth: 1
          }}
        >
          <Text>
            <Text
              h3
              style={{ color: "black", textDecorationLine: "underline" }}
            >
              {"Definition:"}
            </Text>
            <Text h4 style={{ color: "black" }}>
              {currentWord.definition ? ` ${currentWord.definition}` : null}
            </Text>
          </Text>
        </View>
        <View style={{ flex: 0.4 }}>
          <ScrollView>
            {words.length > 0 &&
              words.map((word, i) => {
                return (
                  <View key={i}>
                    <ListItem
                      title={word.name}
                      subtitle={word.definition}
                      style={{ backgroundColor: "#fff" }}
                      avatar={
                        word.image !== "" && (
                          <Avatar medium source={{ uri: word.image }} />
                        )
                      }
                      titleStyle={{
                        color: currentWord.name === word.name ? "red" : "black",
                        fontSize: 32
                      }}
                      rightTitle={`Times said: ${word.count}`}
                      rightTitleStyle={{
                        color: "black",
                        fontSize: 24
                      }}
                      hideChevron={true}
                      onPress={() => this.selectWord(word)}
                    />
                  </View>
                );
              })}
          </ScrollView>
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
  button: {
    minWidth: "60%",
    maxWidth: "60%"
  },
  textbox: {
    minWidth: "60%",
    maxWidth: "60%"
  },
  divider: {
    height: "10%",
    backgroundColor: "#fff"
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black"
  }
});
