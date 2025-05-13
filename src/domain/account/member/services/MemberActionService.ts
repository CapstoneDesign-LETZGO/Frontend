import {DetailMemberDto, MemberDto, MemberForm} from "../../../../common/interfaces/MemberInterface";
import {AuthFetch, isSuccess} from "../../../../common/utils/fetchUtils";
import {ApiResponse} from "../../../../common/interfaces/response/ApiResponse.ts";

// 회원가입
export const signupApi = async (
    authFetch: AuthFetch,
    memberForm: MemberForm
): Promise<boolean> => {
    try {
        const response = await authFetch<ApiResponse<string>>(
            "/rest-api/v1/member",
            memberForm as unknown as Record<string, unknown>,
            "POST"
        );
        console.log("Signup Response:", response);
        return isSuccess(response);
    } catch (err) {
        console.error("회원가입 중 오류 발생:", err);
        return false;
    }
};

// 본인 정보 조회
export const fetchMemberApi = async (
    authFetch: AuthFetch
): Promise<{ member: MemberDto | null; success: boolean }> => {
    try {
        const response = await authFetch<MemberDto>("/rest-api/v1/member", {}, "GET");
        console.log('Response Data:', response);
        if (isSuccess(response)) {
            return { member: response.data ?? null, success: true };
        } else {
            console.error("사용자 정보 가져오기 실패:", response?.returnMessage);
            return { member: null, success: false };
        }
    } catch (err) {
        console.error("사용자 정보를 가져오는 중 오류:", err);
        return { member: null, success: false };
    }
};

// 본인 상세 정보 조회
export const fetchDetailMemberApi = async (
    authFetch: AuthFetch
): Promise<{ memberDetail: DetailMemberDto | null; success: boolean }> => {
    try {
        const response = await authFetch<DetailMemberDto>("/rest-api/v1/member/detail", {}, "GET");
        console.log('Response Detail Data:', response);
        if (isSuccess(response)) {
            return { memberDetail: response.data ?? null, success: true };
        } else {
            console.error("사용자 상세 정보 가져오기 실패:", response?.returnMessage);
            return { memberDetail: null, success: false };
        }
    } catch (err) {
        console.error("사용자 상세 정보를 가져오는 중 오류:", err);
        return { memberDetail: null, success: false };
    }
};

// 다른 멤버의 회원정보 조회
export const fetchOtherMemberApi = async (
    authFetch: AuthFetch,
    memberId: number
): Promise<{ member: MemberDto | null; success: boolean }> => {
    try {
        const response = await authFetch<MemberDto>(
            `/rest-api/v1/member/${memberId}`, {}, "GET"
        );
        console.log("Other Member Response:", response);
        if (isSuccess(response)) {
            return { member: response.data ?? null, success: true };
        } else {
            console.error("다른 회원 정보 조회 실패:", response?.returnMessage);
            return { member: null, success: false };
        }
    } catch (err) {
        console.error("다른 회원 정보를 가져오는 중 오류:", err);
        return { member: null, success: false };
    }
};

// 다른 멤버의 상세회원정보 조회
export const fetchOtherDetailMemberApi = async (
    authFetch: AuthFetch,
    memberId: number
): Promise<{ memberDetail: DetailMemberDto | null; success: boolean }> => {
    try {
        const response = await authFetch<DetailMemberDto>(
            `/rest-api/v1/member/detail/${memberId}`, {}, "GET"
        );
        console.log("Other Member Detail Response:", response);
        if (isSuccess(response)) {
            return { memberDetail: response.data ?? null, success: true };
        } else {
            console.error("다른 회원 상세 정보 조회 실패:", response?.returnMessage);
            return { memberDetail: null, success: false };
        }
    } catch (err) {
        console.error("다른 회원 상세 정보를 가져오는 중 오류:", err);
        return { memberDetail: null, success: false };
    }
};

// 회원정보 수정
export const updateMemberApi = async (
    authFetch: AuthFetch,
    form: Partial<MemberForm>,
    imageFile: File | null
): Promise<boolean> => {
    try {
        const formData = new FormData();
        const cleanForm = {
            ...form,
            birthday: form.birthday === "" ? null : form.birthday,
        };
        formData.append('memberForm', new Blob([JSON.stringify(cleanForm)], { type: 'application/json' }));
        if (imageFile) {
            formData.append('imageFile', imageFile);
        }
        const response = await authFetch<ApiResponse<string>>(
            '/rest-api/v1/member',
            formData,
            'PUT'
        );
        console.log('Update Member Response:', response);
        return isSuccess(response);
    } catch (err) {
        console.error('회원정보 수정 중 오류 발생:', err);
        return false;
    }
};

// 회원 탈퇴
export const deleteMemberApi = async (
    authFetch: AuthFetch
): Promise<boolean> => {
    try {
        const response = await authFetch<ApiResponse<string>>(
            "/rest-api/v1/member", {}, "DELETE"
        );
        console.log("Delete Member Response:", response);
        return isSuccess(response);
    } catch (err) {
        console.error("회원 탈퇴 중 오류 발생:", err);
        return false;
    }
};

// 회원 검색하기
export const searchMemberApi = async (
    authFetch: AuthFetch,
    keyword: string
): Promise<{ members: MemberDto[] | null; success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<MemberDto>>(
            `/rest-api/v1/member/search?keyword=${encodeURIComponent(keyword)}`,
            {},
            "GET"
        );
        console.log("Search Member Response:", response);
        if (isSuccess(response)) {
            return { members: response.data as unknown as MemberDto[] ?? null, success: true };
        } else {
            console.error("회원 검색 실패:", response?.returnMessage);
            return { members: null, success: false };
        }
    } catch (err) {
        console.error("회원 검색 중 오류 발생:", err);
        return { members: null, success: false };
    }
};
