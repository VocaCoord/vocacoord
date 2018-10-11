import { createStackNavigator } from 'react-navigation';
import { HomeScreen } from './Home.js';
import { TeacherScreen, CreateClass, ExistingClass, ClassCreated } from './Teacher.js';
import { VoiceDemo } from './VoiceDemo.js';
import { StudentScreen } from './Student.js';
import { WordBanks, WordBank } from './WordBanks.js';

/* indention below represents the nested structure of components */
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
          ClassCreated,
          VoiceDemo,
          WordBanks,
            WordBank,
        ExistingClass,
    
      StudentScreen,
  },
  {
    initialRouteName: 'HomeScreen'
  }
);