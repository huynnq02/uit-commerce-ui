import { getAPIs } from "./Apis";
import customAxios from "./AxiosInterceptors";

const host = "http://127.0.0.1:8000";

export function getAPIActionJSON(
  type,
  data,
  params = "",
  addparams = "",
  onSuccess = () => {},
  onError = () => {}
) {
  const api = getAPIs[type];

  return (dispatch, getState) => {
    dispatch({ type: "loading.start" });
    customAxios({
      method: api.method, //POST
      url: host + api.path + addparams,
      params: params,
      data: data,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data", // Set the content type to 'multipart/form-data'
      },
    })
      .then(function (response) {
        dispatch({ type: "loading.success" });

        console.log(type, response.data);
        if (response.status === 200) {
          dispatch({
            type: `${type}.reply`,
            data: response.data,
            headers: response.headers,
          });
        }
        onSuccess(response.data);
      })
      .catch((e) => {
        dispatch({ type: "loading.success" });
        onError(e);
        console.log(e);
      });
  };
}
export async function getStatelessAPI(
  type,
  data,
  headers,
  params = {},
  addparams = ""
) {
  const api = getAPIs[type];
  try {
    const res = await customAxios({
      method: api.method,
      url: host + api.path + addparams,
      params: params,
      data: data,
      headers: headers,
    });
    const responseData = res.data;
    console.log(type, responseData);
    return responseData;
  } catch (error) {
    if (error) {
      // Error Handler
      console.log(error);
    }
  }
}
