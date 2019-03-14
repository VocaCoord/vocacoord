import { createAppContainer, createStackNavigator } from 'react-navigation';
import HomeScreen from '../screens/Home';
import ConnectScreen from '../screens/Connect';
import ClassroomScreen from '../screens/components/newUI'; /* Change to oldUI to use the old UI */

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
      ClassroomScreen
    },
    {
      initialRouteName: 'HomeScreen'
    }
  )
);
