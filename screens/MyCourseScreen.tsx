/* eslint-disable require-jsdoc */
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Avatar, ListItem } from "react-native-elements";

import { Text, View } from "../components/Themed";
import {
  MyCourseInfoDataType,
  MyCourseInfoProvider,
  useMyCourseInfoData,
} from "../contexts/MyCourseContext";


interface Props {}
interface RenderListItesmProps {
  datas: Array<MyCourseInfoDataType>;
}

function RenderListItem(props: RenderListItesmProps) {
  // const courseDetailContext = useCourseDetailData();
  const myCourseDatas = props.datas;
  console.log("ACS-render:", myCourseDatas);
  const myCourseDatasArray = Array.from(myCourseDatas);
  const navigation = useNavigation();
  return (
    <>
      {myCourseDatasArray.map((data, index) => (
        <ListItem
          // Component={TouchableScale}
          // Component={TouchableHighlight}
          // containerStyle={{}}
          // disabledStyle={{ opacity: 0.5 }}
          // onLongPress={() => console.log("onLongPress()")}
          onPress={() => {
            console.log(data.cid);
            // courseDetailContext.loadCourseDetailData({cid: data.cid});
            navigation.navigate("CourseContent", {
              cid: data.cid,
            });
          }}
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

// const InfoCard: React.FunctionComponent<InfoCardComponentsProps> = () => {
function InfoCard(props: Props) {
  const myCourseContext = useMyCourseInfoData();
  // const authContext = useAuth();
  const myCourseDatasContext = myCourseContext.myCourseInfoDatas;
  console.log("ASC-IC 全部课程 context data:", myCourseDatasContext);
  const [myCourseDatas, setMyCourseDatas] = useState<
    Array<MyCourseInfoDataType>
  >(myCourseDatasContext);

  useFocusEffect(() => {
    if ((myCourseDatas[0].cname = "Default Course")) {
      // const myCourseDatasArray = Array.from(myCourseContext.myCourseInfoDatas)
      setMyCourseDatas(myCourseContext.myCourseInfoDatas);
    }
  });

  return (
    <>
      <RenderListItem datas={myCourseDatas} />
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
