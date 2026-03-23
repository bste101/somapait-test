import axios from "axios";
import type { Passenger, UploadResponse } from "../model/passenger";
import { ENV } from "../configs/env";

export const uploadFile = async (
  flightNo: string,
  file: File,
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("flightNo", flightNo);
  formData.append("file", file);
  try {
    const response = await axios.post(
      `${ENV.API_BASE_URL}/api/passengers/upload`,
      formData,
    );

    const rawData = response.data;
    return {
      ...rawData,
      fileObject: file,
      passengers: rawData.passengers.map((p: Passenger) => ({
        ...p,
        dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth) : null,
      })),
    };
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      throw err.response.data;
    }
    throw err;
  }
};
