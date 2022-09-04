/* eslint-disable require-jsdoc */
/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import sendAlert from "../components/SendAlert";
import { FontAwesome } from "@expo/vector-icons";
import { Icon } from "react-native-elements";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Pressable, Text, View } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import LoginScreen from "../screens/LoginScreen";
import ModalScreen from "../screens/ModalScreen";
import TeacherScreen from "../screens/TeacherScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import AllCourseScreen from "../screens/AllCourseScreen";
import MyCourseScreen from "../screens/MyCourseScreen";
import ProfileScreen from "../screens/ProfileScreen";
// import TabTwoScreen from "../screens/TabTwoScreen";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";

//
import { useAuth } from "../contexts/AuthContext";
import { getUserInfo } from "../api";
import { UserInfoProvider, useUserInfoData } from "../contexts/UserInfoContext";
import CourseDetailScreen from "../screens/CourseDetailScreen";
import CourseContentScreen from "../screens/CourseContentScreen";
// import { useCallback, useContext, useEffect, useState } from "react";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        initialParams={{ cid: -1 }}
        options={{ title: "课程介绍" }}
      />
      <Stack.Screen
        name="CourseContent"
        component={CourseContentScreen}
        initialParams={{ cid: -1 }}
        options={{ title: "课程內容" }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="Teacher"
          component={TeacherScreen}
          options={{ title: "教师" }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

/**
 *
 * @return {React.Component} ReactNative 组件
 */
function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const authContext = useAuth();
  // const navigation = useNavigation();
  console.log(
    `navigation index: is Login: ${authContext?.authData?.authenticated}`
  );
  // console.log(authContext);
  // const userInfo = useUserInfoData();
  const navigation = useNavigation();
  const [showingScreen, setShowingScreen] = React.useState("");
  const navigationState = navigation.getState().routes[0];
  const navigationIndex: number = Number(navigationState.state?.index);
  const currentScreen = !isNaN(navigationIndex)
    ? navigationState?.state?.routeNames[navigationIndex]
    : "-";
  if (currentScreen != showingScreen) {
    setShowingScreen(currentScreen);
  }

  console.log(
    "Navigation Index: 现在页面:",
    currentScreen,
    showingScreen,
    navigationIndex
  );
  if (authContext?.authData?.authenticated === false) {
    return (
      // <></>
      <>
        <BottomTab.Navigator
          initialRouteName="Login"
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme].tint,
            tabBarHideOnKeyboard: true,
            // tabBarStyle: { display: "none" },
          }}
        >
          <BottomTab.Screen
            name="Login"
            component={LoginScreen}
            options={({ navigation }: RootTabScreenProps<"Login">) => ({
              title: "登录注册",
              tabBarIcon: ({ color }) => (
                <TabBarIcon name="sign-in" color={color} />
              ),
              headerLeft: (props) => (
                <Pressable
                  onPress={() => {
                    navigation.canGoBack()
                      ? navigation.goBack()
                      : navigation.replace("Root", { screen: "Login" });
                  }}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.5 : 1,
                  })}
                >
                  <Icon
                    name={
                      navigation.canGoBack() ? "chevron-back-outline" : "home"
                    }
                    type={navigation.canGoBack() ? "ionicon" : "antdesign"}
                    size={25}
                    // color={Colors[colorScheme].text}
                    style={{ marginLeft: 15 }}
                  />
                </Pressable>
              ),
              headerRight: (props) => (
                <Pressable
                  onPress={() => navigation.navigate("Teacher")}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.5 : 1,
                  })}
                >
                  <View style={{ flexDirection: "row", marginRight: 15}}>
                    <FontAwesome
                      name="user-secret"
                      size={25}
                      color={Colors[colorScheme].text}
                      style={{ marginRight: 5 }}
                    />
                    <Text style={{fontSize:18}}>教师</Text>
                  </View>
                </Pressable>
              ),
            })}
          />
        </BottomTab.Navigator>
      </>
    );
  } else {
    return (
      <>
        <BottomTab.Navigator
          initialRouteName={"Profile"}
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme].tint,
            tabBarHideOnKeyboard: true,
          }}
        >
          <BottomTab.Screen
            name="AllCourse"
            component={AllCourseScreen}
            options={({ navigation }: RootTabScreenProps<"AllCourse">) => ({
              title: "所有课程",
              tabBarIcon: ({ color }) => (
                <TabBarIcon name="cloud" color={color} />
              ),
              headerLeft: () => (
                <Pressable
                  onPress={() => {
                    showingScreen != "AllCourse" && navigation.canGoBack()
                      ? navigation.goBack()
                      : navigation.replace("Root", { screen: "AllCourse" });
                  }}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.5 : 1,
                  })}
                >
                  <Icon
                    name={
                      showingScreen != "AllCourse" && navigation.canGoBack()
                        ? "chevron-back-outline"
                        : "home"
                    }
                    type={
                      showingScreen != "AllCourse" && navigation.canGoBack()
                        ? "ionicon"
                        : "antdesign"
                    }
                    size={25}
                    // color={Colors[colorScheme].text}
                    style={{ marginLeft: 15 }}
                  />
                </Pressable>
              ),

            })}
          />
          <BottomTab.Screen
            name="MyCourse"
            component={MyCourseScreen}
            options={({ navigation }: RootTabScreenProps<"MyCourse">) => ({
              title: "我的课程",
              tabBarIcon: ({ color }) => (
                <TabBarIcon name="book" color={color} />
              ),
              headerLeft: () => (
                <Pressable
                  onPress={() => {
                    showingScreen != "MyCourse" && navigation.canGoBack()
                      ? navigation.goBack()
                      : navigation.replace("Root", { screen: "MyCourse" });
                  }}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.5 : 1,
                  })}
                >
                  <Icon
                    name={
                      showingScreen != "MyCourse" && navigation.canGoBack()
                        ? "chevron-back-outline"
                        : "home"
                    }
                    type={
                      showingScreen != "MyCourse" && navigation.canGoBack()
                        ? "ionicon"
                        : "antdesign"
                    }
                    size={25}
                    // color={Colors[colorScheme].text}
                    style={{ marginLeft: 15 }}
                  />
                </Pressable>
              ),
            })}
          />

          <BottomTab.Screen
            name="Profile"
            component={ProfileScreen}
            options={({ navigation }: RootTabScreenProps<"Profile">) => ({
              title: "个人中心",
              tabBarIcon: ({ color }) => (
                <TabBarIcon name="user" color={color} />
              ),
              headerLeft: () => (
                <Pressable
                  onPress={() => {
                    // const navigationState = navigation.getState();
                    // const current =
                    //  navigationState.routeNames[navigationState.index];
                    // console.log("Navigation Index: 现在页面:", current);
                    showingScreen != "Profile" && navigation.canGoBack()
                      ? navigation.goBack()
                      : navigation.replace("Root", { screen: "Profile" });
                  }}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.5 : 1,
                  })}
                >
                  <Icon
                    name={
                      showingScreen != "Profile" && navigation.canGoBack()
                        ? "chevron-back-outline"
                        : "home"
                    }
                    type={
                      showingScreen != "Profile" && navigation.canGoBack()
                        ? "ionicon"
                        : "antdesign"
                    }
                    size={25}
                    // color={Colors[colorScheme].text}
                    style={{ marginLeft: 15 }}
                  />
                </Pressable>
              ),
            })}
          />
        </BottomTab.Navigator>
      </>
    );
  }
}


/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
