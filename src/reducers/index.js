import dotProp from "dot-prop-immutable";
import { combineReducers } from "redux";
import uuidv1 from "uuid/v1";
import {
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  LOGIN_SUCCESS,
  LOGIN_FAILURE
} from "../actions/index.js";

const initialState = {
  classrooms: {},
  wordbanks: {},
  words: {},
  user: {
    authenticated: false
  }
};

function userDataReducer(state = initialState, action) {
  switch (action.type) {
    /* works */
    case "ADD_CLASS": {
      const uuid = uuidv1();
      return dotProp.set(state, `classrooms.${uuid}`, {
        ...action.payload,
        id: uuid,
        wordbanks: []
      });
    }

    /* works */
    case "EDIT_CLASS": {
      const { id, name } = action.payload;
      return dotProp.set(state, `classrooms.${id}.name`, name);
    }

    /* works */
    case "REMOVE_CLASS": {
      const { id } = action.payload;
      const newClassState = removeWordBanks(state, id);
      return dotProp.delete(newClassState, `classrooms.${id}`);
    }

    /* works */
    case "ADD_BANK": {
      const uuid = uuidv1();
      const { classId } = action.payload;
      const classState = dotProp.merge(
        state,
        `classrooms.${classId}.wordbanks`,
        [uuid]
      );
      return dotProp.set(classState, `wordbanks.${uuid}`, {
        ...action.payload,
        id: uuid,
        words: []
      });
    }

    /* works */
    case "EDIT_BANK": {
      const { id, name } = action.payload;
      return dotProp.set(state, `wordbanks.${id}.name`, name);
    }

    /* works */
    case "REMOVE_BANK": {
      const { classId, id } = action.payload;
      const newWordState = removeWords(state, id);
      const oldWordBanks = dotProp.get(
        newWordState,
        `classrooms.${classId}.wordbanks`
      );
      const newWordBanks = oldWordBanks.filter(oldId => oldId !== id);
      const newClassState = dotProp.set(
        newWordState,
        `classrooms.${classId}.wordbanks`,
        newWordBanks
      );
      return dotProp.delete(newClassState, `wordbanks.${id}`);
    }

    /* TODO */
    case "ADD_WORD": {
      const uuid = uuidv1();
      const { wordBankId } = action.payload;
      const wordBankState = dotProp.merge(
        state,
        `wordbanks.${wordBankId}.words`,
        [uuid]
      );
      return dotProp.set(wordBankState, `words.${uuid}`, {
        ...action.payload,
        id: uuid
      });
    }

    /* TODO */
    case "EDIT_WORD": {
      const { id, name, definition, image } = action.payload;
      let newState = dotProp.get(state, "", state);
      if (name) newState = dotProp.set(newState, `words.${id}.name`, name);
      if (definition)
        newState = dotProp.set(newState, `words.${id}.definition`, definition);
      if (image) newState = dotProp.set(newState, `words.${id}.image`, image);
      return newState;
    }

    /* TODO */
    case "REMOVE_WORD": {
      const { wordBankId, id } = action.payload;
      const oldWords = dotProp.get(state, `wordbanks.${wordBankId}.words`);
      const newWords = oldWords.filter(oldId => oldId !== id);
      const wordState = dotProp.set(
        state,
        `wordbanks.${wordBankId}.words`,
        newWords
      );
      return dotProp.delete(wordState, `words.${id}`);
    }

    case SIGNUP_FAILURE:
    case SIGNUP_SUCCESS: {
      return dotProp.set(state, `user`, { ...action.payload });
    }

    case LOGIN_FAILURE:
    case LOGIN_SUCCESS: {
      const {
        authenticated,
        firstName,
        lastName,
        email,
        data
      } = action.payload;
      let newUser = {
        authenticated,
        firstName,
        lastName,
        email
      };
      let newState = dotProp.set(state, `user`, newUser);
      newState = dotProp.set(newState, `classrooms`, data.classrooms);
      newState = dotProp.set(newState, `wordbanks`, data.wordbanks);
      return dotProp.set(newState, `words`, data.words);
    }

    case "LOGOUT": {
      return dotProp.set(state, `user`, { authenticated: false });
    }

    default:
      return state;
  }
}

const removeWordBanks = (state, classId) => {
  const wordBanks = dotProp.get(state, `classrooms.${classId}.wordbanks`);
  let newState = dotProp.get(state, "", state);
  for (const wordBank of wordBanks) {
    newState = removeWords(newState, wordBank);
    newState = dotProp.delete(newState, `wordbanks.${wordBank}`);
  }
  return newState;
};

const removeWords = (state, wordBankId) => {
  const words = dotProp.get(state, `wordbanks.${wordBankId}.words`);
  let newState = dotProp.get(state, "", state);
  for (const word of words) {
    newState = dotProp.delete(newState, `words.${word}`);
  }
  return newState;
};

const rootReducer = combineReducers({
  userData: userDataReducer
});

export default rootReducer;
