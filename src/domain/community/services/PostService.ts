import { ApiResponse } from "../../../common/interfaces/response/ApiResponse.ts";
import {DetailPostDto, PostForm} from "../../../common/interfaces/CommunityInterface.ts";
import { AuthFetch, isSuccess } from "../../../common/utils/fetch.ts";

// 본인/팔로우한 유저 게시글 조회
export const fetchPostApi = async (
    authFetch: AuthFetch
): Promise<{ posts: DetailPostDto[]; success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<DetailPostDto>>(
            '/rest-api/v1/post/main', {}, 'GET'
        );
        console.log('Response Data:', response);
        if (isSuccess(response)) {
            const posts = response?.letzgoPage?.contents as unknown as DetailPostDto[] ?? [];
            return { posts, success: true };
        } else {
            console.error("게시글 목록 조회 실패:", response?.returnMessage);
            return { posts: [], success: false };
        }
    } catch (err) {
        console.error("게시글 목록 조회 중 오류:", err);
        return { posts: [], success: false };
    }
};

// 해당 사용자가 작성한 게시글 조회
export const fetchMemberPostApi = async (
    authFetch: AuthFetch,
    memberId: number
): Promise<{ posts: DetailPostDto[]; success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<DetailPostDto>>(
            `/rest-api/v1/post/member/${memberId}`, {}, 'GET'
        );
        console.log('Response Data (My Posts):', response);
        if (isSuccess(response)) {
            const posts = response?.letzgoPage?.contents as unknown as DetailPostDto[] ?? [];
            return { posts, success: true };
        } else {
            console.error("내 게시글 목록 조회 실패:", response?.returnMessage);
            return { posts: [], success: false };
        }
    } catch (err) {
        console.error("내 게시글 목록 조회 중 오류:", err);
        return { posts: [], success: false };
    }
};

// 게시글 생성
export const addPostApi = async (
    authFetch: AuthFetch,
    form: PostForm,
    imageFiles: File[]
): Promise<boolean> => {
    try {
        const formData = new FormData();
        formData.append('postForm', new Blob([JSON.stringify(form)], { type: 'application/json' }));
        imageFiles.forEach((file) => {
            formData.append('imageFiles', file);
        });
        const response = await authFetch<ApiResponse<string>>(
            '/rest-api/v1/post',
            formData,
            'POST'
        );
        return isSuccess(response);
    } catch (err) {
        console.error('게시글 등록 중 오류 발생:', err);
        return false;
    }
};

// 게시글 좋아요
export const likePostApi = async (
    authFetch: AuthFetch,
    postId: number
): Promise<{ success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<null>>(
            `/rest-api/v1/post/like/${postId}`,
            {}, 'POST'
        );
        console.log('Like Response:', response);
        return { success: isSuccess(response) };
    } catch (err) {
        console.error("좋아요 처리 중 오류:", err);
        return { success: false };
    }
};

// 게시글 좋아요 취소
export const cancelLikePostApi = async (
    authFetch: AuthFetch,
    postId: number
): Promise<{ success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<null>>(
            `/rest-api/v1/post/like/${postId}`,
            {}, 'DELETE'
        );
        console.log('Cancel Like Response:', response);
        return { success: isSuccess(response) };
    } catch (err) {
        console.error("좋아요 취소 중 오류:", err);
        return { success: false };
    }
};

// 게시글 저장
export const savePostApi = async (
    authFetch: AuthFetch,
    postId: number
): Promise<{ success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<null>>(
            `/rest-api/v1/post/collection/${postId}`,
            {}, 'POST'
        );
        console.log('Save Response:', response);
        return { success: isSuccess(response) };
    } catch (err) {
        console.error("저장 처리 중 오류:", err);
        return { success: false };
    }
};

// 게시글 저장 취소
export const cancelSavePostApi = async (
    authFetch: AuthFetch,
    postId: number
): Promise<{ success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<null>>(
            `/rest-api/v1/post/collection/${postId}`,
            {}, 'DELETE'
        );
        console.log('Cancel Save Response:', response);
        return { success: isSuccess(response) };
    } catch (err) {
        console.error("저장 취소 처리 중 오류:", err);
        return { success: false };
    }
};

// 게시글 삭제
export const deletePostApi = async (
    authFetch: AuthFetch,
    postId: number
): Promise<{ success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<null>>(
            `/rest-api/v1/post/${postId}`,
            {},
            'DELETE'
        );
        console.log('Delete Post Response:', response);
        return { success: isSuccess(response) };
    } catch (err) {
        console.error("게시글 삭제 중 오류:", err);
        return { success: false };
    }
};
