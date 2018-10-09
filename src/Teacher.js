import React from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

export class TeacherScreen extends React.Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.buttons}>
          <Button
            mode="contained"
            onPress={() => navigate('CreateClass')}
          >
            Create a new classroom
          </Button>
          <Button
            mode="contained"
            onPress={() => navigate('ExistingClass')}
          >
            Use an existing classroom
          </Button>
        </View>
      </View>
    );
  }
}

export class CreateClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      className: ''
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textboxes}>
          <TextInput
            label="First Name"
            mode="outlined"
            value={this.state.firstName}
            onChangeText={firstName => this.setState({ firstName })}
          />
          <TextInput
            label="Last Name"
            mode="outlined"
            value={this.state.lastName}
            onChangeText={lastName => this.setState({ lastName })}
          />
          <TextInput
            label="Email Address"
            mode="outlined"
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          />
          <TextInput
            label="Classroom Name"
            mode="outlined"
            value={this.state.className}
            onChangeText={className => this.setState({ className })}
          />
        </View>
      </View>
    );
  }
}

export class ExistingClass extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Class exists</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    minWidth: '60%',
    maxWidth: '60%'
  },
  textboxes: {
    minWidth: '60%',
    maxWidth: '60%'
  }
});