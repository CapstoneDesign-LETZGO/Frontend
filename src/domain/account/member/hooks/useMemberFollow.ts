import { useAuthFetch } from "../../../../common/hooks/useAuthFetch";
import { toast } from "react-toastify";
import {
  followRequestApi,
  followRequestCancelApi,
  acceptFollowApi,
  rejectFollowApi,
  cancelFollowApi,
  deleteFollowerApi,
} from "../services/MemberFollowService";

export const useMemberFollow = () => {
  const { authFetch } = useAuthFetch();

  const followRequest = async (memberId: number): Promise<boolean> => {
    const { success } = await followRequestApi(authFetch, memberId);
    if (!success) toast.error("팔로우 요청 실패");
    return success;
  };

  const followRequestCancel = async (memberId: number): Promise<boolean> => {
    const { success } = await followRequestCancelApi(authFetch, memberId);
    if (!success) toast.error("팔로우 요청 취소 실패");
    return success;
  };

  const acceptFollowRequest = async (memberId: number): Promise<boolean> => {
    const { success } = await acceptFollowApi(authFetch, memberId);
    if (!success) toast.error("팔로우 수락 실패");
    return success;
  };

  const rejectFollowRequest = async (memberId: number): Promise<boolean> => {
    const { success } = await rejectFollowApi(authFetch, memberId);
    if (!success) toast.error("팔로우 거절 실패");
    return success;
  };

  const cancelFollow = async (memberId: number): Promise<boolean> => {
    const { success } = await cancelFollowApi(authFetch, memberId);
    if (!success) toast.error("팔로우 취소 실패");
    return success;
  };

  const deleteFollower = async (memberId: number): Promise<boolean> => {
    const { success } = await deleteFollowerApi(authFetch, memberId);
    if (!success) toast.error("팔로워 삭제 실패");
    return success;
  };

  return {
    followRequest,
    followRequestCancel,
    acceptFollowRequest,
    rejectFollowRequest,
    cancelFollow,
    deleteFollower,
  };
};
