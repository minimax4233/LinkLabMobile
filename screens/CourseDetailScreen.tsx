/* eslint-disable require-jsdoc */
// import { useFocusEffect } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
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
} from "react-native-elements";

// import EditScreenInfo from '../components/EditScreenInfo';
import { View } from "../components/Themed";
import { RootStackParamList } from "../types";
import { RouteProp, NavigatorScreenParams } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  checkUserJoinedCourseApi,
  getCourseDetailApi,
  joinCourseApi,
} from "../api";
import SendAlert from "../components/SendAlert";
// import { useAuth } from "../contexts/AuthContext";

export type CourseChapterDataType = {
  chapId: number;
  name: string;
  units?: Array<number>;
};

export type CourseDetailDataType = {
  imageUrl: string;
  sNumber: number;
  cid: number;
  cname: string;
  description: string;
  teacherName: string;
  teacherImageUrl: string;
  isPublic: boolean;
  school: string;
  startTime: string;
  // endTime: string;
  evaluation_1: number;
  evaluation_2: number;
  evaluation_3: number;
  evaluation_4: number;
  evaluation_5: number;
  avgEvaluation: number;
  chapters?: Array<CourseChapterDataType>;
};

interface InfoCardProps {
  cid?: number;
}
interface RenderListItemProps {
  data: CourseDetailDataType;
}

interface loadCourseDetailDataProps {
  cid: number;
}

