export interface LetzgoPage<T> {
    contents: T[];      // 게시글 데이터
    pageNumber: number; // 현재 페이지 번호
    pageSize: number;   // 페이지 크기
    totalPages: number; // 총 페이지 수
    totalCount: number; // 총 데이터 개수
}
