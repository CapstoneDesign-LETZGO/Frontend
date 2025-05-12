import {DetailMemberDto, MemberDto, MemberForm} from "../../../../common/interfaces/MemberInterface";
import {AuthFetch, isSuccess} from "../../../../common/utils/fetchUtils";
import {ApiResponse} from "../../../../common/interfaces/response/ApiResponse.ts";

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

        // JSON 데이터를 Blob으로 변환하여 FormData에 첨부
        const memberFormBlob = new Blob([JSON.stringify(cleanForm)], { type: 'application/json' });
        formData.append('memberForm', memberFormBlob);
        if (imageFile) {
            formData.append('imageFile', imageFile);
        }
        const response = await authFetch<ApiResponse<string>>(
            '/rest-api/v1/member',
            formData,
            'PUT'
        );
        return isSuccess(response);
    } catch (err) {
        console.error('회원정보 수정 중 오류 발생:', err);
        return false;
    }
};
