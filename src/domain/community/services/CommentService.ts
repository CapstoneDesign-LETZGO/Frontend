import { ApiResponse } from "../../../common/interfaces/response/ApiResponse.ts";
import { CommentDto, CommentForm } from "../../../common/interfaces/CommunityInterface.ts";
import { AuthFetch, isSuccess } from "../../../common/utils/fetchUtils.ts";

// 해당 게시글에 작성된 모든 댓글 조회
export const fetchCommentApi = async (
    authFetch: AuthFetch,
    postId: number
): Promise<{ comments: CommentDto[]; success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<CommentDto>>(
            `/rest-api/v1/post/comment/${postId}`, {}, 'GET'
        );
        console.log('Response Data:', response);
        if (isSuccess(response)) {
            const comments = response?.letzgoPage?.contents as unknown as CommentDto[] ?? [];
            return { comments, success: true };
        } else {
            console.error("댓글 목록 조회 실패:", response?.returnMessage);
            return { comments: [], success: false };
        }
    } catch (err) {
        console.error("댓글 목록 조회 중 오류:", err);
        return { comments: [], success: false };
    }
};

// 댓글 추가
export const addCommentApi = async (
    authFetch: AuthFetch,
    postId: number,
    commentForm: CommentForm
): Promise<{ success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<null>>(
            `/rest-api/v1/post/comment/${postId}`,
            commentForm as unknown as Record<string, unknown>,
            'POST'
        );
        console.log('Add Comment Response:', response);
        return { success: isSuccess(response) };
    } catch (err) {
        console.error("댓글 추가 중 오류:", err);
        return { success: false };
    }
};

// 댓글 수정
export const updateCommentApi = async (
    authFetch: AuthFetch,
    commentId: number,
    commentForm: CommentForm
): Promise<{ success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<null>>(
            `/rest-api/v1/post/comment/${commentId}`,
            commentForm as unknown as Record<string, unknown>,
            'PUT'
        );
        console.log('Update Comment Response:', response);
        return { success: isSuccess(response) };
    } catch (err) {
        console.error('댓글 수정 중 오류:', err);
        return { success: false };
    }
};

// 댓글 삭제
export const deleteCommentApi = async (
    authFetch: AuthFetch,
    commentId: number
): Promise<{ success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<null>>(
            `/rest-api/v1/post/comment/${commentId}`,
            undefined, 'DELETE'
        );
        console.log('Delete Comment Response:', response);
        return { success: isSuccess(response) };
    } catch (err) {
        console.error("댓글 삭제 중 오류:", err);
        return { success: false };
    }
};

// 댓글 좋아요
export const likeCommentApi = async (
    authFetch: AuthFetch,
    commentId: number
): Promise<{ success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<null>>(
            `/rest-api/v1/post/comment/like/${commentId}`,
            {}, 'POST'
        );
        console.log('Like Comment Response:', response);
        return { success: isSuccess(response) };
    } catch (err) {
        console.error('댓글 좋아요 중 오류:', err);
        return { success: false };
    }
};

// 댓글 좋아요 취소
export const cancelLikeCommentApi = async (
    authFetch: AuthFetch,
    commentId: number
): Promise<{ success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<null>>(
            `/rest-api/v1/post/comment/like/${commentId}`,
            {}, 'DELETE'
        );
        console.log('Cancel Like Comment Response:', response);
        return { success: isSuccess(response) };
    } catch (err) {
        console.error('댓글 좋아요 취소 중 오류:', err);
        return { success: false };
    }
};
