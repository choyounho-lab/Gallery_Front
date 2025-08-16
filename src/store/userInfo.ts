import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

// 1. 타입 정의
export interface UserInfo {
    username: string;
    email: string;
    name: string;
    birthdate: string;
    roleNo: string;
    id: number;
    active: boolean;
    roles: string[];
    paid?: boolean;
    sub: boolean;
}

interface UserInfoState {
    info: UserInfo;
}

// 2. 초기 상태
const initialState: UserInfoState = {
    info: {
        active: false,
        email: '',
        roles: [],
        username: '',
        id: 0,
        name: '',
        birthdate: '',
        roleNo: '',
        paid: false,
        sub: false,
    },
};

// 3. createSlice
export const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.info = action.payload;
        },
        removeUserInfo: (state) => {
            state.info = {
                active: false,
                email: '',
                roles: [],
                username: '',
                id: 0,
                name: '',
                birthdate: '',
                roleNo: '',
                paid: false,
                sub: false,
            };
        },
        updateUserInfo: (state, action: PayloadAction<Partial<UserInfo>>) => {
            state.info = {
                ...state.info,
                ...action.payload,
            };
        },
    },
});

// 4. 액션과 리듀서 내보내기
export const { setUserInfo, removeUserInfo, updateUserInfo } =
    userInfoSlice.actions;
export default userInfoSlice.reducer;

// 5. 셀렉터
export const selectUserInfo = (state: RootState) => state.userInfo.info;
