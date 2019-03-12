import React, { Component } from "react";
import { View, Text } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import { styles } from "../../Home/Home.styles";
import layout from "../../../constants/Layout";


 const dummyList  = [
      {
        name: 'Apple',
        avatar_url: "https://media.istockphoto.com/photos/red-apple-picture-id186843005",
        subtitle: "A red fruit"
      },
      {
        name: "Banana",
        avatar_url: "https://media.istockphoto.com/photos/banana-bunch-picture-id173242750",
        subtitle: "A yellow fruit"
      },
      {
        name: "Dog",
        avatar_url: "https://media.istockphoto.com/photos/energetic-australian-cattle-dog-mixed-breed-dog-hoping-to-be-adopted-picture-id1001199382",
        subtitle: "A man's best friend"
      },
      {
        name: "Cat",
        avatar_url: "https://media.istockphoto.com/photos/portrait-of-a-surprised-cat-scottish-straight-closeup-picture-id910314172",
        subtitle: "The opposite of a man's best friend"
      },
      {
        name: "Dragon",
        avatar_url: "https://media.istockphoto.com/photos/blurred-silhouette-of-giant-monster-prepare-attack-crowd-during-night-picture-id934807196",
        subtitle: "A winged serpent with a tail"
      },
      {
        name: "Taco",
        avatar_url: "https://media.istockphoto.com/photos/mexican-food-crunchy-beef-tacos-in-a-row-picture-id863176428",
        subtitle: "A tasty food item"
      },
      {
        name: "Magma",
        avatar_url: "https://media.istockphoto.com/photos/lava-background-picture-id1012404208",
        subtitle: "Stuff flowing inside the earth and in volcancos"
      },
      {
        name: "Tree",
        avatar_url: "https://media.istockphoto.com/photos/sun-shining-in-a-forest-picture-id901134626",
        subtitle: "A plant that grows to a considerable height"
      },
      {
        name: "Bear",
        avatar_url: "https://media.istockphoto.com/photos/big-brown-bear-standing-on-his-hind-legs-picture-id968792794",
        subtitle: "An animal"
      },
      {
        name: "Car",
        avatar_url: "https://media.istockphoto.com/photos/illustration-of-generic-suv-car-on-white-picture-id949409516",
        subtitle: "A transportation device"
      },
    ];
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

      /* Create dummy array of words */
      <View>
        <Text>This is a test</Text>
        {
        dummyList.map( (l, i) => (
          <ListItem
            key={i}
            leftAvatar={{ source: { uri: l.avatar_url} } }
            title={l.name}
            titleStyle={styles.listItem}
            subtitle={l.subtitle}
            subtitleStyle={styles.subStyle}
            />
        ) ) 
        }
      </View>
    );
  }
}
