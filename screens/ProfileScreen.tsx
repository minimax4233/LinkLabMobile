/* eslint-disable require-jsdoc */
import { StyleSheet, View } from "react-native";

// import EditScreenInfo from '../components/EditScreenInfo';
// import { Text, View } from "../components/Themed";
import {
  Text,
  Card,
  Icon,
  Input,
  Button,
  InputProps,
} from "react-native-elements";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { getUserInfo } from "../api";
import {
  UserInfoContext,
  UserInfoDataType,
  UserInfoProvider,
  useUserInfoData,
} from "../contexts/UserInfoContext";
import { useAuth } from "../contexts/AuthContext";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import navigation from "../navigation";

/* export function InputComponent(
  isDisabled?: boolean = false,
  label?: string = "User Form",
  errorMessage?: string = "",
  iconType?: string = "material-community",
  leftIconName?: string = "account-outline",
  rightIconName?: string = "close",
  placeholder?: string = "Enter Name"
) {
  return (

  );
} */

/* export default function ProfileScreen({
  uid,
  uname,
  email,
}: {
  uid: string;
  uname: string;
  email: string;
}) { */

type InfoCardComponentsProps = {};

const InfoCard: React.FunctionComponent<InfoCardComponentsProps> = () => {
  const userInfoContext = useUserInfoData();
  const authContext = useAuth();
  const userInfoData = userInfoContext.userInfoData;

  // 表格
  const [username, setUsername] = useState<string>("");
  const [isUsernameValid, setUsernameValid] = useState<boolean>(true);
  const usernameInput = useRef<InputProps>(null);

  const [uid, setUid] = useState<string>("");
  const [isUidValid, setUidValid] = useState<boolean>(true);
  const uidInput = useRef<InputProps>(null);

  const [email, setEmail] = useState<string>("");
  const [isEmailValid, setEmailValid] = useState<boolean>(true);
  const emailInput = useRef<InputProps>(null);

  const [isModifyInfo, setModifyInfo] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  // 当进入页面时刷新数据
  useFocusEffect(() => {
    if (
      username == "your name" ||
      username == "" ||
      email == "youremail@email.com" ||
      email == ""
    ) {
      setModifyInfo(false);
    }
    if (
      isModifyInfo == false &&
      username != userInfoData.uname &&
      userInfoData.uname != "your name"
    ) {
      console.log("profile screen username", username, userInfoData);
      setUsername(userInfoData.uname);
      setUid(userInfoData.uid);
      setEmail(userInfoData.email);
      setModifyInfo(true);
    }
  });

  const updateInfo = async () => {
    setUsernameValid(username.length > 0 && username != userInfoData.uname);
    console.log(
      isUsernameValid,
      username.length > 0,
      username != userInfoData.uname
    );

    if (isUsernameValid && username != userInfoData.uname) {
      console.log(uid, username, email);
      if (isLoading == false) {
        setLoading(true);
        try {
          const res = await userInfoContext.updateUserInfo({
            uid: uid,
            name: username,
          })
          // .then(res => {
          //   // userInfoContext.loadUserInfoData();
          //   setLoading(false);
          //   console.log("error in profile 102", res);
          // }).catch( err => {
          //   console.log("error in profile 102", err);
          //   setLoading(false)
          // })
          console.log("profile 121:", res);
          if (res) {
            setLoading(false);
            console.log("success in profile 102", res);
          }
        } catch (e) {
          setLoading(false);
          console.log("profile 125 error", e);
        }
      } else {
        setLoading(false);
      }
    }
  };

  const signOut = async () => {
    console.log("profile screen signout");
    await authContext.signOut();
  };

  return (
    <>
      <Card>
        <Card.Image
          style={{ padding: 0, width: "100%", height: 100 }}
          resizeMode="contain"
          source={{
            uri: "https://linklab.domain.com/static/user_default.png",
          }}
        />
        <Input
          leftIcon={
            <Icon
              name="idcard"
              type="antdesign"
              color="rgba(0, 0, 0, 0.38)"
              size={25}
              style={{ backgroundColor: "transparent" }}
            />
          }
          disabled={true}
          value={uid}
          keyboardAppearance="light"
          autoFocus={false}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="default"
          returnKeyType="next"
          inputStyle={{ marginLeft: 10, color: "grey" }}
          placeholder={"UID"}
          containerStyle={{
            borderBottomColor: "rgba(0, 0, 0, 0.38)",
          }}
          ref={uidInput}
          onSubmitEditing={() => emailInput.current.focus()}
          onChangeText={(text) => setUid(text)}
          errorMessage={isUidValid ? "" : "UID 不能为空!"}
        />

        <Input
          leftIcon={
            <Icon
              name="user"
              type="simple-line-icon"
              color="rgba(0, 0, 0, 0.38)"
              size={25}
              style={{ backgroundColor: "transparent" }}
            />
          }
          value={username}
          keyboardAppearance="light"
          autoFocus={false}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="default"
          returnKeyType="next"
          inputStyle={{ marginLeft: 10, color: "grey" }}
          placeholder={"姓名"}
          containerStyle={{
            borderBottomColor: "rgba(0, 0, 0, 0.38)",
          }}
          ref={usernameInput}
          onSubmitEditing={() => emailInput.current.focus()}
          onChangeText={(text) => setUsername(text)}
          errorMessage={
            isUsernameValid && isModifyInfo
              ? ""
              : username == ""
              ? "姓名不能为空!"
              : "姓名没有改变!"
          }
        />
        <Input
          disabled={true}
          leftIcon={
            <Icon
              name="envelope-o"
              type="font-awesome"
              color="rgba(0, 0, 0, 0.38)"
              size={25}
              style={{ backgroundColor: "transparent" }}
            />
          }
          value={email}
          keyboardAppearance="light"
          autoFocus={false}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="next"
          inputStyle={{ marginLeft: 10, color: "grey" }}
          placeholder={"电邮地址"}
          containerStyle={{
            borderBottomColor: "rgba(0, 0, 0, 0.38)",
          }}
          ref={emailInput}
          onChangeText={(text) => setEmail(text)}
          errorMessage={isEmailValid ? "" : "请输入正确的电邮地址!"}
        />
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
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
            onPress={() => updateInfo()}
            title="修改资料"
            titleProps={{}}
            titleStyle={{ marginHorizontal: 5 }}
          />
          <Button
            buttonStyle={styles.button}
            containerStyle={{ margin: 5 }}
            disabledStyle={{
              borderWidth: 2,
              borderColor: "#00F",
            }}
            disabledTitleStyle={{ margin: 0, color: "#00F" }}
            loadingProps={{ animating: true }}
            loadingStyle={{}}
            onPress={() => signOut()}
            title="登出"
            titleProps={{}}
            titleStyle={{ marginHorizontal: 5 }}
          />
        </View>
      </Card>
    </>
  );
};

type ProfileScreenState = {};
type ProfileScreenProps = {};

const ProfileScreen: React.FunctionComponent<ProfileScreenState> = (
  props: ProfileScreenProps
) => {
  const { } = props;
  // const userInfoContext = useUserInfoData();

  /*   const loadUserInfo = async () => {
    let res;
    try {
      console.log("profile40 in get userinfo")
      res = await getUserInfo({});
      return res;
    } catch (e) {
      console.log(e);
    }
    return res;
  }; */

  //const [uid, setUid] = useState<string>("uid");
  //const [uname, setUname] = useState<string>("uname");
  //const [email, setEmail] = useState<string>("email@email.com");

  return (
    <ScrollView>
      <View style={styles.container}>
        <UserInfoProvider>
          <InfoCard />
        </UserInfoProvider>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fonts: {
    marginBottom: 8,
  },
  user: {
    flexDirection: "row",
    marginBottom: 6,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    marginTop: 5,
  },
  button: {
    width: 150,
    backgroundColor: "rgba(232, 147, 142, 1)",
    borderRadius: 10,
  },
});

export default ProfileScreen;
