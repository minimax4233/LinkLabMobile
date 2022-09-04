/* eslint-disable require-jsdoc */
import React, { useContext, createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
// import { AuthContextData, AuthData, LoginApiData } from "../types";
// import { AxiosProvider } from "./AxiosContext";
import { getMyCourseInfoApi } from "../api";

export type MyCourseInfoDataType = {
  cid: number;
  cname: string;
  teacherName: string;
  startTime: string;
  endTime: string;
  description: string;
  imageUrl: string;
  isPublic: boolean;
  password: string;
  school: string;
  isVisible: boolean;
  inHomepage: boolean;
  avgEvaluation: number;
  tags: any;
  number: string;
};


export type MyCourseInfoContextData = {
  myCourseInfoDatas: Array<MyCourseInfoDataType>;

  loading?: boolean;
  // updateMyCourseInfo(props: UpdateInfoProps): Promise<any>;
  loadMyCourseInfoDatas(): Promise<void>;
};

const MyCourseInfoContext = createContext<MyCourseInfoContextData>(
  {} as MyCourseInfoContextData
);

// export function AuthProvider(props: React.PropsWithChildren<{}>) {
const MyCourseInfoProvider: React.FC = ({ children }) => {
  const [myCourseInfoDatas, setMyCourseInfoDatas] = useState<Array<MyCourseInfoDataType>>([{
    cid: 0,
    cname: 'Default Course',
    teacherName: 'Default Teacher',
    startTime: '',
    endTime: '',
    description: 'Default Description',
    imageUrl: 'https://linklab.domain.com/static/img/courses_common.jpg',
    isPublic: true,
    password: '',
    school: 'Default School',
    isVisible: true,
    inHomepage: true,
    avgEvaluation: 0,
    tags: '',
    number: '',
  },{
    cid: 1,
    cname: 'Default Course1',
    teacherName: 'Default Teacher1',
    startTime: '',
    endTime: '',
    description: 'Default Description1',
    imageUrl: 'https://linklab.domain.com/static/img/courses_common.jpg',
    isPublic: true,
    password: '',
    school: 'Default School1',
    isVisible: true,
    inHomepage: true,
    avgEvaluation: 0,
    tags: '',
    number: '',
  }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Every time the App is opened, this provider is rendered and call de loadStorage function.
    loadMyCourseInfoDatas();
  }, []);

  // async function loadMyCourseInfoData(): Promise<boolean> {
  const loadMyCourseInfoDatas = async (): Promise<any> => {
    const getMyCourseInfoResult = await getMyCourseInfoApi<any>({});
    try {
      if (getMyCourseInfoResult) {
        console.log("MyCourseInfoContext 69 加载用户数据正常", getMyCourseInfoResult,"\n========================");
        const data = getMyCourseInfoResult["data"]["courses"];

        
        const _myCourseInfoDatas: Array<MyCourseInfoDataType> = [];

        data.forEach((course, index) => {
            console.log(index,course)
            const newCourseData ={
                cid: course['cid'],
                cname: course['cname'],
                teacherName: course['teacher_name'],
                startTime: course['start_time'],
                endTime: course['end_time'],
                description: course['description'],
                imageUrl: course['image_url'],
                isPublic: course['is_public'],
                password: course['password'],
                school: course['school'],
                isVisible: course['is_visible'],
                inHomepage: course['in_homepage'],
                avgEvaluation: course['avg_evaluation'],
                tags: course['tags'],
                number: course['number'],
            }
            _myCourseInfoDatas.push(newCourseData);
        });
        console.log("MyCourseContext 99:",_myCourseInfoDatas[0], _myCourseInfoDatas.length);
        // console.log(_MyCourseInfoData)
        setMyCourseInfoDatas(_myCourseInfoDatas);
        return true;
      }else{
          console.log("ACC-104: load courece no result!");
          return false;
      }
    } catch (err) {
      console.log("MyCourseInfoContext 35 ERR", err);
      return false;
    }
  };



  return (
    <MyCourseInfoContext.Provider
      value={{ myCourseInfoDatas, loading, loadMyCourseInfoDatas }}
    >
      {children}
    </MyCourseInfoContext.Provider>
  );
};

function useMyCourseInfoData(): MyCourseInfoContextData {
  const context = useContext(MyCourseInfoContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export { MyCourseInfoContext, MyCourseInfoProvider, useMyCourseInfoData };