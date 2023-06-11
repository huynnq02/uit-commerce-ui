import store from "../../index";
const initialState = {
  id: "",
  name: "",
  email: "",
  hotLine: "",
  profilePicture: "",
  address: "",
  items: [],
  isLoggedIn: false,
};

export default function UserReducer(state = initialState, action) {
  switch (action.type) {
    case "login_user.reply":
      if (action.data.success === true) {
        return {
          ...state,
          id: action.data.data.id,
          name: action.data.data.name,
          email: action.data.data.email,
          hotLine: action.data.data.hotLine,
          profilePicture: action.data.data.profilePicture,
          address: action.data.data.address,
          items: action.data.data.items,
          isLoggedIn: true,
        };
      }
      break;
    case "create_item.reply":
      if (action.data.success === true) {
        return {
          ...state,
          items: [...state.items, action.data.data],
        };
      } else {
        return {
          ...state,
          errorMessage: "Can't create item ",
        };
      }
    case "logout":
      return {
        ...state,
        isLoggedIn: false,
      };
    default:
      return state;
  }
}
