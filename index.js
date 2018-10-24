import AppNavigator from './src/AppNavigator';
import { AppRegistry } from 'react-native';
import { YellowBox } from 'react-native';
AppRegistry.registerComponent('VocaCoord', () => AppNavigator)
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
