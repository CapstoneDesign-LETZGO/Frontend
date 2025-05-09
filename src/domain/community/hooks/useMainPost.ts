import { useState, useEffect } from 'react';
import { fetchPostApi } from '../services/CommunityService.ts';
import { DetailPostDto } from '../../../common/interfaces/CommunityInterface.ts';
import { useAuthFetch } from '../../../common/hooks/useAuthFetch';
import {toast} from "react-toastify";

export const useMainPost = () => {
    const [posts, setPosts] = useState<DetailPostDto[]>([]);
    const [loading, setLoading] = useState(false);
    const { authFetch } = useAuthFetch();

    // 본인/팔로우한 유저 게시글 조회
    const fetchPost = async () => {
        setLoading(true);
        try {
            const { posts, success } = await fetchPostApi(authFetch);
            if (success) {
                setPosts(posts);
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

    return { posts, loading, refetch };
};
