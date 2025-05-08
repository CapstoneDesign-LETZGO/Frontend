import {ApiResponse, ReturnCode} from "../../../../common/interfaces/response/ApiResponse.ts";
import { PostForm } from "../../../../common/interfaces/CommunityInterface.ts";

export const createPost = async (
    authFetch: <T>(
        url: string,
        data?: Record<string, unknown>,
        method?: "GET" | "POST" | "PUT" | "DELETE"
    ) => Promise<ApiResponse<T>>,
    form: PostForm,
    imageFile: File
): Promise<ReturnCode> => { // 성공 여부를 boolean이 아닌 ApiResponse로 반환
    try {
        const formData = new FormData();
        formData.append("postForm", new Blob([JSON.stringify(form)], { type: "application/json" }));
        formData.append("imageFile", imageFile);

        const response = await authFetch<ApiResponse<unknown>>("/rest-api/v1/post", {
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }, "POST");

        const returnCode = response?.data?.returnCode;
        if (returnCode === "SUCCESS") {
            return { SUCCESS: "SUCCESS", ERROR: "" };
        } else {
            console.error("게시글 등록 실패:", response?.data?.returnMessage);
            return { SUCCESS: "", ERROR: "ERROR" };
        }
    } catch (err) {
        console.error("게시글 등록 중 오류 발생:", err);
        throw new Error("게시글 등록 중 오류 발생");
    }
};

export const updateName = async (
    authFetch: <T>(
        url: string,
        data?: Record<string, unknown>,
        method?: "GET" | "POST" | "PUT" | "DELETE"
    ) => Promise<ApiResponse<T>>,
    newName: string
): Promise<ReturnCode> => { // 성공 여부를 boolean이 아닌 ApiResponse로 반환
    try {
        const response = await authFetch<ApiResponse<unknown>>(
            "/rest-api/v1/member",
            { data: { name: newName }, headers: { "Content-Type": "application/json" } },
            "PUT"
        );

        const returnCode = response?.data?.returnCode;

        if (returnCode === "SUCCESS") {
            return { SUCCESS: "SUCCESS", ERROR: "" };
        } else {
            console.error("이름 변경 실패:", response?.data?.returnMessage);
            return { SUCCESS: "", ERROR: "ERROR" };
        }
    } catch (err) {
        console.error("이름 변경 중 오류:", err);
        throw new Error("이름 변경 중 오류 발생");
    }
};
