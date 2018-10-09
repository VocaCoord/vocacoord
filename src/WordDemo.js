import React from 'react';
import { View, Text, FlatList } from 'react-native';

export class WordDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            words: [
                {key: 'test'},
                {key: 'test2'}
            ]
        }
    }
    
    render() {
        return (
            <View>
                <FlatList
                    data={this.state.words}
                    renderItem={({item}) => <Text>{item.key}</Text>}
                />
            </View>
        )
    }
}