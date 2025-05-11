export interface PostForm {
    mapX: number;
    mapY: number;
    content: string;
}

export interface PostDto {
    id: number;
    memberId: number;
    nickname: string;
    profileImageUrl: string | null;
    likeCount: number;
    commentCount: number;
    mapX: number;
    mapY: number;
    content: string;
    imageUrls: string[];
    createdAt: string;
}

export interface DetailPostDto {
    memberId: number;
    id: number;
    nickname: string;
    profileImageUrl: string;
    likeCount: number;
    commentCount: number;
    mapX: number;
    mapY: number;
    content: string;
    imageUrls: string[];
    liked: boolean;
    saved: boolean;
    createdAt: string;
}

export interface CommentForm {
    content: string;
    superCommentId: number | string;
}

export interface CommentDto {
    id: number;
    memberId: number;
    nickname: string;
    profileImageUrl: string;
    likeCount: number;
    content: string;
    superCommentId: number | null;
    createdAt: string;
}
