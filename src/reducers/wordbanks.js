const initialState = [{
  name: '',
  createdAt: '',
  words: []
}]

export default function wordBanks(state = initialState, action) {
  switch (action.type) {
    case 'ADD_WORD_BANK':
      return [...state, action.wordBank]
    case 'DELETE_WORD_BANK':
      return [...state.splice(state.indexOf(bank => bank.name === action.name), 1)]
    case 'CHANGE_WORD_BANK_NAME':
      return [...state.splice(state.indexOf(bank => bank.name === action.oldName), 1, action.newName)]
    default:
      return state
  }
}