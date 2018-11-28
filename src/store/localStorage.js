import { AsyncStorage } from "react-native";
let apiURL = "https://temp-vocacoord.herokuapp.com/api/";

export const loadState = () => {
  try {
    const serializedState = AsyncStorage.getItem("state");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state);
    AsyncStorage.setItem("state", serializedState);
    if (state.userData.user && state.userData.user.email) {
      fetch(apiURL + "sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user: state.userData.user,
          data: {
            classrooms: state.userData.classrooms,
            wordbanks: state.userData.wordbanks,
            words: state.userData.words
          }
        })
      });
    }
  } catch (err) {
    // ignore errors for now
  }
};
