import axios from "axios";
import { ApiResponse } from "../types/MapTypes";

const fetchPlaceInfo = async (
  placeId: string,
  token: string
): Promise<ApiResponse | null> => {
  try {
    const response = await axios.get<ApiResponse>(
      `http://localhost:3000/api/place/${placeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    return null;
  }
};

export default fetchPlaceInfo;
