/* eslint-disable require-jsdoc */
import { useFocusEffect } from "@react-navigation/native";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  LayoutAnimation,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  UIManager,
} from "react-native";
import {
  Image,
  Text,
  ListItem,
  Divider,
  Rating,
  Button,
  Input,
  Icon,
  InputProps,
  Tab,
  TabView,
  colors,
} from "react-native-elements";

// import EditScreenInfo from '../components/EditScreenInfo';
import { View } from "../components/Themed";
import { RootStackParamList } from "../types";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import SendAlert from "../components/SendAlert";
import { getAllAssignmentOfCourseApi, getAllChapterOfCourseApi } from "../api";

// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental
  ? UIManager.setLayoutAnimationEnabledExperimental(true)
  : {};

export type ChapterResourcesDataType = {
  id: number;
  owner_id: string;
  type: number;
  file_url: string;
  name: string;
  end_time: number;
  size: number;
  order: number;
  admin_knows: Array<any>;
  teacher_knows: Array<any>;
};

export type ChapterNewResourcesDataType = {
  id: number;
  data: ChapterResourcesDataType;
  type: number;
  order: number;
};
export type ChapterExperimentsDataType = {
  title: string;
  type: number;
  userVisibility: any;
  description: string;
  deviceType: any;
  effective: number;
  videoAddress: string;
  resourceAddress: string;
  visibility: any;
  reportAddress: string;
  experiments_report: any;
  free: number;
  owner: string;
  reference: string;
  address: string;
  tags: Array<any>;
  knows: Array<any>;
  ppid: any;
  vid: number;
};
export type ChapterQuizDataType = {};
export type ChapterTeacherViewVosDataType = {};

export type CourseChapterDataType = {
  chapterId: number;
  cid: number;
  chapterName: string;
  resources: Array<ChapterResourcesDataType>;
  experiments: Array<ChapterExperimentsDataType>;
  quiz: Array<ChapterQuizDataType>;
  teacherViewVos: Array<ChapterTeacherViewVosDataType>;
  newResources: Array<ChapterNewResourcesDataType>;
};

export type AssignmentDataType = {
  chapterName: string;
  endTime: string;
  fileUrl: string;
  id: number;
  name: string;
  state: string;
  uploadedFile: string;
  video: boolean;
  cid?: number;
};

interface InfoCardProps {
  cid?: number;
}
interface RenderChapterItemProps {
  courseChapterDatas: Array<CourseChapterDataType>;
  assignmentDatas: Array<AssignmentDataType>;
}

interface loadCourseChapterDataProps {
  cid: number;
}

interface loadAssignmentDataProps {
  cid: number;
}

