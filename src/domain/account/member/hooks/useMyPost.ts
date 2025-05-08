import { useState, useCallback, useEffect } from "react";
import { useAuthFetch } from "../../../../common/hooks/useAuthFetch";
import { MemberDto } from "../../../../common/interfaces/MemberInterface";
import { createPost, updateName } from "../services/ProfileService";
import { useUserInfo } from "../../../../common/hooks/useUserInfo.ts";
import { PostForm } from "../../../../common/interfaces/CommunityInterface.ts";

export const useMyPost = () => {
  const [memberInfo, setMemberInfo] = useState<MemberDto | null>(null);
  const { userInfo, loading: userLoading, error: userError } = useUserInfo(); // useUserInfo 호출
  const { authFetch } = useAuthFetch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 회원 정보 가져오기
  const handleFetchMemberInfo = useCallback(() => {
    if (userInfo) {
      setMemberInfo(userInfo); // userInfo를 상태에 설정
    }
  }, [userInfo]);

  // 회원 정보가 변경될 때마다 업데이트
  useEffect(() => {
    if (!userLoading && !userError && userInfo) {
      handleFetchMemberInfo(); // userInfo가 변경되면 호출
    }
  }, [userInfo, userLoading, userError, handleFetchMemberInfo]);

  // 게시글 생성
  const handleCreatePost = async (form: PostForm, imageFile: File): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await createPost(authFetch, form, imageFile);

      if (response.SUCCESS === "SUCCESS") {
        setLoading(false);
        return true;
      } else {
        setError("게시글 등록에 실패했습니다.");
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error("게시글 등록 중 오류 발생:", err);
      setError("게시글 등록 중 오류가 발생했습니다.");
      setLoading(false);
      return false;
    }
  };

  // 이름 변경
  const handleUpdateName = useCallback(
      async (newName: string): Promise<boolean> => {
        try {
          const response = await updateName(authFetch, newName);

          if (response.SUCCESS === "SUCCESS") {
            await handleFetchMemberInfo(); // 이름 변경 후 정보 다시 로드
            return true;
          } else {
            setError("이름 변경에 실패했습니다.");
            return false;
          }
        } catch (err) {
          console.error("이름 변경 중 오류 발생:", err);
          setError("이름 변경 중 오류가 발생했습니다.");
          return false;
        }
      },
      [authFetch, handleFetchMemberInfo]
  );

  return {
    createPost: handleCreatePost,
    updateName: handleUpdateName,
    memberInfo,
    loading,
    error,
    userLoading,
    userError,
    handleFetchMemberInfo
  };
};
