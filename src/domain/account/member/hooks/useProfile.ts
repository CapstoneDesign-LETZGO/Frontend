// ✅ useProfile.ts (추가/완성본)
import { useState, useCallback } from "react";
import { useAuthFetch } from "../../../../common/hooks/useAuthFetch";

interface PostForm {
  mapX: number;
  mapY: number;
  content: string;
}

interface MemberInfo {
  id: number;
  name: string;
  nickName: string;
  profileImageUrl: string | null;
  followMemberCount: number;
  followedMemberCount: number;
}

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memberInfo, setMemberInfo] = useState<MemberInfo | null>(null);
  const { authFetch } = useAuthFetch();

  // 게시글 생성
  const createPost = async (form: PostForm, imageFile: File): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("postForm", new Blob([JSON.stringify(form)], { type: "application/json" }));
      formData.append("imageFile", imageFile);

      const response = await authFetch(
        "/rest-api/v1/post",
        {
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
        "POST"
      );

      if (response?.data?.returnCode === "SUCCESS") {
        return true;
      } else {
        console.error("게시글 등록 실패:", response?.data?.returnMessage);
        setError("게시글 등록에 실패했습니다.");
        return false;
      }
    } catch (err) {
      console.error("게시글 등록 중 오류 발생:", err);
      setError("서버 오류가 발생했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 회원 정보 가져오기
  const fetchMemberInfo = useCallback(async () => {
    try {
      const response = await authFetch("/rest-api/v1/member", {}, "GET");
      if (response?.data?.returnCode === "SUCCESS") {
        setMemberInfo(response.data.data);
      } else {
        console.error("회원 정보 조회 실패:", response?.data?.returnMessage);
      }
    } catch (err) {
      console.error("회원 정보 조회 중 오류:", err);
    }
  }, [authFetch]);

  // 이름 변경
  const updateName = useCallback(
    async (newName: string): Promise<boolean> => {
      try {
        const response = await authFetch(
          "/rest-api/v1/member",
          {
            data: { name: newName },
            headers: {
              "Content-Type": "application/json",
            },
          },
          "PUT"
        );

        if (response?.data?.returnCode === "SUCCESS") {
          await fetchMemberInfo(); // 이름 변경 후 정보 다시 로드
          return true;
        } else {
          console.error("이름 변경 실패:", response?.data?.returnMessage);
          return false;
        }
      } catch (err) {
        console.error("이름 변경 중 오류:", err);
        return false;
      }
    },
    [authFetch, fetchMemberInfo]
  );

  return {
    createPost,
    fetchMemberInfo,
    updateName,
    memberInfo,
    loading,
    error,
  };
};
