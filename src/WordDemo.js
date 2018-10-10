import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ListItem, Button } from "react-native-elements";

export class WordDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wordBanks: []
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <Button onPress={navigation.getParam("addWordBank")} title="+" />
      )
    };
  };

  addWordBank = () => {
    const date = new Date();
    const dateString = `Created on ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}`;
    const wordBank = {
      name: "test",
      createdAt: dateString,
      words: []
    };
    wordBanks = this.state.wordBanks;
    wordBanks.unshift(wordBank);
    this.setState({ wordBanks });
  };

  componentDidMount() {
    this.props.navigation.setParams({ addWordBank: this.addWordBank });
  }

  render() {
    return (
      <View style={this.state.wordBanks.length ? null : styles.container}>
        {this.state.wordBanks.length > 0 ? (
          this.state.wordBanks.map((wordbank, i) => (
            <ListItem
              key={i}
              title={wordbank.name}
              subtitle={
                wordbank.createdAt ? wordbank.createdAt : null
              }
              chevron={false}
            />
          ))
        ) : (
          <Text>
            It looks like you haven't added a word bank yet, {"\n"}
            click the + above to start adding word banks
          </Text>
        )}
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
  }
});
