import React, { Component } from "react";
import { View, Text } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import { styles } from "../../Home/Home.styles";
import layout from "../../../constants/Layout";


 
export default class ClassScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    const channel = navigation.getParam("channel");
    this.state = {
      words: navigation.getParam("words")
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
      //words.unshift(word);
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
    const { words } = this.state;
    if (!words) console.log("Words undefined");
    return (
      /* Knocked out the giant black display at the very top */

      /* Create dummy array of words */
      <View>
        {
        words.map( (l, i) => (
          <ListItem
            key={i}
            leftAvatar={{ source: { uri: l.imagePath} } }
            title={l.name}
            titleStyle={styles.listItem}
            subtitle={l.definition}
            subtitleStyle={styles.subStyle}
            />
        ) ) 
        }
      </View>
    );
  }
}
