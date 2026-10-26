export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

export interface RefreshTokenResponse {
  access_token?: string;
  expires_in?: number;
}
