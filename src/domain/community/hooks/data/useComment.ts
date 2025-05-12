import {useState} from 'react';
import { toast } from 'react-toastify';
import {
    addCommentApi,
    cancelLikeCommentApi,
    deleteCommentApi,
    fetchCommentApi,
    likeCommentApi,
    updateCommentApi
} from '../../services/CommentService.ts';
import {useAuthFetch} from "../../../../common/hooks/useAuthFetch.ts";
import {CommentForm} from "../../../../common/interfaces/CommunityInterface.ts";
import {useQuery} from "@tanstack/react-query";
import {AuthFetch} from "../../../../common/utils/fetchUtils.ts";

// 해당 게시글에 작성된 모든 댓글 조회
const fetchComments = async (authFetch: AuthFetch, postId: number) => {
    const { comments, success } = await fetchCommentApi(authFetch, postId);
    if (success) {
        return comments;
    } else {
        throw new Error('댓글을 가져오는 중 오류 발생');
    }
};

export const useComment = (postId: number) => {
    const [loading, setLoading] = useState(false);
    const { authFetch } = useAuthFetch();

    // 댓글 목록을 useQuery로 가져오기
    const { data: comments = [], refetch } = useQuery({
        queryKey: ['comments', postId],
        queryFn: () => fetchComments(authFetch, postId),
        enabled: postId > 0,
    });

    // 댓글 추가
    const addComment = async (postId: number, content: string, superCommentId: number = 0) => {
        setLoading(true);
        try {
            const commentForm: CommentForm = {
                content,
                superCommentId,  // 기본은 0 (일반 댓글), 대댓글이면 부모 댓글 ID 넣기
            };
            await addCommentApi(authFetch, postId, commentForm);
        } catch (err) {
            console.error('댓글 추가 중 오류 발생:', err);
            toast.error('댓글 추가 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 댓글 수정
    const updateComment = async (commentId: number, content: string) => {
        setLoading(true);
        try {
            const commentForm: CommentForm = {
                content,
                superCommentId: "",
            };
            await updateCommentApi(authFetch, commentId, commentForm);
        } catch (err) {
            console.error('댓글 수정 중 오류 발생:', err);
            toast.error('댓글 수정 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 댓글 삭제
    const deleteComment = async (commentId: number) => {
        setLoading(true);
        try {
            await deleteCommentApi(authFetch, commentId);
        } catch (err) {
            console.error('댓글 삭제 중 오류 발생:', err);
            toast.error('댓글 삭제 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 댓글 좋아요
    const likeComment = async (commentId: number) => {
        setLoading(true);
        try {
            await likeCommentApi(authFetch, commentId);
        } catch (err) {
            console.error('댓글 좋아요 중 오류 발생:', err);
            toast.error('댓글 좋아요 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 댓글 좋아요 취소
    const cancelLikeComment = async (commentId: number) => {
        setLoading(true);
        try {
            await cancelLikeCommentApi(authFetch, commentId);
        } catch (err) {
            console.error('댓글 좋아요 취소 중 오류 발생:', err);
            toast.error('댓글 좋아요 취소 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return { comments, addComment, updateComment, deleteComment, likeComment, cancelLikeComment, loading, refetchComment: refetch };
};
