import {
  apiErrorSchema,
  healthResponseSchema,
  meResponseSchema,
  type HealthResponse,
  type MeResponse,
} from "@closet/shared";

export type ApiClientOptions = {
  baseUrl: string;
  getToken: () => Promise<string | null>;
  fetchImpl?: typeof fetch;
};

export type ApiClient = {
  getHealth: () => Promise<HealthResponse>;
  getMe: () => Promise<MeResponse>;
};

export function createApiClient(options: ApiClientOptions): ApiClient {
  const fetchImpl = options.fetchImpl ?? fetch;

  async function request<T>(
    path: string,
    init: RequestInit,
    parse: (data: unknown) => T,
    authenticated: boolean,
  ): Promise<T> {
    const headers = new Headers(init.headers);

    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }

    if (authenticated) {
      const token = await options.getToken();
      if (!token) {
        throw new Error("Authentication token is required");
      }
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetchImpl(`${options.baseUrl}${path}`, {
      ...init,
      headers,
    });

    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const parsedError = apiErrorSchema.safeParse(payload);
      if (parsedError.success) {
        throw new Error(parsedError.data.error.message);
      }
      throw new Error(`Request failed with status ${response.status}`);
    }

    return parse(payload);
  }

  return {
    getHealth() {
      return request(
        "/health",
        { method: "GET" },
        (data) => {
          return healthResponseSchema.parse(data);
        },
        false,
      );
    },
    getMe() {
      return request(
        "/v1/users/me",
        { method: "GET" },
        (data) => {
          return meResponseSchema.parse(data);
        },
        true,
      );
    },
  };
}

export function buildAuthHeader(token: string | null): HeadersInit {
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}