// const InfoCard: React.FunctionComponent<InfoCardComponentsProps> = () => {
function InfoCard(props: InfoCardProps) {
  // 课程章节信息
  const [courseChapterDatas, setCourseChapterDatas] = useState<
    Array<CourseChapterDataType>
  >([
    {
      chapterId: -1,
      cid: -1,
      chapterName: "Default Chapter",
      resources: [],
      experiments: [],
      quiz: [],
      teacherViewVos: [],
      newResources: [],
    },
  ]);
  // const [isLoading, setLoading] = useState<boolean>(false);

  // 作业信息
  const [assigmentDatas, setAssigmentDatas] = useState<
    Array<AssignmentDataType>
  >([
    {
      chapterName: "Default Chapter",
      endTime: "",
      fileUrl: "",
      id: -1,
      name: "Default Name",
      state: "",
      uploadedFile: "",
      video: false,
      cid: -1,
    },
  ]);

  useFocusEffect(() => {
    if (
      true &&
      (courseChapterDatas[0].cid < 0 ||
        courseChapterDatas[0].cid != Number(props.cid))
    ) {
      console.log(
        "CSS-FocusEffect chapterDatas[0]cid",
        courseChapterDatas[0].cid,
        "props",
        props.cid
      );
      loadCourseChapterData({ cid: Number(props.cid) });
    }
    if (
      assigmentDatas[0].cid < 0 ||
      assigmentDatas[0].cid != Number(props.cid)
    ) {
      console.log(
        "CSS-FocusEffect assigmentDatas[0]cid",
        assigmentDatas[0].cid,
        "props",
        props.cid
      );
      loadAssignmentData({ cid: Number(props.cid) });
    }
  });

  // 加载课程章节信息
  const loadCourseChapterData = async (
    props: loadCourseChapterDataProps
  ): Promise<any> => {
    if (props.cid == courseChapterDatas[0].cid) {
      return false;
    }
    if (Number(props.cid) < 0) {
      return false;
    }
    // setLoading(true);
    console.log(
      "CContent : props.cid:",
      props.cid,
      " dataCId:",
      courseChapterDatas[0].cid
    );
    console.log("CCS-157- 訪問all chapter API", props.cid);
    const getCourseChapterResult = await getAllChapterOfCourseApi<any>({
      cid: props.cid,
    });
    try {
      if (getCourseChapterResult) {
        console.log(
          "CourseChapterScreen 69 加载课程章节信息数据正常",
          getCourseChapterResult
        );

        const _courseChapterDatas: Array<CourseChapterDataType> = [];

        const datas = getCourseChapterResult;

        datas.forEach((data, index) => {
          console.log(index, data);
          const newChapterData: CourseChapterDataType = {
            chapterId: data["chap_id"],
            cid: data["cid"],
            chapterName: data["name"],
            resources: data["allResources"],
            experiments: data["allExperiments"],
            quiz: data["allQuiz"],
            teacherViewVos: data["teacherViewVos"],
            newResources: data["newResources"],
          };
          _courseChapterDatas.push(newChapterData);
        });
        // setLoading(false);
        console.log("CourseChapterContext 99:", _courseChapterDatas);
        // console.log(_CourseChapterData)
        setCourseChapterDatas(_courseChapterDatas);
        return courseChapterDatas;
      } else {
        console.log("CCS-170: load course content no result!");
        // setLoading(false);
        return false;
      }
    } catch (err) {
      console.log("CourseChapterScreen 174 ERR", err);
      // setLoading(false);
      return false;
    }
  };

  // 加载作业信息
  const loadAssignmentData = async (
    props: loadAssignmentDataProps
  ): Promise<any> => {
    if (props.cid == assigmentDatas[0].cid) {
      return false;
    }
    if (Number(props.cid) < 0) {
      return false;
    }
    // setLoading(true);
    console.log(
      "CContent : props.cid:",
      props.cid,
      " Assigment CId:",
      assigmentDatas[0].cid
    );
    console.log("CCS-157- 訪問Assigment API", props.cid);
    const getAssignmentResult = await getAllAssignmentOfCourseApi<any>({
      courseId: props.cid,
    });

    try {
      if (getAssignmentResult) {
        console.log(
          "CourseChapterScreen 69 加载课程作业信息数据正常",
          getAssignmentResult
        );

        const _assignmentDatas: Array<AssignmentDataType> = [];

        const datas = getAssignmentResult["data"];

        datas.forEach((data, index) => {
          console.log(index, data);
          const tempEndTime = new Date(data["end_time"]);
          const endTimeString = tempEndTime.getFullYear() + "-" + (tempEndTime.getMonth() + 1) + "-" + tempEndTime.getDate() + ' ' + tempEndTime.getHours() + ':' + tempEndTime.getMinutes() + ':' + tempEndTime.getSeconds(); 
          const newAssignmentData: AssignmentDataType = {
            chapterName: data["chap_name"],
            endTime: endTimeString,
            fileUrl: data["file_url"],
            id: data["id"],
            name: data["name"],
            state: data["state"],
            uploadedFile: data["uploadedFile"],
            video: data["video"],
            cid: props.cid,
          };
          _assignmentDatas.push(newAssignmentData);
        });
        // setLoading(false);

        // console.log(_CourseChapterData)
        setAssigmentDatas(_assignmentDatas);
        console.log("CCS-作业data 99:", _assignmentDatas, assigmentDatas);
        return assigmentDatas;
      } else {
        console.log("CCS-170: load assignment no result!");
        // setLoading(false);
        return false;
      }
    } catch (err) {
      console.log("CourseChapterScreen assignment 302 ERR", err);
      // setLoading(false);
      return false;
    }
  };

  return (
    <>
      <RenderChapterItem
        courseChapterDatas={courseChapterDatas}
        assignmentDatas={assigmentDatas}
      />
    </>
  );
}

