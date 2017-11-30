import { STORAGE } from './storage';
import { AppSetting } from './../appsettings/index';
import axios, { AxiosInstance } from 'axios';
import { Container } from "aurelia-dependency-injection";
import Qs from 'qs';
import * as _ from 'lodash'
let storage = Container.instance.get(STORAGE);
axios.defaults.baseURL = AppSetting.apiEndPoint;

const removeEmpty = (obj) => {
    Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key]);
        else {
            if (obj[key] == null || typeof obj[key] == 'undefined' || obj[key] == '') delete obj[key]
            else
                if (!/%/.test(obj[key]) && /like/.test(key) && obj[key] != '') obj[key] = `%${obj[key]}%`
        }
    });
    return obj;
}
axios.defaults.paramsSerializer = function (params) {
    params = removeEmpty(params)
    return Qs.stringify(params)
}
// storage.get(STORAGE.tokenKey) ? axios.defaults.headers.common['Authorization'] = storage.get(STORAGE.tokenKey) : null

// sau này sẽ mở để tăng tính bảo mật
// if(storage.get("authenToken"))
//     axios.defaults.headers.common['Authorization'] = storage.get("authenToken");
// else
//     axios.defaults.headers.common['Authorization'] = null;

