export type ZumiraApiResponse<T> =
  | {
      status: "SUCCESS";
      data: T;
    }
  | {
      status: "ERROR";
      message: string;
    };
