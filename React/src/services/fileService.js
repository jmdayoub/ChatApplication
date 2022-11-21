import axios from "axios";
import {
  onGlobalError,
  onGlobalSuccess,
  API_HOST_PREFIX,
} from "./serviceHelpers";

import debug from "sabio-debug";
const _logger = debug.extend("fileService");

const fileService = {
  endpoint: `${API_HOST_PREFIX}/api/files`,
};

const uploadFile = (fileList) => {
  const config = {
    method: "POST",
    url: fileService.endpoint,
    data: fileList,
    headers: {
      "Content-Type": "multipart/form-data",
      accept: "application/json",
    },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const fileServices = { uploadFile };

export default fileServices;
