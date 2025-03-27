import axios from "axios";
import toast from "react-hot-toast";

const APIRequest = async (baseURL, methods, url, body, header, onUploadProgress, params) => {
  const accessToken = localStorage.getItem("token");
  let config = {
    method: methods,
    url: baseURL + url,
    headers: header
      ? header
      : accessToken ? {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      } : {
        "Content-Type": "application/json",
      },
    data: body,
    params: params,
    onUploadProgress: onUploadProgress
  };

  return axios(config)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      if(error.response.status === 401){
        localStorage.clear();
        window.location.href = '/login';
        toast.error(error.response.data.message);
      }
      throw error;
    });
};
export default APIRequest;
