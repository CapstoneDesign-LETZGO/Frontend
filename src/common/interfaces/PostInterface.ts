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
