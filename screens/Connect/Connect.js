import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Button, TextInput, HelperText } from 'react-native-paper';
import { Divider } from 'react-native-elements';
import ClusterWS from 'clusterws-client-js';

let wentBack = false;
export default class ConnectScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classCode: '',
      isConnecting: false,
      classCodeError: false
    };
  }

  componentDidMount() {
    wentBack = false;
  }

  componentWillUnmount() {
    wentBack = true;
    if (this.socket && this.socket.disconnect) this.socket.disconnect();
  }

  isConnected = () => {
    this.setState({ isConnecting: false });
  };

  handleClassCodeChange = classCode =>
    this.setState({ classCode }, () => {
      const { classCodeError } = this.state;
      if (classCodeError) this.validateClassCode();
    });

  connectToClass() {
    if (!this.validateClassCode()) return;

    const { classCode } = this.state;

    this.setState({ isConnecting: true, classCodeError: false });

    this.socket = new ClusterWS({
      url: 'wss://temp-vocacoord.herokuapp.com/'
    });
    this.socket.on('connect', () => {
      this.channel = this.socket.subscribe(classCode.toUpperCase());
      const {
        navigation: { navigate }
      } = this.props;
      setTimeout(() => {
        if (wentBack) return;
        navigate('ClassroomScreen', {
          channel: this.channel,
          callback: this.isConnected
        });
      }, 3000);
    });
    this.socket.on('error', err => {
      console.error('error: ', err);
    });
    this.socket.on('disconnect', () => this.channel.unsubscribe());
  }

  validateClassCode() {
    const { classCode } = this.state;
    let classCodeError = false;
    if (!classCode || classCode.length !== 4) classCodeError = true;
    this.setState({ classCodeError });
    return !classCodeError;
  }

  render() {
    const { styles } = this.props;
    const { isConnecting, classCode, classCodeError } = this.state;
    return (
      <View style={styles.container}>
        {isConnecting ? (
          <View>
            <Text>Hold on while we try to connect you to the classroom...</Text>
            <ActivityIndicator size="large" color="#ffa500" />
          </View>
        ) : (
          <View>
            <TextInput
              onBlur={this.validateClassCode}
              style={styles.textbox}
              label="Class Code"
              mode="outlined"
              value={classCode}
              onChangeText={this.handleClassCodeChange}
              error={classCodeError}
            />
            <HelperText type="error" visible={classCodeError}>
              Classroom codes must be exactly 4 characters long.
            </HelperText>
            <Divider style={styles.divider} />
            <Button
              color="#ffa500"
              style={styles.button}
              mode="contained"
              onPress={() => this.connectToClass()}
            >
              <Text style={styles.buttonText}>Connect</Text>
            </Button>
          </View>
        )}
      </View>
    );
  }
}