// const InfoCard: React.FunctionComponent<InfoCardComponentsProps> = () => {
function InfoCard(props: InfoCardProps) {
  const [courseDetailData, setCourseDetailData] =
    useState<CourseDetailDataType>({
      imageUrl: "https://linklab.domain.com/static/img/courses_common.jpg",
      sNumber: 0,
      cid: -1,
      cname: "Default Course",
      description: "Default Description",
      teacherName: "Default Teacher",
      teacherImageUrl:
        "https://test.domain.com/static/userResources/teacher/3384fcaf4665462a9a5affa497b31ffc.jpg",
      isPublic: true,
      school: "Default School",
      startTime: "",
      // endTime: string;
      evaluation_1: 0,
      evaluation_2: 0,
      evaluation_3: 0,
      evaluation_4: 0,
      evaluation_5: 0,
      avgEvaluation: 0,
      chapters: [],
    });
  // const [showCID, setShowCID] = useState<number>(-3);
  // const isUpdate = props.cid == showCID;
  // const [showTimes, setShowTimes] = useState<number>(0);

  const [isJoinedCourse, setJoinedCourse] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const [coursePassword, setCoursePassword] = useState<string>("");
  const [isCoursePasswordValid, setCoursePasswordValid] =
    useState<boolean>(true);
  const coursePasswordInput = useRef<InputProps>(null);

  const checkJoinedCourse = async (props: loadCourseDetailDataProps) => {
    const getCheckJoinedCourseResult = await checkUserJoinedCourseApi<any>({
      cid: props.cid,
    });
    try {
      if (getCheckJoinedCourseResult) {
        console.log(
          "CDS-Check Joined Course 169:",
          getCheckJoinedCourseResult,
          "\n========================"
        );
        if (getCheckJoinedCourseResult.data == "未加入") {
          setJoinedCourse(false);
        } else if (getCheckJoinedCourseResult.data == "已加入") {
          setJoinedCourse(true);
        } else {
          setJoinedCourse(false);
        }

        return true;
      }
    } catch (err) {
      console.log("CDS-Check Joined 35 ERR", err);
      return false;
    }
  };

  const loadCourseDetailData = async (
    props: loadCourseDetailDataProps
  ): Promise<any> => {
    if (props.cid == courseDetailData.cid) {
      return false;
    }
    if (Number(props.cid) < 0) {
      return false;
    }
    console.log(
      "CDetial : props.cid:",
      props.cid,
      " dataCId:",
      courseDetailData.cid
    );
    const getCourseDetailResult = await getCourseDetailApi<any>({
      cid: props.cid,
    });
    // setCourseID(props.cid);
    try {
      if (getCourseDetailResult) {
        console.log(
          "CourseDetailContext 69 加载课程信息数据正常",
          getCourseDetailResult,
          "\n========================"
        );
        const data = getCourseDetailResult["data"];


        const _courseDetailData: CourseDetailDataType = {
          imageUrl: data["img"],
          sNumber: data["snum"],
          cid: props.cid,
          cname: data["cname"],
          description: data["description"],
          teacherName: data["teacher"],
          teacherImageUrl: data["teacher_icon"],
          isPublic: data["public"],
          school: data["school"],
          startTime: data["beginTime"],
          // endTime: string;
          evaluation_1: data["evaluation_1"],
          evaluation_2: data["evaluation_2"],
          evaluation_3: data["evaluation_3"],
          evaluation_4: data["evaluation_4"],
          evaluation_5: data["evaluation_5"],
          avgEvaluation: data["avg_evaluation"],
          chapters: data["chaps"],
        };
        console.log("CourseDetailContext 99:", _courseDetailData);
        // console.log(_CourseDetailData)
        setCourseDetailData(_courseDetailData);
        return courseDetailData;
      } else {
        console.log("CDC-104: load course detail no result!");
        return false;
      }
    } catch (err) {
      console.log("CourseDetailContext 35 ERR", err);
      return false;
    }
  };

  const joinCourse = async (cid: number, password: string) => {
    if (password.length <= 0 || cid <= 0 || isJoinedCourse == true) {
      setCoursePasswordValid(false);
      return false;
    }
    const JoinCourseResult = await joinCourseApi({
      course_id: cid,
      pass: password,
    });
    try {
      if (JoinCourseResult) {
        SendAlert("INFO", "Success", "加入课程成功!");
        setCoursePasswordValid(true);
        return true;
      } else {
        setCoursePasswordValid(false);
        return false;
      }
    } catch (err) {
      console.log("CourseDetailContext 35 ERR", err);
      setCoursePasswordValid(false);
      return false;
    }
  };

  useFocusEffect(() => {
    if (
      true &&
      (courseDetailData.cid < 0 || courseDetailData.cid != Number(props.cid))
    ) {
      loadCourseDetailData({ cid: Number(props.cid) });
      checkJoinedCourse({ cid: Number(props.cid) });
    }
  });

  //   if (Number(props.cid) >= 0 && !isUpdate) {
  //     loadCourseDetailData({ cid: Number(props.cid) });
  //   } else {
  //     if (showTimes <= 10) {
  //       // courseDetailContext.setCourseID(Number(props.cid));
  //       loadCourseDetailData({ cid: Number(props.cid) });
  //     }
  //   }
  // courseDetailContext.loadCourseDetailData({ cid: showCID });
  console.log("CDScreen-IC props.cid:", props.cid);
  // const courseDetailContextData = courseDetailData;

  // console.log("***CD-IC 单个课程 data:", isUpdate, showTimes, courseDetailData);
  //   useFocusEffect(async () => {
  //     if (showTimes < 10) {
  //       if (!isUpdate && courseDetailContextData.cid != showCID) {
  //         setShowTimes(showTimes + 1);
  //         await courseDetailContext.loadCourseDetailData({
  //           cid: Number(props.cid),
  //         });
  //         if (courseDetailContext) {
  //           console.log(
  //             "USE FOCUS EFFECT:",
  //             isUpdate,
  //             showCID,
  //             props.cid,
  //             courseDetailData
  //           );
  //           setShowCID(courseDetailContext.courseDetailData.cid);
  //           setCourseDetailData(courseDetailContext.courseDetailData);
  //         } else {
  //           console.log("CDS-111 获取课程详细信息失败!");
  //         }
  //       } else {
  //         console.log("**********************");
  //       }
  //     } else {
  //       console.log("run too much times");
  //     }
  //   });
  return (
    <>
      <RenderListItem data={courseDetailData} />

      {isJoinedCourse == true ? (
        <View style={styles.buttonView}>
          <Button
            loading={isLoading}
            disabled={isLoading}
            buttonStyle={styles.button}
            containerStyle={{ margin: 5 }}
            disabledStyle={{
              borderWidth: 2,
              borderColor: "#00F",
            }}
            disabledTitleStyle={{ margin: 0, color: "#00F" }}
            loadingProps={{ animating: true }}
            loadingStyle={{}}
            onPress={() => console.log("press")}
            title={"进入课程学习"}
            titleProps={{}}
            titleStyle={{ marginHorizontal: 5 }}
          />
        </View>
      ) : (
        <>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>课程密钥</ListItem.Title>
            </ListItem.Content>
            <ListItem.Input
              placeholder="输入密钥"
              // ref={coursePasswordInput}
              leftIcon={
                <Icon
                  name="lock"
                  type="simple-line-icon"
                  color="rgba(0, 0, 0, 0.38)"
                  size={25}
                  style={{ backgroundColor: "transparent" }}
                />
              }
              value={coursePassword}
              keyboardAppearance="light"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
              returnKeyType={"done"}
              blurOnSubmit={true}
              onChangeText={(text) => setCoursePassword(text)}
              errorMessage={
                isCoursePasswordValid ? "" : "请输入正确的课程密钥!"
              }
            />
            <ListItem.Chevron />
          </ListItem>
          {/* <Input
            ref={coursePasswordInput}
            leftIcon={
              <Icon
                name="lock"
                type="simple-line-icon"
                color="rgba(0, 0, 0, 0.38)"
                size={25}
                style={{ backgroundColor: "transparent" }}
              />
            }
            value={coursePassword}
            keyboardAppearance="light"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            returnKeyType={"done"}
            blurOnSubmit={true}
            containerStyle={{
              // marginTop: 16,
              borderBottomColor: "rgba(0, 0, 0, 0.38)",
            }}
            inputStyle={{ marginLeft: 10, color: "grey" }}
            placeholder={"课程密钥"}
            // onSubmitEditing={() => {
            //   confirmationInput.current.focus();
            // }}
            onChangeText={(text) => setCoursePassword(text)}
            errorMessage={isCoursePasswordValid ? "" : "请输入正确的课程密钥!"}
          /> */}
          <View style={styles.buttonView}>
            <Button
              loading={isLoading}
              disabled={isLoading}
              buttonStyle={styles.button}
              containerStyle={{ margin: 5 }}
              disabledStyle={{
                borderWidth: 2,
                borderColor: "#00F",
              }}
              disabledTitleStyle={{ margin: 0, color: "#00F" }}
              loadingProps={{ animating: true }}
              loadingStyle={{}}
              onPress={() => joinCourse(courseDetailData.cid, coursePassword)}
              title={"加入课程"}
              titleProps={{}}
              titleStyle={{ marginHorizontal: 5 }}
            />
          </View>
        </>
      )}
    </>
  );
  // console.log("CD-IC Course Detail: 91", courseDetailContextData);
}

