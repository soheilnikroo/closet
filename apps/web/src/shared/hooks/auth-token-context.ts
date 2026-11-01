import { createContext, useContext } from "react";

export type GetAuthToken = () => Promise<string | null>;

const defaultGetAuthToken: GetAuthToken = async () => null;

export const AuthTokenContext = createContext<GetAuthToken>(defaultGetAuthToken);

export function useAuthToken(): GetAuthToken {
  return useContext(AuthTokenContext);
}
