import {useEffect, useState} from 'react';
import {addPostApi, deletePostApi, fetchMemberPostApi, fetchPostApi} from '../../services/PostService.ts';
import {DetailPostDto, PostForm} from '../../../../common/interfaces/CommunityInterface.ts';
import { useAuthFetch } from '../../../../common/hooks/useAuthFetch';
import {toast} from "react-toastify";

type Mode = 'all' | 'member' | 'none';

export const usePost = (mode: Mode = 'all', memberId?: number) => {
    const [posts, setPosts] = useState<DetailPostDto[]>([]);
    const [loading, setLoading] = useState(false);
    const { authFetch } = useAuthFetch();

    // 본인/팔로우한 유저 게시글 조회
    const fetchPost = async () => {
        setLoading(true);
        try {
            const { posts, success } = await fetchPostApi(authFetch);
            if (success) {
                setPosts(posts.map(post => ({ ...post })));
            }
        } catch (err) {
            console.error('게시글 조회 중 오류 발생:', err);
            toast.error("게시글 조회 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 해당 사용자가 작성한 게시글 조회
    const fetchMemberPost = async (memberId: number) => {
        setLoading(true);
        try {
            const { posts, success } = await fetchMemberPostApi(authFetch, memberId);
            if (success) {
                setPosts(posts.map(post => ({ ...post })));
            }
        } catch (err) {
            console.error('해당 사용자의 게시글 조회 중 오류 발생:', err);
            toast.error("해당 사용자의 게시글 조회 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 게시글 생성
    const addPost = async (form: PostForm, imageFiles: File[]) => {
        setLoading(true);
        try {
            await addPostApi(authFetch, form, imageFiles);
        } catch (err) {
            console.error("게시글 등록 중 오류 발생:", err);
            toast.error("게시글 등록 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 게시글 삭제
    const deletePost = async (postId: number) => {
        setLoading(true);
        try {
            await deletePostApi(authFetch, postId);
        } catch (err) {
            console.error('게시글 삭제 중 오류 발생:', err);
            toast.error('게시글 삭제 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // mode에 따라 초기 fetch
    useEffect(() => {
        if (mode === 'all') {
            fetchPost();
        } else if (mode === 'member' && memberId) {
            fetchMemberPost(memberId);
        }
    }, [mode, memberId]);

    const refetchPost = () => {
        if (mode === 'all') {
            fetchPost();
        } else if (mode === 'member' && memberId) {
            fetchMemberPost(memberId);
        }
    };

    return { addPost, posts, loading, refetchPost, deletePost };
};
