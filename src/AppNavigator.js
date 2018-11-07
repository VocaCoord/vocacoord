import { createStackNavigator } from "react-navigation";
import { HomeScreen } from "./Home.js";
import LoginScreen from "./Login.js";
import SignupScreen from "./Signup.js";
import { CreateClass, ExistingClass, ClassCreated } from "./Teacher.js";
import ClassroomScreen from "./Classrooms.js";
import { VoiceDemo } from "./VoiceDemo.js";
import { StudentScreen, ClassScreen } from "./Student.js";
import { WordBanks, WordBank } from "./WordBanks.js";

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
    CreateClass,
    ClassCreated,
    VoiceDemo,
    WordBanks,
    WordBank,
    ExistingClass,

    StudentScreen,
    ClassScreen
  },
  {
    initialRouteName: "HomeScreen"
  }
));
