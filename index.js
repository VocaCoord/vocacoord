import { AppRegistry, YellowBox } from "react-native";
import Root from "./src/components/Root";

AppRegistry.registerComponent("VocaCoord", () => Root);
YellowBox.ignoreWarnings([
  "Warning: isMounted(...) is deprecated",
  "Module RCTImageLoader"
]);
