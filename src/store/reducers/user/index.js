const initialState = {
  id: "",
  name: "",
  email: "",
  phone_number: "",
  profile_picture: "",
  address: "",
  items: [],
  isLoggedIn: false,
  orders: [],
};

export default function UserReducer(state = initialState, action) {
  switch (action.type) {
    case "create_order.reply":
      if (action.data.success === true) {
        return {
          ...state,
          orders: [...state.orders, ...action.data.data], // Concatenate the existing orders with the new data
        };
      } else {
        console.log("Hinh nhu sai o dau do roi huhu");
      }
    case "update_user.reply":
      if (action.data.success === true) {
        return {
          ...state,
          id: action.data.data.id,
          name: action.data.data.name,
          email: action.data.data.email,
          phone_number: action.data.data.phone_number,
          profile_picture: action.data.data.profile_picture,
          address: action.data.data.address,
          items: action.data.data.items,
          orders: action.data.data.orders,
          isLoggedIn: true,
        };
      } else {
        console.log("Hinh nhu sai o dau do roi huhu");
      }
    case "login_user.reply":
      if (action.data.success === true) {
        return {
          ...state,
          id: action.data.data.id,
          name: action.data.data.name,
          email: action.data.data.email,
          phone_number: action.data.data.phone_number,
          profile_picture: action.data.data.profile_picture,
          address: action.data.data.address,
          items: action.data.data.items,
          orders: action.data.data.orders,
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
