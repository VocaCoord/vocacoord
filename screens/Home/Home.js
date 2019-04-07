import React from 'react';
import { View, Text, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { Divider } from 'react-native-elements';

export default ({ navigation: { navigate }, styles }) => (
  <View style={styles.container}>
    <Divider style={styles.topSpace} />
    <Image style={styles.logo} source={require('../../assets/VCLogo.png')} />
    <Divider style={styles.buttonDivider} />
    <View style={styles.buttons}>
      <Button mode="contained" color="#ffa500" disabled>
        <Text style={styles.buttonText}>Teacher</Text>
      </Button>
      <Divider style={styles.buttonDivider} />
      <Button
        color="#ffa500"
        mode="contained"
        onPress={() => navigate('ConnectScreen' /*'ClassroomScreen' */)}
      >
        <Text style={styles.buttonText}>Student</Text>
      </Button>
    </View>
  </View>
);
