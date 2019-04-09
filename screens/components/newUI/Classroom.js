import React, { Component } from "react";
import { View, Text, Dimensions, YellowBox, Image, ScrollView } from "react-native";
import { ListItem, Avatar, Divider } from "react-native-elements";
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";

YellowBox.ignoreWarnings(['Setting']); /* Suppress those silly warnings */


export default class ClassScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    const channel = navigation.getParam("channel");
    this.state = {
      words: navigation.getParam("words"),
      currentword: undefined
    };

    //Initialize all counts to zero
    for (var i = 0; i < this.state.words.length; i++) this.state.words[i].count = 0;

    //Jerry don't kill me pls
    channel.watch(wordSaid => {
      const { name } = wordSaid;
      console.log(`Heard word: ${name}`);
      for (var i = 0; i < this.state.words.length; i++) {
        if (this.state.words[i].name === name) {
          this.state.words[i].count += 1;
          this.setState({ currentword: this.state.words[i] });
          break;
        }
      }
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
  render() {
    const { words } = this.state;
    const wHeight = Dimensions.get('window').height;
    const divHeight = (wHeight / words.length / ((words.length - 4 <= 0) ? 10 : words.length - 4));
    const { styles } = this.props;
    console.log(`Word count: ${words.length}`);
    console.log(`Window height: ${wHeight}`);
    console.log(`Divider Height: ${divHeight}`);
    return (
      /* Knocked out the giant black display at the very top */

      <ScrollView style={{ flexGrow: 1 }}>
        {
          words.map((l, i) => (
            <Collapse key={i}>

              <CollapseHeader key={i}>
                <ListItem
                  key={i}
                  leftAvatar={{ source: { uri: (!l.image) ? null : l.image.url } }}
                  title={l.name}
                  titleStyle={{
                    fontSize: 32,
                    fontWeight: "bold",
                    color: (this.state.currentword &&
                      this.state.currentword.name === l.name) ? "red" : "black"
                  }} />
                <Divider style={{
                  height: divHeight,
                  backgroundColor: 'white'
                }} />
              </CollapseHeader>
              <CollapseBody key={i}>
                <Divider style={{ backgroundColor: 'black', height: 2 }} />
                <Divider style={{
                  height: 30,
                  backgroundColor: "white"
                }} />

                <View style={{ justifyContent: "center", alignItems: "center" }}>

                  <Image source={{ uri: (!l.image) ? null : l.image.url }}
                    style={{
                      width: 200,
                      height: 200
                    }
                    }
                  />
                  <Text style={styles.subStyle}>{l.definition}</Text>

                </View>

                <Divider style={{
                  height: 20,
                  backgroundColor: "white"
                }} />
                <Divider style={{ backgroundColor: 'black', height: 2 }} />
              </CollapseBody>

            </Collapse>
          ))
        }
      </ScrollView>
    );
  }
}
