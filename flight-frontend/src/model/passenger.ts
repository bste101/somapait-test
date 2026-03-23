export type Gender = "Male" | "Female" | "Unknown"

export interface Passenger {
    firstName: string
    lastName: string
    gender: Gender | null
    dateOfBirth?: Date | null
    nationality: string
}

export interface UploadResponse {
  flightNo: string;
  fileName: string;
  passengers: Passenger[];
  errors: string[];
  fileObject? : File;
}