import { createStackNavigator } from "react-navigation";
import { HomeScreen } from "./Home.js";
import LoginScreen from "./Login.js";
import SignupScreen from "./Signup.js";
import ClassroomScreen from "./Classrooms.js";
import { VoiceDemo } from "./VoiceDemo.js";
import { StudentScreen, ClassScreen } from "./Student.js";
import WordBank from "./Words.js";
import WordBanks from "./WordBanks.js";

export default (AppNavigator = createStackNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: {
        header: null
      }
    },
    LoginScreen,
    SignupScreen,
    ClassroomScreen,
    VoiceDemo,
    WordBanks,
    WordBank,
    StudentScreen,
    ClassScreen
  },
  {
    initialRouteName: "HomeScreen"
  }
));
