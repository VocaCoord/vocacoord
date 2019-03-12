import React, { Component } from "react";
import { View } from "react-native";
import { ListItem, Avatar } from "react-native-elements";

/* Class screen for showing the word bank and words that popped up */
export default class ClassScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    const channel = navigation.getParam("channel");
    this.state = {
      words: [],
      currentWord: {}
      /*
      imgWidth: 0,
      imgHeight: 0 */
    };

    channel.watch(wordSaid => {
      const { name } = wordSaid;
      /* eslint-disable */
      let words = [...this.state.words];
      /* eslint-enable */
      const word = words.find(w => w.name === name) || {
        ...wordSaid,
        count: 0
      };
      word.count += 1;
      words = words.filter(w => w.name !== name);
      words.unshift(word);
      this.setState({ words });
    });
  }

  componentWillMount() {
    const { navigation } = this.props;
    navigation.addListener("didFocus", () => navigation.getParam("callback")());
  }

  componentWillUnmount() {
    const { navigation } = this.props;
    navigation.getParam("channel").unsubscribe();
  }

  selectWord(word) {
    if (!word.image || word.image === "")
      return this.setState({ currentWord: word });
  }

  render() {
    const { words } = this.state || [];
    const { currentWord } = this.state;
    return (
      /* Knocked out the giant black display at the very top */
      <View style={{ flex: 1 }}>
        {words.length > 0 &&
          words.map(word => (
            <View key={word}>
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
                hideChevron
                onPress={() => this.selectWord(word)}
              />
            </View>
          ))}
      </View>
    );
  }
}
