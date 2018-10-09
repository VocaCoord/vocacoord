import { createStackNavigator } from 'react-navigation';
import { HomeScreen } from './Home.js';
import { TeacherScreen, CreateClass, ExistingClass } from './Teacher.js';
import { StudentScreen } from './Student.js'

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
    ExistingClass,
    
    StudentScreen,
  },
  {
    initialRouteName: 'HomeScreen'
  }
);