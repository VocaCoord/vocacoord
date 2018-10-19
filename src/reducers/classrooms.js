const initialState = [{
  className: '',
  classID: '',
  wordBankID: 0
}]

export default function classrooms(state = initialState, action) {
  switch (action.type) {
    case 'ADD_CLASSROOM':
      return [...state, action.classroom]
    case 'DELETE_CLASSROOM':
      return [...state.splice(state.indexOf(classroom => classroom.className === action.className), 1)]
    case 'CHANGE_CLASSROOM_NAME':
      return [...state.splice(state.indexOf(classroom => classroom.className === action.oldClassName), 1, action.newClassName)]
    default:
      return state
  }
}