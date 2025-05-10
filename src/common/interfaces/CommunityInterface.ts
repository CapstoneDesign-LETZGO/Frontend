export interface PostForm {
    mapX: number;
    mapY: number;
    content: string;
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
