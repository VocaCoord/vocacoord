import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

export class HomeScreen extends React.Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigate('TeacherScreen')}
        >
          Teacher
        </Button>
        <Button
          mode="contained"
          onPress={() => navigate('StudentScreen')}
        >
          Student
        </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttons: {
    minWidth: '60%',
    maxWidth: '60%'
  }
});