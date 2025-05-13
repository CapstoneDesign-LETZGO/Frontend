import {useEffect, useState} from 'react';
import {toast} from "react-toastify";
import { useAuthFetch } from '../../../../common/hooks/useAuthFetch';
import {DetailMemberDto, MemberDto, MemberForm} from '../../../../common/interfaces/MemberInterface';
import {fetchDetailMemberApi, fetchMemberApi, updateMemberApi} from '../services/MemberService';

type Mode = 'member' | 'detailMember';

export const useMemberActions = (mode: Mode = 'member') => {
    const [memberInfo, setMemberInfo] = useState<MemberDto | null>(null);
    const [detailMemberInfo, setDetailMemberInfo] = useState<DetailMemberDto | null>(null);
    const [loading, setLoading] = useState(false);
    const { authFetch } = useAuthFetch();

    // 본인 정보 조회
    const fetchMember = async () => {
        setLoading(true);
        try {
            const { member, success } = await fetchMemberApi(authFetch);
            if (success) {
                setMemberInfo(member);
            } else {
                return null;
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
                setDetailMemberInfo(memberDetail);
            } else {
                return null;
            }
        } catch (err) {
            console.error("사용자 상세 정보를 가져오는 중 오류 발생:", err);
            toast.error("사용자 상세 정보를 가져오는 중 오류가 발생했습니다.");
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
                refetch(); // 수정 후 최신 정보 다시 가져오기
            } else {
                return null;
            }
        } catch (err) {
            console.error('회원정보 수정 중 오류 발생:', err);
            toast.error('회원정보 수정 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // mode에 따라 초기 fetch
    useEffect(() => {
        if (mode === 'member') {
            fetchMember();
        } else if (mode === 'detailMember') {
            fetchDetailMember();
        }
    }, [mode]);

    const refetch = () => {
        if (mode === 'member') {
            fetchMember();
        } else if (mode === 'detailMember') {
            fetchDetailMember();
        }
    };

    return { refetch, memberInfo, detailMemberInfo, loading, updateMember };
};
