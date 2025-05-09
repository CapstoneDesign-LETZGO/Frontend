import { PostForm } from "../interfaces/CommunityInterface";
import { addPostApi } from "../services/commonService";
import {useState} from "react";
import {useAuthFetch} from "./useAuthFetch.ts";
import {useMainPost} from "../../domain/community/hooks/useMainPost.ts";
import {toast} from "react-toastify";

export const useAddPost = () => {
    const { authFetch } = useAuthFetch();
    const { refetch } = useMainPost();
    const [loading, setLoading] = useState(false);

    // 게시글 생성
    const addPost = async (form: PostForm, imageFile: File): Promise<boolean> => {
        setLoading(true);
        try {
            const success = await addPostApi(authFetch, form, imageFile);
            if (success) {
                await refetch();
            }
            return success;
        } catch (err) {
            console.error("게시글 등록 중 오류 발생:", err);
            toast.error("게시글 등록 중 오류가 발생했습니다.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        addPost: addPost,
        loading,
    }
}
