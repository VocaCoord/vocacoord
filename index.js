import { AppRegistry } from "react-native";
import { YellowBox } from "react-native";
import Root from "./src/components/Root";
import { Client } from "bugsnag-react-native";
import { BUGSNAGAPIKEY } from "react-native-dotenv";

const bugsnag = new Client(BUGSNAGAPIKEY);

AppRegistry.registerComponent("VocaCoord", () => Root);
YellowBox.ignoreWarnings([
  "Warning: isMounted(...) is deprecated",
  "Module RCTImageLoader"
]);
