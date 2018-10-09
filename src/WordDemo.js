import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';

export class WordDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wordBanks: [
              {
                name: 'Add Word Bank',
                createdAt: null
              }
            ]
        }
    }
    
    render() {
        return (
            <View>
              {
                this.state.wordBanks.map((wordbank, i) => (
                  <ListItem
                    key={i}
                    title={wordbank.name}
                    subtitle={wordbank.createdAt ? wordbank.createdAt : ''}
                  />
                ))
              }
            </View>
        )
    }
}

class WordBankListItem extends React.Component {
  render() {
    return (
      <Text></Text>
    )
  }
}