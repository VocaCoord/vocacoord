import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Button, TextInput, HelperText } from 'react-native-paper';
import { Divider } from 'react-native-elements';
import ClusterWS from 'clusterws-client-js';
import { classExists, getWords } from '../../firebase';
import { CODE_LENGTH, NO_CLASS, NO_WORDS } from '../../constants/Errors';

let wentBack = false;
export default class ConnectScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classCode: '',
      isConnecting: false,
      classCodeError: false,
      error: '',
      ui: props.navigation.getParam('ui')
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
    this.setState({ isConnecting: true, classCodeError: false, error: '' });
    classExists(classCode.toUpperCase()).then(classroom => {
      if (!classroom)
        return this.setState({
          isConnecting: false,
          classCodeError: true,
          error: NO_CLASS
        });
      return getWords(classroom).then(words => {
        if (words.length === 0)
          return this.setState({
            isConnecting: false,
            classCodeError: true,
            error: NO_WORDS
          });
        return this.connectToClass(words);
      });
    });
  };

  connectToClass = words => {
    const { classCode, ui } = this.state;
    this.socket = new ClusterWS({
      url: 'wss://temp-vocacoord.herokuapp.com/'
    });
    this.socket.on('connect', () => {
      this.channel = this.socket.subscribe(classCode.toUpperCase());
      const {
        navigation: { navigate }
      } = this.props;
      if (wentBack) return;
      navigate(ui, {
        channel: this.channel,
        callback: this.isConnected,
        words
      });
    });
  };

  validateCodeLength = () => {
    const { classCode } = this.state;
    let { error } = this.state;
    let classCodeError = false;
    if (!classCode || classCode.length !== 4) {
      classCodeError = true;
      error = CODE_LENGTH;
    }
    this.setState({ classCodeError, error });
    return !classCodeError;
  };

  render() {
    const { styles } = this.props;
    const { isConnecting, classCode, classCodeError, error } = this.state;
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
            {error}
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
