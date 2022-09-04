/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Login: undefined;
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  Teacher: undefined
  NotFound: undefined;
  CourseDetail: {cid: number} | undefined;
  CourseContent: {cid: number} | undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  AllCourse: undefined;
  MyCourse: undefined;
  Profile: undefined;
  Login: undefined;
  // CourseDetail: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;


export type AuthData = {
  accessToken: string;
  refreshToken: string;
  authenticated: boolean;
  expires: number;
  tokenType: string;
  expires_in: number;
  uid: string;
  siteId: number;
};

export type AuthContextData = {
  authData?: AuthData;
  loading: boolean;
  login(username: string, password: string): Promise<boolean>;
  signOut(): void;
  getAccessToken(): string;
  getExpries(): string;
};
