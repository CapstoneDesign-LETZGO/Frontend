import {useEffect, useState} from 'react';
import {toast} from "react-toastify";
import { useAuthFetch } from '../../../../common/hooks/useAuthFetch';
import {DetailMemberDto, MemberDto, MemberForm} from '../../../../common/interfaces/MemberInterface';
import {
    deleteMemberApi,
    fetchDetailMemberApi,
    fetchMemberApi, fetchOtherDetailMemberApi, fetchOtherMemberApi, searchMemberApi,
    signupApi,
    updateMemberApi
} from '../services/MemberActionService.ts';

type Mode = 'member' | 'detailMember' | 'otherMember' | 'otherDetailMember';

interface UseMemberActionsOptions {
    mode?: Mode;
    memberIdForOther?: number;
}

export const useMemberActions = ({ mode = 'member', memberIdForOther }: UseMemberActionsOptions = {}) => {
    const [member, setMember] = useState<MemberDto | null>(null);
    const [detailMember, setDetailMember] = useState<DetailMemberDto | null>(null);
    const [otherMember, setOtherMember] = useState<MemberDto | null>(null);
    const [otherDetailMember, setOtherDetailMember] = useState<DetailMemberDto | null>(null);
    const [loading, setLoading] = useState(false);
    const { authFetch } = useAuthFetch();

    // 회원가입
    const signup = async (form: MemberForm) => {
        setLoading(true);
        try {
            await signupApi(authFetch, form);
        } catch (err) {
            console.error("회원가입 중 오류:", err);
            toast.error("회원가입 중 오류가 발생했습니다.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // 본인 정보 조회
    const fetchMember = async () => {
        setLoading(true);
        try {
            const { member, success } = await fetchMemberApi(authFetch);
            if (success) {
                setMember(member);
            }
        } catch (err) {
            console.error("사용자 정보를 가져오는 중 오류 발생:", err);
            toast.error("사용자 정보를 가져오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 본인 상세 정보 조회
    const fetchDetailMember = async () => {
        setLoading(true);
        try {
            const { memberDetail, success } = await fetchDetailMemberApi(authFetch);
            if (success) {
                setDetailMember(memberDetail);
            }
        } catch (err) {
            console.error("사용자 상세 정보를 가져오는 중 오류 발생:", err);
            toast.error("사용자 상세 정보를 가져오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 다른 회원 정보 조회
    const fetchOtherMember = async (memberId: number) => {
        setLoading(true);
        try {
            const { member, success } = await fetchOtherMemberApi(authFetch, memberId);
            if (success) {
                setOtherMember(member);
                return member;
            }
        } catch (err) {
            console.error("다른 회원 정보를 가져오는 중 오류:", err);
            toast.error("다른 회원 정보를 가져오는 중 오류가 발생했습니다.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    // 다른 회원 상세 정보 조회
    const fetchOtherDetailMember = async (memberId: number) => {
        setLoading(true);
        try {
            const { memberDetail, success } = await fetchOtherDetailMemberApi(authFetch, memberId);
            if (success) {
                setOtherDetailMember(memberDetail);
                return memberDetail;
            }
        } catch (err) {
            console.error("다른 회원 상세 정보를 가져오는 중 오류:", err);
            toast.error("다른 회원 상세 정보를 가져오는 중 오류가 발생했습니다.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    // 회원 검색
    const searchMember = async (keyword: string) => {
        setLoading(true);
        try {
            const { members, success } = await searchMemberApi(authFetch, keyword);
            if (success) {
                return members;
            }
        } catch (err) {
            console.error("회원 검색 중 오류:", err);
            toast.error("회원 검색 중 오류가 발생했습니다.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    // 회원정보 수정 함수
    const updateMember = async (form: Partial<MemberForm>, imageFile: File | null = null) => {
        setLoading(true);
        try {
            const success = await updateMemberApi(authFetch, form, imageFile);
            if (success) {
                toast.success('회원정보가 성공적으로 수정되었습니다.');
                refetchMember(); // 수정 후 최신 정보 다시 가져오기
            }
        } catch (err) {
            console.error('회원정보 수정 중 오류 발생:', err);
            toast.error('회원정보 수정 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 회원 탈퇴
    const deleteMember = async () => {
        setLoading(true);
        try {
            await deleteMemberApi(authFetch);
        } catch (err) {
            console.error("회원 탈퇴 중 오류:", err);
            toast.error("회원 탈퇴 중 오류가 발생했습니다.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (mode === 'member') {
            fetchMember();
        } else if (mode === 'detailMember') {
            fetchDetailMember();
        } else if (mode === 'otherMember' && memberIdForOther !== undefined) {
            fetchOtherMember(memberIdForOther);
        } else if (mode === 'otherDetailMember' && memberIdForOther !== undefined) {
            fetchOtherDetailMember(memberIdForOther);
        }
    }, [mode, memberIdForOther]);

    const refetchMember = () => {
        if (mode === 'member') {
            fetchMember();
        } else if (mode === 'detailMember') {
            fetchDetailMember();
        } else if (mode === 'otherMember' && memberIdForOther !== undefined) {
            fetchOtherMember(memberIdForOther);
        } else if (mode === 'otherDetailMember' && memberIdForOther !== undefined) {
            fetchOtherDetailMember(memberIdForOther);
        }
    };

    return {
        refetchMember,
        member,
        detailMember,
        otherMember,
        otherDetailMember,
        loading,
        signup,
        updateMember,
        deleteMember,
        fetchOtherMember,
        fetchOtherDetailMember,
        searchMember
    };
};
