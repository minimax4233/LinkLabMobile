/* eslint-disable require-jsdoc */
import React, { useContext, createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { AuthContextData, AuthData, LoginApiData } from "../types";
// import { AxiosProvider } from "./AxiosContext";
import { loginApi } from "../api";
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// export function AuthProvider(props: React.PropsWithChildren<{}>) {
const AuthProvider: React.FC = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData>({
    accessToken: "",
    refreshToken: "",
    authenticated: false,
    expires: 0,
    tokenType: "",
    expires_in: 0,
    uid: "",
    siteId: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Every time the App is opened, this provider is rendered and call de loadStorage function.
    setLoading(true);
    loadStorageData();
  }, []);

  async function loadStorageData(): Promise<void> {
    try {
      // Try get the data from Async Storage
      const authDataSerialized = await SecureStore.getItemAsync("AuthData");
      if (authDataSerialized) {
        // If there are data, it's converted to an Object and the state is updated.
        const _authData: AuthData = JSON.parse(authDataSerialized);
        if (_authData.expires < Date.parse(new Date().toString())){
          // await SecureStore.deleteItemAsync("AuthData");
          console.log("登录已过期, 请重新登录!");
          signOut()
        }else{
          console.log("已自动登录!", _authData.accessToken);
          setAuthData(_authData);
        }
      }
    } catch (error) {
    } finally {
      // loading finished
      setLoading(false);
    }
  }
  /**
   * 登录操作, 并写入到安全空間中, 修改登录狀态, 计算过程时间.
   * @param {string}  username  用户名称
   * @param {string}  password  密码
   */
  const login = async (username: string, password: string) => {
    setLoading(true);
    const _loginResult = await loginApi({
      username: username,
      password: password,
    })
      .then((res: any) => {
        // login success

        const _authData: AuthData = {
          accessToken: res["access_token"],
          refreshToken: "",
          authenticated: true,
          expires: res["expires_in"] * 1000 + Date.parse(new Date().toString()),
          tokenType: res["token_type"],
          expires_in: res["expires_in"],
          uid: res["uid"],
          siteId: res["siteId"],
        };
        setAuthData(_authData);
        const authDataSerialized = SecureStore.setItemAsync(
          "AuthData",
          JSON.stringify(_authData)
        ).then((res) =>{
          console.log(JSON.stringify({_authData,}), JSON.stringify(_authData))
        }).catch((error) =>
          console.log(
            "Could not save user info ",
            error,
            JSON.stringify({
              _authData,
            })
          )
        );
        console.log("auth-69 Login Auth Data: ", _authData);
        return Promise.resolve(true);
      })
      .catch((err) => {
        // login Fail

        console.log("auth-50 Login Error Data:", err);
        return Promise.reject(err);
      })
      .finally(() => {
        setLoading(false);
      });

  };

  const signOut = async () => {
    setAuthData({
      accessToken: "",
      refreshToken: "",
      authenticated: false,
      expires: 0,
      tokenType: "",
      expires_in: 0,
      uid: "",
      siteId: 0,
    });
    console.log("sign out")

    // Remove the data from Async Storage to NOT be recoverede in next session.
    await SecureStore.deleteItemAsync("AuthData");
  };

  const getAccessToken = () => {
    return authData.accessToken;
  };

  const getExpries = () => {
    return authData.expires;
  };

  return (
    <AuthContext.Provider
      value={{ authData, loading, login, signOut, getAccessToken, getExpries }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export { AuthContext, AuthProvider, useAuth };

