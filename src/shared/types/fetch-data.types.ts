export interface FetchDataOptions {
  body?: any;
  method?: string;
  params?: URLSearchParams;
}

export interface FetchDataParams {
  code?: string;
  grant_type?: string;
  id?: string;
  redirect_uri?: string;
}
