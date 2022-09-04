import React, { Component, useState, useRef } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Text,
  Dimensions,
  LayoutAnimation,
  UIManager,
  ScrollView,
} from "react-native";
import { Input, Button, Icon, InputProps } from "@rneui/themed";
// import { Header } from "../components/header";
import { useAuth } from "../contexts/AuthContext";
// import * as WebBrowser from "expo-web-browser";
import { WebView } from "react-native-webview";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
// const BG_IMAGE = require("../assets/images/bg_screen4.jpg");

// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental
  ? UIManager.setLayoutAnimationEnabledExperimental(true)
  : {};

type TabSelectorProps = {
  selected: boolean;
};

const TabSelector: React.FunctionComponent<TabSelectorProps> = ({
  selected,
}) => {
  return (
    <View style={styles.selectorContainer}>
      <View style={selected && styles.selected} />
    </View>
  );
};

type LoginScreenState = {};
type LoginScreenProps = {};

const LoginScreen: React.FunctionComponent<LoginScreenState> = (
  props: LoginScreenProps
) => {
  const {} = props;
  const [isLoading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [isUsernameValid, setUsernameValid] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [isEmailValid, setEmailValid] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [isPasswordValid, setPasswordValid] = useState<boolean>(true);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isConfirmPasswordValid, setConfirmPasswordValid] =
    useState<boolean>(true);

  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const usernameInput = useRef<InputProps>(null);
  const emailInput = useRef<InputProps>(null);
  const passwordInput = useRef<InputProps>(null);
  const confirmationInput = useRef<InputProps>(null);

  const isLoginPage = selectedCategory === 0;
  const isSignUpPage = selectedCategory === 1;

  const authContext = useAuth();

  const [showWebView, setWebView] = useState<string>("login");

  const selectCategory = (selectedCategoryIndex: number) => {
    LayoutAnimation.easeInEaseOut();
    setLoading(false);
    setSelectedCategory(selectedCategoryIndex);
  };

  const validateEmail = (testEmail: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(testEmail);
  };

  const login = async () => {
    setPasswordValid(password.length >= 6 || passwordInput.current.shake());
    // let passwordFlag = assword.length >= 6;
    setUsernameValid(username.length > 0 || usernameInput.current.shake());
    // const isPasswordValidFlag =passwordFlag || passwordInput.current.shake();
    LayoutAnimation.easeInEaseOut();
    if (isPasswordValid && isUsernameValid) {
      setLoading(true);
      await authContext
        .login(username, password)
        .then((res) => {
          if (res === true) {
            console.log("LoginScreen: Login Success");
            setPasswordValid(true);
          } else {
            setPasswordValid(false);
            console.log("LoginScreen: Login Fail");
            // usernameInput.current.shake();
            // passwordInput.current.shake();
            
          }
        })
        .catch((res) => {
          setPasswordValid(false);
          // usernameInput.current.shake();
          // passwordInput.current.shake();
          console.log("LoginScreen: Login Error", res);
        });
      console.log("Login Screen loading:", authContext.loading);
      setLoading(authContext.loading);
    }
    // console.log(isPasswordValid);
  };

  const resetPassword = () => {
    setWebView("reset");
    return;
  };

  const signUp = () => {
    setWebView("signUp");
    setLoading(true);
    // Simulate an API call
    setTimeout(() => {
      const isEmailValidFlag =
        validateEmail(email) || emailInput.current.shake();
      const isUsernameValidFlag =
        username.length >= 5 || usernameInput.current.shake();
      const isPasswordValidFlag =
        password.length >= 6 || passwordInput.current.shake();
      const isConfirmPasswordValidFlag =
        password === confirmPassword || confirmationInput.current.shake();

      LayoutAnimation.easeInEaseOut();
      setLoading(false);
      setEmailValid(validateEmail(email) || emailInput.current.shake());
      setPasswordValid(password.length >= 6 || passwordInput.current.shake());
      setConfirmPasswordValid(
        password === confirmPassword || confirmationInput.current.shake()
      );
      setUsernameValid(username.length >= 5 || usernameInput.current.shake());
      if (
        isEmailValidFlag &&
        isPasswordValidFlag &&
        isConfirmPasswordValidFlag &&
        isUsernameValidFlag
      ) {
        Alert.alert("🙏", "Welcome");
      }
    }, 1500);
  };

  return (
    <>
      {showWebView == "login" ? (
        <ScrollView>
          <View style={styles.container}>
            <>
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>LinkLab Mobile</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Button
                  disabled={isLoading}
                  type="clear"
                  activeOpacity={0.7}
                  onPress={() => selectCategory(0)}
                  containerStyle={{ flex: 1 }}
                  titleStyle={[
                    styles.categoryText,
                    isLoginPage && styles.selectedCategoryText,
                  ]}
                  title="登录"
                />
                <Button
                  disabled={isLoading}
                  type="clear"
                  activeOpacity={0.7}
                  // onPress={() => selectCategory(1)}
                  onPress={ () => setWebView("signUp")}
                  containerStyle={{ flex: 1 }}
                  titleStyle={[
                    styles.categoryText,
                    isSignUpPage && styles.selectedCategoryText,
                  ]}
                  title="注册"
                />
              </View>
              <View style={styles.rowSelector}>
                <TabSelector selected={isLoginPage} />
                <TabSelector selected={isSignUpPage} />
              </View>
              <View style={styles.formContainer}>
                {isLoginPage ? (
                  // 登录页
                  <>
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
                      placeholder={"用户名"}
                      containerStyle={{
                        borderBottomColor: "rgba(0, 0, 0, 0.38)",
                      }}
                      ref={usernameInput}
                      onSubmitEditing={() => passwordInput.current.focus()}
                      onChangeText={(text) => setUsername(text)}
                      errorMessage={isUsernameValid ? "" : "用户名不能为空!"}
                    />
                    <Input
                      leftIcon={
                        <Icon
                          name="lock"
                          type="simple-line-icon"
                          color="rgba(0, 0, 0, 0.38)"
                          size={25}
                          style={{ backgroundColor: "transparent" }}
                        />
                      }
                      value={password}
                      keyboardAppearance="light"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry={true}
                      returnKeyType={isSignUpPage ? "next" : "done"}
                      blurOnSubmit={true}
                      containerStyle={{
                        // marginTop: 16,
                        borderBottomColor: "rgba(0, 0, 0, 0.38)",
                      }}
                      inputStyle={{ marginLeft: 10, color: "grey" }}
                      placeholder={"密码"}
                      ref={passwordInput}
                      onSubmitEditing={() => {
                        login();
                      }}
                      onChangeText={(text) => setPassword(text)}
                      errorMessage={
                        isPasswordValid
                          ? ""
                          : password.length > 0
                          ? "用户名称或密码错误!"
                          : "请输入密码!"
                      }
                    />
                  </>
                ) : (
                  // 注冊页
                  <>
                    <Input
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
                      onSubmitEditing={() => usernameInput.current.focus()}
                      onChangeText={(text) => setEmail(text)}
                      errorMessage={isEmailValid ? "" : "请输入正确的电邮地址!"}
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
                      placeholder={"用户名"}
                      containerStyle={{
                        borderBottomColor: "rgba(0, 0, 0, 0.38)",
                      }}
                      ref={usernameInput}
                      onSubmitEditing={() => passwordInput.current.focus()}
                      onChangeText={(text) => setUsername(text)}
                      errorMessage={isUsernameValid ? "" : "用户名不能为空!"}
                    />
                    <Input
                      leftIcon={
                        <Icon
                          name="lock"
                          type="simple-line-icon"
                          color="rgba(0, 0, 0, 0.38)"
                          size={25}
                          style={{ backgroundColor: "transparent" }}
                        />
                      }
                      value={password}
                      keyboardAppearance="light"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry={true}
                      returnKeyType={isSignUpPage ? "next" : "done"}
                      blurOnSubmit={true}
                      containerStyle={{
                        // marginTop: 16,
                        borderBottomColor: "rgba(0, 0, 0, 0.38)",
                      }}
                      inputStyle={{ marginLeft: 10, color: "grey" }}
                      placeholder={"密码"}
                      ref={passwordInput}
                      onSubmitEditing={() => {
                        confirmationInput.current.focus();
                      }}
                      onChangeText={(text) => setPassword(text)}
                      errorMessage={
                        isPasswordValid
                          ? ""
                          : "请输入 6 至 18 位英文或数字的密码!"
                      }
                    />
                    <Input
                      leftIcon={
                        <Icon
                          name="lock"
                          type="simple-line-icon"
                          color="rgba(0, 0, 0, 0.38)"
                          size={25}
                          style={{ backgroundColor: "transparent" }}
                        />
                      }
                      value={confirmPassword}
                      secureTextEntry={true}
                      keyboardAppearance="light"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="default"
                      returnKeyType={"done"}
                      blurOnSubmit={true}
                      containerStyle={{
                        // marginTop: 16,
                        borderBottomColor: "rgba(0, 0, 0, 0.38)",
                      }}
                      inputStyle={{ marginLeft: 10, color: "grey" }}
                      placeholder={"确认密码"}
                      ref={confirmationInput}
                      // onSubmitEditing={signUp}
                      onChangeText={(text) => setConfirmPassword(text)}
                      errorMessage={
                        isConfirmPasswordValid ? "" : "两次输入的密码不一致!"
                      }
                    />
                  </>
                )}

                <Button
                  buttonStyle={styles.loginButton}
                  containerStyle={{ marginTop: isLoginPage ? 32 : 0, flex: 0 }}
                  activeOpacity={0.8}
                  title={isLoginPage ? "登录" : "注册"}
                  onPress={isLoginPage ? login : signUp}
                  titleStyle={styles.loginTextButton}
                  loading={isLoading}
                  disabled={isLoading}
                />
              </View>
              {isLoginPage ? (
                <View style={styles.helpContainer}>
                  <Button
                    title={"忘记密码?"}
                    titleStyle={{ color: "black" }}
                    buttonStyle={{ backgroundColor: "transparent" }}
                    onPress={resetPassword}
                  />
                  {/* <Button
                    title={"教师用户"}
                    titleStyle={{ color: "black" }}
                    buttonStyle={{ backgroundColor: "transparent" }}
                    onPress={() => setWebView("teacher")}
                  /> */}
                </View>
              ) : (
                {}
              )}
            </>
          </View>
        </ScrollView>
      ) : (showWebView == "signUp" ? (
        <WebView
          source={{
            uri: "https://linklab.domain.com/loginPage/?client=Linklab#/register",
          }}
          allowsBackForwardNavigationGestures
          scrollEnabled
          // injectedJavaScript={` const meta = document.createElement('meta'); meta.setAttribute('content', 'initial-scale=0,minimum-scale=0, maximum-scale=5.0,user-scalable=yes'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
        />
      ) : ((showWebView == "reset" || showWebView == "teacher") ? (
        <WebView
        automaticallyAdjustContentInsets={true}
          source={{
            uri: showWebView == "reset" ? "https://linklab.domain.com/loginPage/?client=Linklab#/forgetpassword" : "https://linklab.domain.com/loginPage/?client=Linklab#/",
          }}
          userAgent="LinkLab Mobile"
          allowsBackForwardNavigationGestures
          scrollEnabled

        />
      ) : (
        <View></View>
        // console.log("ERROR in Login Screen!")
      )))}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
    width: "100%",
    height: SCREEN_HEIGHT * 0.8,
    alignItems: "center",
    justifyContent: "space-around",
  },
  rowSelector: {
    height: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  selectorContainer: {
    flex: 1,
    alignItems: "center",
  },
  selected: {
    position: "absolute",
    borderRadius: 50,
    height: 0,
    width: 0,
    top: -5,
    borderRightWidth: 70,
    borderBottomWidth: 70,
    borderColor: "white",
    backgroundColor: "white",
  },
  loginTextButton: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "rgba(232, 147, 142, 1)",
    borderRadius: 10,
    height: 50,
    width: 200,
  },
  titleContainer: {
    height: 60,
    backgroundColor: "transparent",
    justifyContent: "center",
  },
  formContainer: {
    backgroundColor: "white",
    width: SCREEN_WIDTH - 30,
    borderRadius: 10,
    paddingTop: 32,
    paddingBottom: 32,
    alignItems: "center",
  },
  loginText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  bgImage: {
    flex: 1,
    top: 0,
    left: 0,
    width: "100%",
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: {
    textAlign: "center",
    color: "black",
    fontSize: 24,
    // fontFamily: "light",
    backgroundColor: "transparent",
    opacity: 0.54,
  },
  selectedCategoryText: {
    opacity: 1,
  },
  titleText: {
    color: "black",
    fontSize: 30,
    // fontFamily: "regular",
    textAlign: "center",
  },
  helpContainer: {
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LoginScreen;
