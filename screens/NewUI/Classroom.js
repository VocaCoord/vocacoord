import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  YellowBox,
  Image,
  ScrollView
} from 'react-native';
import { ListItem, Divider } from 'react-native-elements';
import {
  Collapse,
  CollapseHeader,
  CollapseBody
} from 'accordion-collapse-react-native';

YellowBox.ignoreWarnings(['Setting']);

export default class ClassScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    const channel = navigation.getParam('channel');
    const words = navigation.getParam('words');

    channel.watch(wordSaid => {
      const { name } = wordSaid;
      const { words } = this.state;
      const currentWord = words.find(word => word.name === name);
      if (currentWord) return this.setState({ currentWord });
    });

    this.state = {
      words,
      currentWord: {}
    };
  }

  componentWillMount() {
    const { navigation } = this.props;
    navigation.addListener('didFocus', () => navigation.getParam('callback')());
  }

  componentWillUnmount() {
    const { navigation } = this.props;
    navigation.getParam('channel').unsubscribe();
  }
  render() {
    const { words, currentWord } = this.state;
    const wHeight = Dimensions.get('window').height;
    const divHeight =
      wHeight / words.length / (words.length - 4 <= 0 ? 10 : words.length - 4);
    const { styles } = this.props;
    return (
      <ScrollView style={{ flexGrow: 1 }}>
        {words.map(({ name, image, image: { url }, definition }, i) => (
          <Collapse key={name}>
            <CollapseHeader>
              <ListItem
                leftAvatar={{
                  source: { uri: !image ? null : url }
                }}
                title={name}
                titleStyle={{
                  fontSize: 32,
                  fontWeight: 'bold',
                  color: currentWord.name === name ? 'red' : 'black'
                }}
              />
              <Divider
                style={{
                  height: divHeight,
                  backgroundColor: 'white'
                }}
              />
            </CollapseHeader>
            <CollapseBody>
              <Divider style={{ backgroundColor: 'black', height: 2 }} />
              <Divider
                style={{
                  height: 30,
                  backgroundColor: 'white'
                }}
              />

              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={{ uri: !image ? null : url }}
                  style={{
                    width: 200,
                    height: 200
                  }}
                />
                <Text style={styles.subStyle}>{definition}</Text>
              </View>
              <Divider
                style={{
                  height: 20,
                  backgroundColor: 'white'
                }}
              />
              <Divider style={{ backgroundColor: 'black', height: 2 }} />
            </CollapseBody>
          </Collapse>
        ))}
      </ScrollView>
    );
  }
}
