import axios, { AxiosRequestConfig } from 'axios';
import * as SecureStore from "expo-secure-store";
import sendAlert from '../components/SendAlert';
import FormData from 'form-data'

const OUTPUT_DATA = true
const OUTPUT_ERROR_DATA = true
const ERROR_AUTO_SIGNOUT = false

// 基础URL，axios将会自动拼接在url前
// process.env.NODE_ENV 判断是否为开发环境 根据不同环境使用不同的baseUrl 方便调试
// url 不可以, 已去取敏感信息
const authUrl = 'https://sso.test.domain.com';
// const authUrl =  'https://sso.domain.com';
const baseURL = 'https://api.test.domain.com';
// const baseURL =  'https://api.domain.com'; 

// 默认请求超时时间
const timeout = 5000;


// 创建axios实例
const service = axios.create({
  timeout,
  baseURL,
  // 如需要携带cookie 该值需设为true
  withCredentials: false
});

// 统一请求拦截 可配置自定义headers 例如 language、token等
service.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    // console.log(config);
    const res = await SecureStore.getItemAsync("AuthData");
    // 加上验证token
    if (res) {
      const _authData = JSON.parse(String(res));
      config.headers.Authorization = "Bearer " + _authData.accessToken;
    }

    // 处理axios form data BUG
    if (config?.headers?.hasOwnProperty("Content-Type") && config.headers["Content-Type"] == "multipart/form-data") {
      config.transformRequest = (data, error) => {
        const formData = new FormData();
        for (const [key, value] of Object.entries(data)) {
          formData.append(key, value);
        }
        if (OUTPUT_DATA) { console.log("req Context type is form data:", data, formData); };
        return formData;
      }
    }
    return config

  },
  error => {
    if (OUTPUT_ERROR_DATA) { console.log(error) };
    Promise.reject(error)
  }
)

// axios返回格式
interface axiosTypes<T> {
  data: T;
  status: number;
  statusText: string;
}

// 后台响应数据格式
// 该接口用于规定后台返回的数据格式，意为必须携带code、msg以及result
// 而result的数据格式 由外部提供。如此即可根据不同需求，定制不同的数据格式
interface responseTypes<T> {
  code: number,
  msg: string,
  result: T
}

// 核心处理代码 将返回一个 promise 调用 then 将可获取响应的业务数据
const requestHandler = <T>(method: 'get' | 'post' | 'put' | 'delete', url: string, params: object = {}, config: AxiosRequestConfig = {}): Promise<T> => {
  let response: Promise<axiosTypes<responseTypes<T>>>;
  switch (method) {
    case 'get':
      console.log("Request Get:* ", params);
      // 处理 get 方式, 将 Get 中所有的参数转换并加入到 url 中
      let newUrl = url + '?';
      if (params) {
        for (const [key, value] of Object.entries(params)) {
          newUrl += key + '=' + value + '&';
        }
        // 去除多余的符号
        newUrl = newUrl.substring(0, newUrl.length - 1);
        console.log("Request Get Url:", newUrl);
      }
      response = service.get(newUrl, { params: { ...params }, ...config });

      break;
    case 'post':
      response = service.post(url, { ...params }, { ...config });
      break;
    case 'put':
      response = service.put(url, { ...params }, { ...config });
      break;
    case 'delete':
      response = service.delete(url, { params: { ...params }, ...config });
      break;
  }

  return new Promise<T>((resolve, reject) => {
    response.then(res => {
      const data = res.data;
      const jsonData = JSON.stringify(data);
      if (OUTPUT_DATA) { console.log(`request-128 response:`, data); };
      const result = JSON.parse(jsonData);
      if (res.status !== 200) {
        const e = JSON.stringify(data);
        sendAlert('WARN', 'WARN', `请求错误：${e}`);
        if (OUTPUT_ERROR_DATA) { console.log(`请求错误：${e}`) };
        // 数据请求错误 使用reject将错误返回
        reject(data);
      }
      if (result['code'] !== 0) {

        // 特定状态码 处理特定的需求
        if (result['code'] == 411) {
          sendAlert('WARN', 'WARN', result['message']);
          if (OUTPUT_DATA) { console.log('登录状态失效', result['message']); };
          SecureStore.deleteItemAsync("AuthData")
        } else if(result['code'] == 1 && result['message'] == '资源不存在'){
          // FAQ 没有资源时
          resolve(result);
        } else {
          // 处理 getAllChapterOfCourseApi 不规范的回应
          if (result[0]['chap_id'] >= 0) {
            // 正常接收到 Chpater of courese data
            if (OUTPUT_DATA) { console.log(`request-161 章节数据请求正确返回结果:`, result); };
            resolve(result);
          } else {
            // 其他情況, 真错误
            sendAlert('WARN', 'WARN', result['message']);
            SecureStore.deleteItemAsync("AuthData");
            if (OUTPUT_ERROR_DATA) { console.log('登录异常，执行登出...', result['code'], result['message']); 
            reject(result);
          };
          }
        }
      } else {
        // 数据请求正确 使用resolve将结果返回
        if (OUTPUT_DATA) { console.log('request-152 数据请求正确返回结果:', result) };
        if (ERROR_AUTO_SIGNOUT) {SecureStore.deleteItemAsync("AuthData");};
        resolve(result);
      }

    }).catch(error => {
      const e = JSON.stringify(error);
      // sendAlert('网络错误', 'WARN', error.message);
      if (OUTPUT_ERROR_DATA) { console.log(`error L105:${error}`); };
      if (OUTPUT_ERROR_DATA) { console.log(`网络错误：`, e); };
      reject(error);
    })
  })
}

