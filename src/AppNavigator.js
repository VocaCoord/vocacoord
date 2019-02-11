import { createStackNavigator } from "react-navigation";
import HomeScreen from "./screens/Home";
import ConnectScreen from "./screens/Connect";
import ClassroomScreen from "./screens/Classroom";

export default createStackNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: {
        header: null
      }
    },
    ConnectScreen,
    ClassroomScreen
  },
  {
    initialRouteName: "HomeScreen"
  }
);
