import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Button, TextInput, HelperText } from 'react-native-paper';
import { Divider } from 'react-native-elements';
import ClusterWS from 'clusterws-client-js';
import { classExists, getWords } from '../../firebase';
import {
  errors,
  CODE_LENGTH,
  NO_CLASS,
  NO_WORDS
} from '../../constants/Errors';

let wentBack = false;
export default class ConnectScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classCode: '',
      isConnecting: false,
      classCodeError: false,
      errorCode: ''
    };
  }

  componentDidMount() {
    wentBack = false;
  }

  componentWillUnmount() {
    wentBack = true;
    if (this.socket && this.socket.disconnect) this.socket.disconnect();
  }

  isConnected = () => this.setState({ isConnecting: false });

  handleClassCodeChange = classCode =>
    this.setState({ classCode }, () => {
      const { classCodeError } = this.state;
      if (classCodeError) this.validateCodeLength();
    });

  validateClass = () => {
    const { classCode } = this.state;

    if (!this.validateCodeLength()) return;
    this.setState({ isConnecting: true, classCodeError: false, errorCode: '' });
    classExists(classCode).then(classroom => {
      if (!classroom)
        return this.setState({
          isConnecting: false,
          classCodeError: true,
          errorCode: NO_CLASS
        });
      return getWords(classroom).then(words => {
        if (words.length === 0)
          return this.setState({
            isConnecting: false,
            classCodeError: true,
            errorCode: NO_WORDS
          });
        return this.connectToClass(words);
      });
    });
  };

  connectToClass = words => {
    const { classCode } = this.state;
    this.socket = new ClusterWS({
      url: 'wss://temp-vocacoord.herokuapp.com/'
    });
    this.socket.on('connect', () => {
      this.channel = this.socket.subscribe(classCode);
      const {
        navigation: { navigate }
      } = this.props;
      if (wentBack) return;
      navigate('ClassroomScreen', {
        channel: this.channel,
        callback: this.isConnected,
        words
      });
    });
    /*this.socket.on('error', err => {
      console.error('error: ', err); // <--- commented out because it was throwing an error
    }); */
    //this.socket.on('disconnect', () => this.channel.unsubscribe()); <--- commented out because it broke
  }

  validateCodeLength = () => {
    const { classCode } = this.state;
    let { errorCode } = this.state;
    let classCodeError = false;
    if (!classCode || classCode.length !== 4) {
      classCodeError = true;
      errorCode = CODE_LENGTH;
    }
    this.setState({ classCodeError, errorCode });
    return !classCodeError;
  };

  render() {
    const { styles } = this.props;
    const { isConnecting, classCode, classCodeError, errorCode } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <TextInput
            onBlur={this.validateCodeLength}
            style={styles.textbox}
            label="Class Code"
            mode="outlined"
            value={classCode}
            onChangeText={this.handleClassCodeChange}
            error={classCodeError}
            autoCapitalize="characters"
          />
          <HelperText type="error" visible={classCodeError}>
            {errors[errorCode]}
          </HelperText>
          <Divider style={styles.divider} />
          {isConnecting ? (
            <ActivityIndicator size="large" color="#ffa500" />
          ) : (
            <Button
              color="#ffa500"
              style={styles.button}
              mode="contained"
              onPress={() => this.validateClass()}
            >
              <Text style={styles.buttonText}>Connect</Text>
            </Button>
          )}
        </View>
      </View>
    );
  }
}
