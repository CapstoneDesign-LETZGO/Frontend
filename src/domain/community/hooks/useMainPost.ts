import { useState, useEffect } from 'react';
import { getPosts } from '../services/CommunityService.ts';
import { DetailPostDto } from '../../../common/interfaces/CommunityInterface.ts';
import { useAuthFetch } from '../../../common/hooks/useAuthFetch';

export const useMainPost = () => {
    const [posts, setPosts] = useState<DetailPostDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { authFetch } = useAuthFetch();

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await getPosts(authFetch);
            if (response.returnCode === 'SUCCESS') {
                setPosts(response.posts);
            } else {
                setError('게시글을 가져오는데 실패했습니다.');
            }
        } catch (err) {
            console.error('게시글을 가져오는 중 오류 발생:', err);
            setError('게시글을 가져오는데 오류가 발생했습니다.');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const refetch = () => {
        fetchPosts();
    };

    return { posts, loading, error, refetch };
};
