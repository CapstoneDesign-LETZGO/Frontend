import { useState, useEffect } from 'react';
import {addPostApi, fetchPostApi} from '../services/PostService.ts';
import {DetailPostDto, PostForm} from '../../../common/interfaces/CommunityInterface.ts';
import { useAuthFetch } from '../../../common/hooks/useAuthFetch';
import {toast} from "react-toastify";

export const usePost = () => {
    const [posts, setPosts] = useState<DetailPostDto[]>([]);
    const [loading, setLoading] = useState(false);
    const { authFetch } = useAuthFetch();

    // 게시글 생성
    const addPost = async (form: PostForm, imageFile: File): Promise<boolean> => {
        setLoading(true);
        try {
            const success = await addPostApi(authFetch, form, imageFile);
            if (success) {
                await refetch();
            }
            return success;
        } catch (err) {
            console.error("게시글 등록 중 오류 발생:", err);
            toast.error("게시글 등록 중 오류가 발생했습니다.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // 본인/팔로우한 유저 게시글 조회
    const fetchPost = async () => {
        setLoading(true);
        try {
            const { posts, success } = await fetchPostApi(authFetch);
            if (success) {
                setPosts(posts.map(post => ({ ...post })));
            } else {
                return null;
            }
        } catch (err) {
            console.error('게시글을 가져오는 중 오류 발생:', err);
            toast.error("게시글을 가져오는 중 오류가 발생했습니다.");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPost();
    }, []);

    const refetch = () => {
        fetchPost();
    };

    return { addPost: addPost, posts, loading, refetch };
};
