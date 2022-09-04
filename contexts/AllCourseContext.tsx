/* eslint-disable require-jsdoc */
import React, { useContext, createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { getAllCourseInfoApi } from "../api";

export type AllCourseInfoDataType = {
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


export type AllCourseInfoContextData = {
  allCourseInfoDatas: Array<AllCourseInfoDataType>;

  loading?: boolean;
  // updateAllCourseInfo(props: UpdateInfoProps): Promise<any>;
  loadAllCourseInfoDatas(): Promise<void>;
};

const AllCourseInfoContext = createContext<AllCourseInfoContextData>(
  {} as AllCourseInfoContextData
);

// export function AuthProvider(props: React.PropsWithChildren<{}>) {
const AllCourseInfoProvider: React.FC = ({ children }) => {
  const [allCourseInfoDatas, setAllCourseInfoDatas] = useState<Array<AllCourseInfoDataType>>([{
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
    loadAllCourseInfoDatas();
  }, []);

  // async function loadAllCourseInfoData(): Promise<boolean> {
  const loadAllCourseInfoDatas = async (): Promise<any> => {
    const getAllCourseInfoResult = await getAllCourseInfoApi<any>({});
    try {
      if (getAllCourseInfoResult) {
        console.log("AllCourseInfoContext 69 加载用户数据正常", getAllCourseInfoResult,"\n========================");
        const data = getAllCourseInfoResult["data"]["courses"];
        
        const _allCourseInfoDatas: Array<AllCourseInfoDataType> = [];

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
            _allCourseInfoDatas.push(newCourseData);
        });
        console.log("AllCourseContext 99:",_allCourseInfoDatas[0], _allCourseInfoDatas.length);
        setAllCourseInfoDatas(_allCourseInfoDatas);
        return true;
      }else{
          console.log("ACC-104: load courece no result!");
          return false;
      }
    } catch (err) {
      console.log("AllCourseInfoContext 35 ERR", err);
      return false;
    }
  };



  return (
    <AllCourseInfoContext.Provider
      value={{ allCourseInfoDatas, loading, loadAllCourseInfoDatas }}
    >
      {children}
    </AllCourseInfoContext.Provider>
  );
};

function useAllCourseInfoData(): AllCourseInfoContextData {
  const context = useContext(AllCourseInfoContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export { AllCourseInfoContext, AllCourseInfoProvider, useAllCourseInfoData };