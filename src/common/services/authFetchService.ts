import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import authApi from "../libs/authApi.ts";
import publicApi from "../libs/publicApi.ts";
import { ApiResponse } from '../interfaces/response/ApiResponse.ts';

// ✅ FormData 판별
function isFormData(body: unknown): body is FormData {
  return typeof FormData !== 'undefined' && body instanceof FormData;
}

// ✅ AxiosError 타입 가드
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined;
}

// ✅ 토큰 자동 갱신 함수
export const tryRefreshToken = async (): Promise<boolean> => {
  const userToken = JSON.parse(localStorage.getItem('userToken') || '{}');
  const refreshUrl = '/rest-api/v1/auth/refresh-token';
  try {
    const response = await publicApi.get(refreshUrl, {
      headers: {
        'Authorization': `Bearer ${userToken.refreshToken}`,
      }
    });
    if (response.status === 200) {
      const newTokens = response.data.data;
      localStorage.setItem('userToken', JSON.stringify({
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      }));
      console.log('[authFetch] 토큰 재발급 성공');
      return true;
    }
  } catch (err) {
    console.error('[authFetch] 토큰 재발급 실패:', err);
  }
  return false;
};

// ✅ 인증 API 요청 함수 (returnCode 유무 유연 처리)
export const authFetch = async <T>(
  url: string,
  data: Record<string, unknown> | FormData = {},
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'
): Promise<ApiResponse<T>> => {
  const userToken = JSON.parse(localStorage.getItem('userToken') || '{}');

  const config: AxiosRequestConfig = {
    method,
    url,
    headers: {
      'Authorization': `Bearer ${userToken.accessToken}`,
      'Content-Type': 'application/json',
    },
  };

  const isForm = isFormData(data);

  if (method === 'GET') {
    if (isForm) throw new Error('GET method does not support FormData payload');
    config.params = data;
  } else {
    config.data = data;
  }

  if (isForm) {
    config.headers = {
      'Authorization': `Bearer ${userToken.accessToken}`,
    };
  }

  try {
    console.log(`[authFetch] ${method} ${url}`, data);
    const response: AxiosResponse = await authApi(config);
    const responseData = response.data;
    console.log('[authFetch] Response:', responseData);

    // ✅ returnCode가 있는 경우 (표준 응답)
    if (typeof responseData === 'object' && responseData !== null && 'returnCode' in responseData) {
      if (responseData.returnCode === 'SUCCESS') {
        return responseData as ApiResponse<T>;
      }
      throw new Error(responseData?.returnMessage || 'Invalid response format');
    }

    // ✅ 단순 숫자/문자/객체 응답인 경우 유연 처리
    return {
      returnCode: 'SUCCESS',
      returnMessage: 'OK',
      data: responseData as T,
    };

  } catch (error: unknown) {
    console.error('[authFetch] Request failed:', error);

    if (isAxiosError(error) && error.response?.status === 401) {
      console.log('[authFetch] 401 오류 - 토큰 재발급 시도');
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        const newUserToken = JSON.parse(localStorage.getItem('userToken') || '{}');
        config.headers!['Authorization'] = `Bearer ${newUserToken.accessToken}`;
        try {
          const retryResponse: AxiosResponse = await authApi(config);
          const retryData = retryResponse.data;

          if (typeof retryData === 'object' && retryData !== null && 'returnCode' in retryData) {
            if (retryData.returnCode === 'SUCCESS') {
              console.log('[authFetch] 재시도 성공');
              return retryData as ApiResponse<T>;
            }
            throw new Error(retryData?.returnMessage || 'Invalid response format after retry');
          }

          // 단순 응답인 경우 재시도 성공 처리
          return {
            returnCode: 'SUCCESS',
            returnMessage: 'OK',
            data: retryData as T,
          };

        } catch (retryError) {
          console.error('[authFetch] 재시도 실패:', retryError);
          throw retryError;
        }
      }
    }

    throw error;
  }
};

// ✅ authFetch의 결과에서 data만 추출
export const authFetchData = async <T>(
  url: string,
  data: Record<string, unknown> | FormData = {},
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET"
): Promise<T> => {
  const response: any = await authFetch<T>(url, data, method);

  // ✅ returnCode가 없는 경우 (단순 숫자/문자 등)
  if (
    typeof response !== "object" ||
    response === null ||
    !("returnCode" in response)
  ) {
    return response as T;
  }

  // ✅ 정상 API 응답에서 data 추출
  if (response.returnCode !== "SUCCESS") {
    throw new Error(response.returnMessage || "요청 실패");
  }

  return response.data;
};
