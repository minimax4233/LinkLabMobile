/* eslint-disable require-jsdoc */
import React, { useContext, createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { getUserInfo, updateUserInfoApi } from "../api";

export type UserInfoDataType = {
  uid: string;
  uname: string;
  email: string;
  jSessionId: string;
  courseId: string;
  expType: string;
  isResearch: string;
  ppid: string;
  tinyId: string;
  tinyPasswd: string;
  type: string;
  vid: string;
};

interface UpdateInfoProps {
  uid: string;
  name: string;
  stuNumber?: string;
  homeUrl?: string;
}

export type UserInfoContextData = {
  userInfoData: UserInfoDataType;
  loading?: boolean;
  updateUserInfo(props: UpdateInfoProps): Promise<any>;
  loadUserInfoData(): Promise<void>;
};

const UserInfoContext = createContext<UserInfoContextData>(
  {} as UserInfoContextData
);

// export function AuthProvider(props: React.PropsWithChildren<{}>) {
const UserInfoProvider: React.FC = ({ children }) => {
  const [userInfoData, setUserInfoData] = useState<UserInfoDataType>({
    uid: "your id",
    uname: "your name",
    email: "youremail@email.com",
    jSessionId: "",
    courseId: "",
    expType: "",
    isResearch: "0",
    ppid: "",
    tinyId: "",
    tinyPasswd: "",
    type: "",
    vid: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Every time the App is opened, this provider is rendered and call de loadStorage function.
    loadUserInfoData();
  }, []);

  // async function loadUserInfoData(): Promise<boolean> {
  const loadUserInfoData = async (): Promise<any> => {
    const getUserInfoResult = await getUserInfo<any>({});
    try {
      if (getUserInfoResult) {
        console.log("userinfoContext 69 加载用户数据正常", getUserInfoResult);
        const data = getUserInfoResult["data"];
        const _userInfoData: UserInfoDataType = {
          uid: data["UID"],
          email: data["email"],
          uname: data["uname"],
          jSessionId: data["JSESSIONID"],
          courseId: data["courseId"],
          expType: data["expType"],
          isResearch: data["isResearch"],
          ppid: data["ppid"],
          tinyId: data["tinyId"],
          tinyPasswd: data["tinyPasswd"],
          type: data["type"],
          vid: data["vid"],
        };
        // console.log(_userInfoData)
        setUserInfoData(_userInfoData);
        return true;
      }
    } catch (err) {
      console.log("userinfoContext 35 ERR", err);
      return false;
    }

  };

  const updateUserInfo = async (props: UpdateInfoProps) => {
    // console.log("in update user info", props)
    try {
      setLoading(true);
      console.log("in update user info", props);
      const updateResult = await updateUserInfoApi({
        uid: props.uid,
        name: props.name,
        homeUrl: "",
        stuNumber: "",
      });
      if (updateResult["code"] == 0) {
        console.log("userinfoContext 118 更新信息正常", updateResult);
        const loadResult = await loadUserInfoData();
        if (loadResult) {
          console.log("userinfo loadresult", loadResult);
          setLoading(false);
          return Promise.resolve(true);
        }
        setLoading(false);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log("userinfo context 115 error", e);
      return Promise.reject(e);
    }
  };

  return (
    <UserInfoContext.Provider
      value={{ userInfoData, loading, updateUserInfo, loadUserInfoData }}
    >
      {children}
    </UserInfoContext.Provider>
  );
};

function useUserInfoData(): UserInfoContextData {
  const context = useContext(UserInfoContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export { UserInfoContext, UserInfoProvider, useUserInfoData };
