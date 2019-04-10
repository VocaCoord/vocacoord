import { createAppContainer, createStackNavigator } from 'react-navigation';
import HomeScreen from '../screens/Home';
import ConnectScreen from '../screens/Connect';
import OldClassroomScreen from '../screens/OldUI';
import NewClassroomScreen from '../screens/NewUI';

export default createAppContainer(
  createStackNavigator(
    {
      HomeScreen: {
        screen: HomeScreen,
        navigationOptions: {
          header: null
        }
      },
      ConnectScreen,
      OldClassroomScreen,
      NewClassroomScreen
    },
    {
      initialRouteName: 'HomeScreen'
    }
  )
);
