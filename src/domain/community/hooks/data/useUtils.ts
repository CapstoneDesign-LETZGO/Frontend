import { useState } from 'react';
import {cancelLikePostApi, cancelSavePostApi, likePostApi, savePostApi} from '../../services/PostService';
import { useAuthFetch } from '../../../../common/hooks/useAuthFetch';
import { toast } from 'react-toastify';

export const useUtils = () => {
    const [loading, setLoading] = useState(false);
    const { authFetch } = useAuthFetch();

    // 게시글 좋아요
    const likePost = async (postId: number) => {
        setLoading(true);
        try {
            await likePostApi(authFetch, postId);
        } catch (err) {
            console.error('좋아요 처리 중 오류 발생:', err);
            toast.error('좋아요 처리 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 게시글 좋아요 취소
    const cancelLikePost = async (postId: number) => {
        setLoading(true);
        try {
            await cancelLikePostApi(authFetch, postId);
        } catch (err) {
            console.error('좋아요 취소 중 오류 발생:', err);
            toast.error('좋아요 취소 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 게시글 저장
    const savePost = async (postId: number) => {
        setLoading(true);
        try {
            await savePostApi(authFetch, postId);
        } catch (err) {
            console.error('게시글 저장 중 오류 발생:', err);
            toast.error('게시글 저장 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 게시글 저장 취소
    const cancelSavePost = async (postId: number) => {
        setLoading(true);
        try {
            await cancelSavePostApi(authFetch, postId);
        } catch (err) {
            console.error('게시글 저장 취소 중 오류 발생:', err);
            toast.error('게시글 저장 취소 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return { likePost, cancelLikePost, savePost, cancelSavePost, loading };
};
