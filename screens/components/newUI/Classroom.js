import React, { Component } from "react";
import { View, Text, Dimensions, YellowBox, Image } from "react-native";
import { ListItem, Avatar, Divider } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import { styles } from "../../Home/Home.styles";
import layout from "../../../constants/Layout";
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";

YellowBox.ignoreWarnings(['Setting']); /* Suppress those silly warnings */

 
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
      word.titleStyle.color = 'blue'; /* Just testing things */
      words = words.filter(w => w.name !== name);
      //words.unshift(word)
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
    const wHeight = Dimensions.get('window').height;
    const divHeight = (wHeight / words.length / ( (words.length - 4 <= 0) ? 10 : words.length - 4 ) );
    const { styles } = this.props;
    console.log(`Word count: ${words.length}`);
    console.log(`Window height: ${wHeight}`);
    console.log(`Divider Height: ${divHeight}`);
    return (
      /* Knocked out the giant black display at the very top */

      /* Words are pulled from firebase server. Need to have expandable list items with larger image */
      <View style={{flexGrow: 1}}>
        {
        words.map( (l, i) => (
          <View key={i}>
            <Collapse key={i}>
            <CollapseHeader key={i}>
              <ListItem
                key={i}
                leftAvatar={{ source: { uri: (!l.image) ? null : l.image.url} } }
                title={l.name}
                titleStyle= {styles.listItem}/>
            </CollapseHeader>
            <CollapseBody key={i}>
               <Text style={styles.subStyle}>{"\t" + l.definition}</Text>
               <Text>{(!l.image) ? "No image" : "There's an image!"}</Text>
              <Image source = {{uri: (!l.image) ? null : l.image.url}} 
              style= { {
                width: 100,
                height: divHeight
              }
              }
              />
            </CollapseBody>
            </Collapse>
              <Divider style= {{
                height: divHeight,
                backgroundColor: 'white'
              }}/>
            </View>
        ) )
        }
      </View>
    );
  }
}
