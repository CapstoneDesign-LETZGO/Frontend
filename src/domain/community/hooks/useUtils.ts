import { useState } from 'react';
import {cancelLikePostApi, cancelSavePostApi, likePostApi, savePostApi} from '../services/PostService';
import { useAuthFetch } from '../../../common/hooks/useAuthFetch';
import { toast } from 'react-toastify';

export const useUtils = () => {
    const [loading, setLoading] = useState(false);
    const { authFetch } = useAuthFetch();

    // 게시글 좋아요
    const likePost = async (postId: number) => {
        setLoading(true);
        try {
            const { success } = await likePostApi(authFetch, postId);
            if (!success) {
                toast.error('좋아요 처리에 실패했습니다.');
            }
        } catch (err) {
            console.error('좋아요 처리 중 오류 발생:', err);
            toast.error('좋아요 처리 중 오류가 발생했습니다.');
        }
        setLoading(false);
    };

    // 게시글 좋아요 취소
    const cancelLikePost = async (postId: number) => {
        setLoading(true);
        try {
            const { success } = await cancelLikePostApi(authFetch, postId);
            if (!success) {
                toast.error('좋아요 취소에 실패했습니다.');
            }
        } catch (err) {
            console.error('좋아요 취소 중 오류 발생:', err);
            toast.error('좋아요 취소 중 오류가 발생했습니다.');
        }
        setLoading(false);
    };

    // 게시글 저장
    const savePost = async (postId: number) => {
        setLoading(true);
        try {
            const { success } = await savePostApi(authFetch, postId);
            if (!success) {
                toast.error('게시글 저장에 실패했습니다.');
            }
        } catch (err) {
            console.error('게시글 저장 중 오류 발생:', err);
            toast.error('게시글 저장 중 오류가 발생했습니다.');
        }
        setLoading(false);
    };

    // 게시글 저장 취소
    const cancelSavePost = async (postId: number) => {
        setLoading(true);
        try {
            const { success } = await cancelSavePostApi(authFetch, postId);
            if (!success) {
                toast.error('게시글 저장 취소에 실패했습니다.');
            }
        } catch (err) {
            console.error('게시글 저장 취소 중 오류 발생:', err);
            toast.error('게시글 저장 취소 중 오류가 발생했습니다.');
        }
        setLoading(false);
    };

    return { likePost, cancelLikePost, savePost, cancelSavePost, loading };
};
