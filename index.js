import { AppRegistry, YellowBox } from "react-native";
import AppNavigator from "./src/AppNavigator";

AppRegistry.registerComponent("VocaCoord", () => AppNavigator);
YellowBox.ignoreWarnings([
  "Warning: isMounted(...) is deprecated",
  "Module RCTImageLoader"
]);
