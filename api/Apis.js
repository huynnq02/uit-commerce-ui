export const getAPIs = {
  check_item_bought: {
    name: "check_item_bought",
    path: "/api/items/check_item_bought",
    method: "GET",
  },
  get_user_orders: {
    name: "get_user_orders",
    path: "/api/orders/get_user_orders",
    method: "GET",
  },
  login_user: {
    name: "login_user",
    path: "/api/auth/login_user",
    method: "POST",
  },
  create_item: {
    name: "create_item",
    path: "/api/items/create_item",
    method: "POST",
  },
  get_all_items: {
    name: "get_all_items",
    path: "/api/items/get_all_items",
    method: "GET",
  },
  update_user: {
    name: "update_user",
    path: "/api/users/update_user",
    method: "PUT",
  },
  create_order: {
    name: "create_order",
    path: "/api/orders/create_order",
    method: "POST",
  },
};
