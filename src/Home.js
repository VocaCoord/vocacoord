import React, { Component } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Button } from "react-native-paper";
import { Divider } from "react-native-elements";

export class HomeScreen extends Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
		<Divider style={styles.topSpace}/>
		<Image style={styles.logoStyle} source={require('./assets/images/VCLogo.png')}/> 
		<Divider style={styles.logoButtonDiv}/>
        <View style={styles.buttons}>
          <Button
            mode="contained"
			color="#ffa500"
            onPress={() => navigate("LoginScreen")}
          >
            <Text style={styles.buttonText}>Teacher</Text>
          </Button>
		  <Divider style={styles.buttonDivider}/>
          <Button color="#ffa500" mode="contained" onPress={() => navigate("StudentScreen")}>
            <Text style={styles.buttonText}>Student</Text>
          </Button>
        </View>
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
  },
  topSpace: {
	  height: "2%"
  },
  buttons: {
    minWidth: "60%",
    maxWidth: "60%"
  },
  buttonDivider: {
	  backgroundColor: "#fff",
	  height: "20%"
  },
  buttonText: {
	  fontSize: 36,
	  fontWeight: "bold"
  },
  logoStyle: {
	  width: "40%",
	  height: "25%"
  },
  logoButtonDiv: {
	  height: "20%"
  },
});