// 使用 request 统一调用，包括封装的get、post、put、delete等方法
const request = {
  get: <T>(url: string, params?: object, config?: AxiosRequestConfig) => requestHandler<T>('get', url, params, config),
  post: <T>(url: string, params?: object, config?: AxiosRequestConfig) => requestHandler<T>('post', url, params, config),
  put: <T>(url: string, params?: object, config?: AxiosRequestConfig) => requestHandler<T>('put', url, params, config),
  delete: <T>(url: string, params?: object, config?: AxiosRequestConfig) => requestHandler<T>('delete', url, params, config)
};

// AUTH


const authRequest = <T>(params: object = {}, config: AxiosRequestConfig = {}): Promise<T> => {
  const formData = new FormData();
  formData.append('client_id', 'LinklabP');
  formData.append('client_secret', 'secret');
  formData.append('scope', 'all');
  formData.append('grant_type', 'password');
  formData.append('password', (params as any)['password']);
  formData.append('username', (params as any)['username']);

  const authResponse = axios({
    method: 'POST', baseURL: authUrl, url: '/oauth/token', data: formData, headers: {
      'Content-Type': 'multipart/form-data'
    },
    transformRequest: (data, error) => {
      return formData;
    }
  });
  return new Promise<T>((resolve, reject) => {
    authResponse.then(res => {
      const data = res.data;
      const jsonData = JSON.stringify(data);
      if (OUTPUT_DATA) { console.log(`requset-217 res.status: ${res.status}`); };
      if (OUTPUT_DATA) { console.log(`requset-218: res.jsonData ${jsonData}`); };
      if (res.status !== 200) {

        const e = JSON.stringify(data);
        sendAlert('WARN', '错误', `请求错误：${e}`);
        if (OUTPUT_ERROR_DATA) { console.log(`request-223 请求错误：${e}`) }
        // 数据请求错误 使用reject将错误返回
        reject(data);
      } else {
        const result = JSON.parse(JSON.stringify(data));
        // 400 代表帐号或密码错
        if (result['code'] == 400) {
          // sendAlert('ERROR', '错误', '您的账号或密码不正确!');
          if (OUTPUT_ERROR_DATA) { console.log('request-231 账号或密码不正确'); };
          reject(result);

        } else if (!result['code'] && result['access_token']) { // code一栏不存在代表正常
          if (OUTPUT_DATA) { console.log(`request-234 token:${result['access_token']}`); };
          sendAlert('INFO', 'Welcome', `登录成功, 正在跳转!`);
          resolve(result);
        }


        // 数据请求正确 使用resolve将结果返回

      }

    }).catch(error => {
      const e = JSON.stringify(error);
      if (OUTPUT_ERROR_DATA) { console.log(); };
      sendAlert('ERROR', '错误', `网络错误：${error}`);
      if (OUTPUT_ERROR_DATA) { console.log(`request-252 网络错误：${e}`); };
      reject(error);
    })
  })
}


// 导出至外层，方便统一使用
export { request, authRequest };