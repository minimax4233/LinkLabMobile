/* eslint-disable require-jsdoc */
import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableHighlight } from "react-native";
import { Avatar, Card, Icon, Input, ListItem } from "react-native-elements";

// import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from "../components/Themed";
import {
  MyCourseInfoDataType,
  MyCourseInfoProvider,
  useMyCourseInfoData,
} from "../contexts/MyCourseContext";
import { useAuth } from "../contexts/AuthContext";

interface Props {}

// const InfoCard: React.FunctionComponent<InfoCardComponentsProps> = () => {
function InfoCard(props: Props) {
  const myCourseContext = useMyCourseInfoData();
  // const authContext = useAuth();
  const myCourseDatasContext = myCourseContext.MyCourseInfoDatas;
  console.log("全部课程 data:", myCourseDatasContext);
  const [myCourseDatas, setMyCourseDatas] = useState<
    Array<MyCourseInfoDataType>
  >(myCourseDatasContext);
  // 表格
  // const [username, setUsername] = useState<string>("");
  // const [isUsernameValid, setUsernameValid] = useState<boolean>(true);
  // // const usernameInput = useRef<InputProps>(null);

  // const [uid, setUid] = useState<string>("");
  // const [isUidValid, setUidValid] = useState<boolean>(true);

  // const [email, setEmail] = useState<string>("");
  // const [isEmailValid, setEmailValid] = useState<boolean>(true);

  // const [isModifyInfo, setModifyInfo] = useState<boolean>(false);
  // const [isLoading, setLoading] = useState<boolean>(false);
  // 当进入页面时刷新数据
  // useFocusEffect(() => {
  //   if (
  //     username == "your name" ||
  //     username == "" ||
  //     email == "youremail@email.com" ||
  //     email == ""
  //   ) {
  //     setModifyInfo(false);
  //   }
  //   if (
  //     isModifyInfo == false &&
  //     username != userInfoData.uname &&
  //     userInfoData.uname != "your name"
  //   ) {
  //     console.log("profile screen username", username, userInfoData);
  //     setUsername(userInfoData.uname);
  //     setUid(userInfoData.uid);
  //     setEmail(userInfoData.email);
  //     setModifyInfo(true);
  //   }
  // });

  // useEffect(() => {
  //   setMyCourseDatas(myCourseDatasContext);
  // });
  console.log(myCourseDatas[0]["imageUrl"]);
  return (
    <>
      {myCourseDatas.map((data, index) => (
        <ListItem
          // Component={TouchableScale}
          // Component={TouchableHighlight}
          // containerStyle={{}}
          // disabledStyle={{ opacity: 0.5 }}
          // onLongPress={() => console.log("onLongPress()")}
          onPress={() => console.log("onLongPress()")}
          // pad={20}
          key={index}
        >
          <Avatar
            size="large"
            source={{
              uri: data.imageUrl,
            }}
          />
          <ListItem.Content>
            <ListItem.Title>
              <Text>{data.cname}</Text>
            </ListItem.Title>
            <ListItem.Subtitle>
              <Text>
                {data.school} {data.teacherName}
              </Text>
            </ListItem.Subtitle>
            <Text>开课时间: {data.startTime}</Text>
          </ListItem.Content>
        </ListItem>
      ))}
    </>
  );
}

export default function MyCourseScreen() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <MyCourseInfoProvider>
          <InfoCard />
        </MyCourseInfoProvider>
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
