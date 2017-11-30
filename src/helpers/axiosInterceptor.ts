import { getLogger } from 'aurelia-logging';
import { LogManager } from 'aurelia-framework';
import axios from "axios";
let logger = getLogger("Axios interceptor");
axios.interceptors.request.use(function (config) {
  logger.info('config', config);
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});
