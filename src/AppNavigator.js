import { createStackNavigator } from 'react-navigation';
import { HomeScreen } from './Home.js';
import { TeacherScreen, CreateClass, ExistingClass } from './Teacher.js';
import { VoiceDemo } from './VoiceDemo.js';
import { StudentScreen } from './Student.js';
import { WordDemo } from './WordDemo.js';

/* nested structure below represents the nested structure of components */
export default AppNavigator = createStackNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: {
        header: null
      }
    },

      TeacherScreen,
        CreateClass,
          VoiceDemo,
          WordDemo,
        ExistingClass,
    
      StudentScreen,
  },
  {
    initialRouteName: 'HomeScreen'
  }
);