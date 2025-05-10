import { useState, useCallback, useEffect } from "react";
import { useAuthFetch } from "../../../../common/hooks/useAuthFetch";
import { MemberDto } from "../../../../common/interfaces/MemberInterface";
import { updateNameApi } from "../services/ProfileService";
import { useUserInfo } from "../../../../common/hooks/useUserInfo.ts";
import {toast} from "react-toastify";

export const useMyProfile = () => {
  const [memberInfo, setMemberInfo] = useState<MemberDto | null>(null);
  const { fetchUserInfo, userInfo, loading: userLoading } = useUserInfo(); // useUserInfo 호출
  const { authFetch } = useAuthFetch();
  const [loading, setLoading] = useState(false);

  // 회원 정보 조회
  const fetchMemberInfo = useCallback(() => {
    if (userInfo) {
      setMemberInfo(userInfo); // userInfo를 상태에 설정
    }
  }, [userInfo]);

  // 회원 정보가 변경될 때마다 업데이트
  useEffect(() => {
    if (!userLoading && userInfo) {
      fetchMemberInfo(); // userInfo가 변경되면 호출
    }
  }, [userInfo, userLoading, fetchMemberInfo]);

  // 이름 수정
  const updateName = useCallback(
      async (newName: string): Promise<boolean> => {
        setLoading(true);
        try {
          const success = await updateNameApi(authFetch, newName);
          if (success) {
            await fetchMemberInfo(); // 이름 변경 후 정보 다시 로드
          }
          return success;
        } catch (err) {
          console.error("이름 변경 중 오류 발생:", err);
          toast.error("이름 변경 중 오류가 발생했습니다.");
          return false;
        } finally {
          setLoading(false);
        }
      },
      [authFetch, fetchMemberInfo]
  );

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const refetch = () => {
    fetchUserInfo();
  };

  return {
    updateName: updateName,
    memberInfo,
    loading,
    userLoading,
    refetch
  };
};
