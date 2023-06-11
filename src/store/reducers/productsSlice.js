const initialState = {
  products: [],
  filteredProducts: [],
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case "get_all_items.reply":
      if (action.data.results.success === true) {
        console.log("HAHHAAHHAA");
        console.log(action.data.results.data);
        return {
          ...state,
          products: action.data.results.data,
          filteredProducts: action.data.results.data,
        };
      } else {
        return {
          ...state,
          errorMessage: "Can't get items",
        };
      }
    case "ADD_PRODUCTS":
      return {
        ...state,
        products: action.payload,
        filteredProducts: action.payload,
      };
    case "FILTER_PRODUCTS":
      if (action.payload === null) {
        return {
          ...state,
          filteredProducts: [],
        };
      } else {
        return {
          ...state,
          filteredProducts: action.payload,
        };
      }
    default:
      return state;
  }
};

export default productReducer;