function RenderChapterItem(props: RenderChapterItemProps) {
  // 通用
  const openUrl = (url: string) => {
    Linking.openURL(url);
  };
  // tab
  const [tabIndex, setTabIndex] = useState<number>(0);
  // 章节使用的声明变量
  const chapterDatas = props.courseChapterDatas;
  const [isChapterOpen, setChapterOpen] = useState<number>(-1);

  // 作业信息使用的声明变量
  const assignmentDatas = props.assignmentDatas;
  const [expanded, setExpanded] = useState<boolean>(false);

  // 章节使用的下列动画
  const chapterToggleOpen = (chapterIndex: number) => {
    if (chapterIndex != isChapterOpen) {
      setChapterOpen(chapterIndex);
    } else {
      setChapterOpen(-1);
    }
    LayoutAnimation.easeInEaseOut();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };


  return (
    <>
      <Tab
        value={tabIndex}
        onChange={(e) => setTabIndex(e)}
        indicatorStyle={{
          backgroundColor: "white",
          height: 3,
        }}
        variant="primary"
      >
        <Tab.Item
          title="章节"
          titleStyle={{ fontSize: 12 }}
          icon={{ name: "bars", type: "antdesign", color: "white" }}
        />
        <Tab.Item
          title="作业信息"
          titleStyle={{ fontSize: 12 }}
          icon={{ name: "filetext1", type: "antdesign", color: "white" }}
        />
        <Tab.Item
          title="常见问题"
          titleStyle={{ fontSize: 12 }}
          icon={{ name: "questioncircleo", type: "antdesign", color: "white" }}
        />
        <Tab.Item
          title="公告"
          titleStyle={{ fontSize: 12 }}
          icon={{ name: "sound", type: "antdesign", color: "white" }}
        />
      </Tab>

      <TabView value={tabIndex} onChange={setTabIndex} animationType="spring">
        <TabView.Item style={{ width: "100%" }}>
          {/* 课程內容 章节*/}
          <View style={styles.container}>
            <>
              {chapterDatas[0].chapterName == "Default Chapter" ? (
                <Text style={styles.textTitle}> 此课程还没有內容! </Text>
              ) : (
                chapterDatas.map((chapter, chapterIndex) => (
                  <>
                    <TouchableOpacity
                      onPress={() => chapterToggleOpen(chapterIndex)}
                      style={styles.heading}
                      activeOpacity={0.6}
                    >
                      <Text style={styles.title}>{chapter.chapterName}</Text>
                      <Icon
                        name={
                          isChapterOpen == chapterIndex
                            ? "chevron-up-outline"
                            : "chevron-down-outline"
                        }
                        type="ionicon"
                        size={18}
                        color="black"
                      />
                    </TouchableOpacity>
                    <View
                      style={[
                        styles.list,
                        isChapterOpen != chapterIndex
                          ? styles.hidden
                          : undefined,
                      ]}
                    >
                      {
                        // 章节內容:
                        chapter.newResources.map((resource, chapterIndex) =>
                          resource.type == 1 && resource.data.file_url != "" ? (
                            <>
                              <TouchableOpacity
                                onPress={() => openUrl(resource.data.file_url)}
                                style={styles.chapterheading}
                                activeOpacity={0.6}
                              >
                                <View style={styles.chapterheadingNameIcon}>
                                  <Icon
                                    name={
                                      resource.data.type == 3
                                        ? "videocamera"
                                        : "profile"
                                    }
                                    type="antdesign"
                                    size={18}
                                    color={
                                      resource.data.type == 3 ? "red" : "green"
                                    }
                                    style={{ paddingRight: 5 }}
                                  />
                                  <Text style={styles.chapterbody}>
                                    {resource.data.name}
                                  </Text>
                                </View>
                                <Icon
                                  name="download"
                                  type="antdesign"
                                  size={18}
                                  color="black"
                                />
                              </TouchableOpacity>
                            </>
                          ) : (
                            <></>
                          )
                        )
                      }
                    </View>
                    <View style={{ alignItems: "center" }}>
                      <View style={styles.divider} />
                    </View>
                  </>
                ))
              )}
            </>
          </View>
        </TabView.Item>
        {/* 作业信息*/}
        <TabView.Item style={{ width: "100%" }}>
          <View style={styles.container}>
            {assignmentDatas[0].name == "Default Name" ? (
              <>
                {console.log("h ", assignmentDatas)}
                <Text style={styles.textTitle}>此课程还没有发布作业信息!</Text>
              </>
            ) : (
              <View style={styles.newlist}>
                {assignmentDatas.map((data, index) => (
                  <>
                    {console.log(data)}
                    <ListItem key={index} bottomDivider>
                      <ListItem.Content>
                        <ListItem.Title style={{ color: "black" }}>
                          {data.name}
                        </ListItem.Title>
                        <ListItem.Subtitle>
                          截止时间: {data.endTime}
                        </ListItem.Subtitle>
                      </ListItem.Content>
                      <ListItem.Content right>
                        <ListItem.Title
                          right
                          style={{
                            color: data.state == "未提交" ? "red" : "green",
                          }}
                        >
                          {data.state}
                        </ListItem.Title>
                        {/* <ListItem.Subtitle right>12:00 am</ListItem.Subtitle> */}
                      </ListItem.Content>
                    </ListItem>
                    <View style={{ alignItems: "center" }}>
                      <View style={styles.divider} />
                    </View>
                  </>
                ))}
              </View>
            )}
          </View>
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
          <Text h1>Cart</Text>
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
          <Text h1>Cart</Text>
        </TabView.Item>
      </TabView>
    </>
  );
}

