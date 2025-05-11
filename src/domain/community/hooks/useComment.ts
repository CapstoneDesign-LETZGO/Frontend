import {useEffect, useState} from 'react';
import { toast } from 'react-toastify';
import {
    addCommentApi,
    cancelLikeCommentApi,
    deleteCommentApi,
    fetchCommentApi,
    likeCommentApi,
    updateCommentApi
} from '../services/CommentService.ts';
import {useAuthFetch} from "../../../common/hooks/useAuthFetch.ts";
import {CommentDto, CommentForm} from "../../../common/interfaces/CommunityInterface.ts";

export const useComment = (postId: number) => {
    const [comments, setComments] = useState<CommentDto[]>([]);
    const [loading, setLoading] = useState(false);
    const { authFetch } = useAuthFetch();

    // 해당 게시글에 작성된 모든 댓글 조회
    const fetchComment = async (postId: number) => {
        setLoading(true);
        try {
            const { comments, success } = await fetchCommentApi(authFetch, postId);
            if (success) {
                setComments(comments.map(comment => ({ ...comment })));
            } else {
                return null;
            }
        } catch (err) {
            console.error('댓글을 가져오는 중 오류 발생:', err);
            toast.error("댓글을 가져오는 중 오류가 발생했습니다.");
        }
        setLoading(false);
    };

    // 댓글 추가
    const addComment = async (postId: number, content: string, superCommentId: number = 0) => {
        setLoading(true);
        try {
            const commentForm: CommentForm = {
                content,
                superCommentId,  // 기본은 0 (일반 댓글), 대댓글이면 부모 댓글 ID 넣기
            };
            const { success } = await addCommentApi(authFetch, postId, commentForm);
            if (!success) {
                toast.error('댓글 추가에 실패했습니다.');
            }
        } catch (err) {
            console.error('댓글 추가 중 오류 발생:', err);
            toast.error('댓글 추가 중 오류가 발생했습니다.');
        }
        setLoading(false);
    };

    // 댓글 수정
    const updateComment = async (commentId: number, content: string) => {
        setLoading(true);
        try {
            const commentForm: CommentForm = {
                content,
                superCommentId: "",
            };
            const { success } = await updateCommentApi(authFetch, commentId, commentForm);
            if (!success) {
                toast.error('댓글 수정에 실패했습니다.');
            }
        } catch (err) {
            console.error('댓글 수정 중 오류 발생:', err);
            toast.error('댓글 수정 중 오류가 발생했습니다.');
        }
        setLoading(false);
    };

    // 댓글 삭제
    const deleteComment = async (commentId: number) => {
        setLoading(true);
        try {
            const { success } = await deleteCommentApi(authFetch, commentId);
            if (!success) {
                toast.error('댓글 삭제에 실패했습니다.');
            }
        } catch (err) {
            console.error('댓글 삭제 중 오류 발생:', err);
            toast.error('댓글 삭제 중 오류가 발생했습니다.');
        }
        setLoading(false);
    };

    // 댓글 좋아요
    const likeComment = async (commentId: number) => {
        setLoading(true);
        try {
            const { success } = await likeCommentApi(authFetch, commentId);
            if (!success) {
                toast.error('댓글 좋아요에 실패했습니다.');
            }
        } catch (err) {
            console.error('댓글 좋아요 중 오류 발생:', err);
            toast.error('댓글 좋아요 중 오류가 발생했습니다.');
        }
        setLoading(false);
    };

    // 댓글 좋아요 취소
    const cancelLikeComment = async (commentId: number) => {
        setLoading(true);
        try {
            const { success } = await cancelLikeCommentApi(authFetch, commentId);
            if (!success) {
                toast.error('댓글 좋아요 취소에 실패했습니다.');
            }
        } catch (err) {
            console.error('댓글 좋아요 취소 중 오류 발생:', err);
            toast.error('댓글 좋아요 취소 중 오류가 발생했습니다.');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchComment(postId);
    }, []);

    const refetchComment = () => {
        fetchComment(postId);
    };

    return { comments, addComment, updateComment, deleteComment, likeComment, cancelLikeComment, loading, refetchComment };
};
