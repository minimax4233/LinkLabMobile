/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          AllCourse: {
            screens: {
              AllCourseScreen: 'allCourse',
            },
          },
          Login: {
            screens:{
              LoginScreen: 'login',
            },
          },
          MyCourse: {
            screens: {
              MyCourseScreen: 'myCourse',
            },
          },
          Profile: {
            screens: {
              ProfileScreen: 'profile',
            },
          },
        },
      },
      Modal: 'modal',
      NotFound: '*',
      CourseDetail: 'courseDetail',
    },
  },
};

export default linking;