type CourseContentRouteProp = RouteProp<RootStackParamList, "CourseContent">;

type CourseContentNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CourseContent"
>;
type CourseContentProps = {
  route: CourseContentRouteProp;
  navigation: CourseContentNavigationProp;
};
export default function CourseContentScreen({
  route,
  navigation,
}: CourseContentProps) {
  const { cid } = route.params?.cid;
  return (
    <ScrollView>
      <View style={styles.container}>
        <InfoCard cid={route.params?.cid} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
  textTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textBody: {
    fontSize: 16,
  },
  textView: {
    flexDirection: "row",
  },
  chapter: {
    fontSize: 16,
  },
  chapterbody: {
    fontSize: 16,
    textAlign: "left",
  },
  chapterheadingNameIcon: {
    alignItems: "center",
    flexDirection: "row",
  },
  chapterheading: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  button: {
    width: 150,
    backgroundColor: "rgba(232, 147, 142, 1)",
    borderRadius: 10,
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  heading: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  hidden: {
    height: 0,
  },
  list: {
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 16,
    height: 30,
    marginLeft: "5%",
  },
  sectionDescription: {
    fontSize: 12,
    height: 30,
    marginLeft: "5%",
  },
  divider: {
    borderBottomColor: "grey",
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "100%",
  },
  newlist: {
    borderTopWidth: 1,
    borderColor: colors.greyOutline,
  },
});
