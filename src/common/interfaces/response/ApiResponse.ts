import { LetzgoPage } from "./LetzgoPage";

export interface ApiResponse<T> {
    returnCode: string;
    returnMessage: string;
    data?: T;               // data가 있을 수 있음
    letzgoPage?: LetzgoPage<T>; // letzgoPage가 있을 수 있음
}

export interface ReturnCode {
    SUCCESS: string;
    ERROR: string;
}
