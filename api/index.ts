import { authRequest, request } from './request'

// 登录
export const loginApi = <T>(params: any) => authRequest<T>(params);

export const getUserInfo = <T>(params: any) => request.get<T>('/user/info');
export const updateUserInfoApi = <T>(params: any) => request.put<T>('/user/name', params, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

export const getAllCourseInfoApi = <T>(params: any) => request.get<T>('/course/public?siteId=1');
export const getCourseDetailApi = <T>(params: any) => request.get<T>('/course/detail', params);
export const checkUserJoinedCourseApi = <T>(params: any) => request.get<T>('/course/joined', params);
export const joinCourseApi = <T>(params: any) => request.post<T>('/course/bind', params, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

export const getMyCourseInfoApi = <T>(params: any) => request.get<T>('/course/student/all');
export const getAllChapterOfCourseApi = <T>(params: any) => request.get<T>('/chap/all', params);
export const getAllAssignmentOfCourseApi = <T>(params: any) => request.get<T>('/assignments/course', params);
export const getAllFaqOfCourseApi = <T>(params: any) => request.get<T>('/answer/course', params);
export const getAllNoticeOfCourseApi = <T>(params: any) => request.get<T>('/notice/all', params, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});
// export const LoginApi = <T>(params: any) => request.post<T>('/user/login', params, {timeout: 15000});

// teacher 
export const createCourseApi = <T>(params: any) => request.post<T>('/course/add', params);
export const getCreateCourseApi = <T>(params: any) => request.post<T>('/course/all', params);
export const deleteCourseApi = <T>(params: any) => request.delete<T>('/course/del', params);
export const getCourseStudentListApi = <T>(params: any) => request.get<T>('/course/export/student', params);

// 作业
export const setStudentScoreApi = <T>(params: any) => request.post<T>('/assignments/score', params);
export const getAllStudentAssignmentApi = <T>(params: any) => request.get<T>('/assignments/export/resourse', params);
export const getCourseAllStudentAssignmentApi = <T>(params: any) => request.post<T>('/assignments/score', params);
