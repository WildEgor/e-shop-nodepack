import axios from 'axios';

export class ErrorUtils {

  public static errorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    if ('string' === typeof error) {
      return error;
    }
    return JSON.stringify(error);
  }

}