/**
 * 生成课程信息列表
 * @param {Object} props 课程详细信息介绍数据
 * @return {React.ReactElement} 生成课程信息列表用于展示
 */
function RenderListItem(props: RenderListItemProps) {
  const courseDetailData = props.data;
  // console.log("CDScreen-render:", courseDetailData);
  // const courseDetailDataArray = Array.from(courseDetailData)
  return (
    <>
      <Image
        source={{ uri: courseDetailData.imageUrl }}
        style={{ height: 200, resizeMode: "center" }}
      />
      <Text h2 style={{ textAlign: "center" }}>
        {courseDetailData.cname}
      </Text>

      <Text style={{ textAlign: "center" }}>
        {courseDetailData.school} {courseDetailData.teacherName}
      </Text>

      <Divider
        style={{ width: "90%", margin: 10 }}
        color="#2089dc"
        insetType="right"
        subHeader=""
        subHeaderStyle={{}}
        width={1}
        orientation="horizontal"
      />
      <View style={styles.textView}>
        <Text style={styles.textTitle}>开课时间: </Text>
        <Text style={styles.textBody}>{courseDetailData.startTime}</Text>
      </View>
      <View style={styles.textView}>
        <Text style={styles.textTitle}>开课教师: </Text>
        <Text style={styles.textBody}>{courseDetailData.teacherName}</Text>
      </View>
      <View style={styles.textView}>
        <Text style={styles.textTitle}>课程人数: </Text>
        <Text style={styles.textBody}>{courseDetailData.sNumber}</Text>
      </View>
      <View style={styles.textView}>
        <Text style={styles.textTitle}>课程评分:</Text>
        <Rating
          imageSize={20}
          readonly
          startingValue={courseDetailData.avgEvaluation}
        />
      </View>
      <View style={styles.textView}>
        <Text style={styles.textTitle}>课程介绍: </Text>
      </View>
      <Text style={styles.textBody}>{courseDetailData.description}</Text>
      <Divider
        style={{ width: "90%", margin: 10 }}
        color="#2089dc"
        insetType="right"
        subHeader=""
        subHeaderStyle={{}}
        width={1}
        orientation="horizontal"
      />
      <Text style={styles.textTitle}>课程目录:</Text>
      {courseDetailData.chapters?.length == 0 ? (
        <Text style={styles.chapter}> 此课程暂时没有目录! </Text>
      ) : (
        courseDetailData.chapters?.map((data, index) => (
          <Text style={styles.chapter} key={index}>
            {data.name}
          </Text>
        ))
      )}
    </>
  );
}

type CourseDetailRouteProp = RouteProp<RootStackParamList, "CourseDetail">;

type CourseDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CourseDetail"
>;
type CourseDetailProps = {
  route: CourseDetailRouteProp;
  navigation: CourseDetailNavigationProp;
};
export default function CourseDetailScreen({
  route,
  navigation,
}: CourseDetailProps) {
  const { cid } = route.params?.cid;
  return (
    <ScrollView>
      <View style={styles.container}>
        {/* <CourseDetailProvider> */}
        <InfoCard cid={route.params?.cid} />
        {/* </CourseDetailProvider> */}
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
});
