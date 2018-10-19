const initialState = {
  userID: '',
  name: '',
  email: '',
  loggedIn: false
}

export default function user(state = initialState, action) {
  switch (action.type) {
    case 'CREATE_USER':
      return { ...action.user }
    case 'CHANGE_USER_NAME':
      return Object.assign({}, ...state, { name: action.name })
    case 'CHANGE_EMAIL':
      return Object.assign({}, ...state, { email: action.email })
    default:
      return state
  }
}