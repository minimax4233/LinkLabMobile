/* eslint-disable require-jsdoc */
// import { useFocusEffect } from "@react-navigation/native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Avatar, ListItem } from "react-native-elements";

// import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from "../components/Themed";
import {
  AllCourseInfoDataType,
  AllCourseInfoProvider,
  useAllCourseInfoData,
} from "../contexts/AllCourseContext";


interface Props {}
interface RenderListItesmProps {
  datas: Array<AllCourseInfoDataType>;
}

function RenderListItem(props: RenderListItesmProps) {
  // const courseDetailContext = useCourseDetailData();
  const allCourseDatas = props.datas;
  console.log("ACS-render:", allCourseDatas);
  const allCourseDatasArray = Array.from(allCourseDatas);
  const navigation = useNavigation();
  return (
    <>
      {allCourseDatasArray.map((data, index) => (
        <ListItem
          // Component={TouchableScale}
          // Component={TouchableHighlight}
          // containerStyle={{}}
          // disabledStyle={{ opacity: 0.5 }}
          // onLongPress={() => console.log("onLongPress()")}
          onPress={() => {
            console.log(data.cid);
            // courseDetailContext.loadCourseDetailData({cid: data.cid});
            navigation.navigate("CourseDetail", {
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
  const allCourseContext = useAllCourseInfoData();
  // const authContext = useAuth();
  const allCourseDatasContext = allCourseContext.allCourseInfoDatas;
  console.log("ASC-IC 全部课程 context data:", allCourseDatasContext);
  const [allCourseDatas, setAllCourseDatas] = useState<
    Array<AllCourseInfoDataType>
  >(allCourseDatasContext);

  useFocusEffect(() => {
    if ((allCourseDatas[0].cname = "Default Course")) {
      // const allCourseDatasArray = Array.from(allCourseContext.allCourseInfoDatas)
      setAllCourseDatas(allCourseContext.allCourseInfoDatas);
    }
  });

  return (
    <>
      <RenderListItem datas={allCourseDatas} />
    </>
  );
}

export default function AllCourseScreen() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <AllCourseInfoProvider>
          {/* <CourseDetailProvider> */}
            <InfoCard />
          {/* </CourseDetailProvider> */}
        </AllCourseInfoProvider>
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
