import { useEffect, useState, useCallback } from "react";
import { useAuthFetch } from "../../../../common/hooks/useAuthFetch";
import { PostDto } from "../../../../common/interfaces/PostInterface";
import { useUserInfo } from "../../../../common/hooks/useUserInfo";
import { fetchMyPostsApi } from "../services/ProfileService"; 

export const mockPosts: PostDto[] = [
  {
    id: 1,
    memberId: 1,
    nickname: "seoul_gangnam",
    profileImageUrl: null,
    likeCount: 3,
    commentCount: 10,
    mapX: 126.925978,
    mapY: 37.525477,
    content: "더현대서울 다녀온 후기!",
    imageUrls: [
      "https://letzgo-bucket-v1.s3.ap-northeast-2.amazonaws.com/post-images/973be335-86b0-4fee-87e7-3e44bcd396bc_hyundai.jpeg",
      "https://letzgo-bucket-v1.s3.ap-northeast-2.amazonaws.com/post-images/ca835984-2119-4a73-9678-5c7639861d47_hyundaiburger.jpeg"
    ],
    createdAt: "2025-05-10T22:25:18.285138"
  },
  {
    id: 2,
    memberId: 1,
    nickname: "seoul_gangnam",
    profileImageUrl: null,
    likeCount: 5,
    commentCount: 2,
    mapX: 126.93,
    mapY: 37.52,
    content: "한강 야경 넘 이뻤음",
    imageUrls: [],
    createdAt: "2025-05-09T21:15:18.000000"
  },
  {
    id: 3,
    memberId: 1,
    nickname: "seoul_gangnam",
    profileImageUrl: null,
    likeCount: 3,
    commentCount: 10,
    mapX: 126.925978,
    mapY: 37.525477,
    content: "더현대서울 다녀온 후기!",
    imageUrls: [
      "https://letzgo-bucket-v1.s3.ap-northeast-2.amazonaws.com/post-images/973be335-86b0-4fee-87e7-3e44bcd396bc_hyundai.jpeg",
      "https://letzgo-bucket-v1.s3.ap-northeast-2.amazonaws.com/post-images/ca835984-2119-4a73-9678-5c7639861d47_hyundaiburger.jpeg"
    ],
    createdAt: "2025-05-10T22:25:18.285138"
  },
  {
    id: 4,
    memberId: 1,
    nickname: "seoul_gangnam",
    profileImageUrl: null,
    likeCount: 3,
    commentCount: 10,
    mapX: 126.925978,
    mapY: 37.525477,
    content: "더현대서울 다녀온 후기!",
    imageUrls: [
      "https://letzgo-bucket-v1.s3.ap-northeast-2.amazonaws.com/post-images/973be335-86b0-4fee-87e7-3e44bcd396bc_hyundai.jpeg",
      "https://letzgo-bucket-v1.s3.ap-northeast-2.amazonaws.com/post-images/ca835984-2119-4a73-9678-5c7639861d47_hyundaiburger.jpeg"
    ],
    createdAt: "2025-05-10T22:25:18.285138"
  },
  {
    id: 5,
    memberId: 1,
    nickname: "seoul_gangnam",
    profileImageUrl: null,
    likeCount: 3,
    commentCount: 10,
    mapX: 126.925978,
    mapY: 37.525477,
    content: "더현대서울 다녀온 후기!",
    imageUrls: [
      "https://letzgo-bucket-v1.s3.ap-northeast-2.amazonaws.com/post-images/973be335-86b0-4fee-87e7-3e44bcd396bc_hyundai.jpeg",
      "https://letzgo-bucket-v1.s3.ap-northeast-2.amazonaws.com/post-images/ca835984-2119-4a73-9678-5c7639861d47_hyundaiburger.jpeg"
    ],
    createdAt: "2025-05-10T22:25:18.285138"
  }
];



export const useMyPosts = () => {
  const { authFetch } = useAuthFetch();
  const { userInfo } = useUserInfo();
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    //if (!userInfo) return;
    setLoading(true);
    try {
      //const postList = await fetchMyPostsApi(authFetch, userInfo.id);
      const postList = mockPosts; //테스트용
      setPosts(postList);
    } catch (err) {
      console.error("게시글 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  }, [authFetch, userInfo]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, refetch: fetchPosts };
};
