export enum ReleaseDatePrecision {
  Day = 'day',
}

export enum SpotifyAlbumType {
  Album = 'album',
  AppearsOn = 'appears_on',
  Compilation = 'compilation',
  Single = 'single',
}

export enum SpotifyFollowType {
  Artist = 'artist',
  User = 'user',
}

export enum SpotifyItemType {
  Album = 'album',
  Artist = 'artist',
  Audiobook = 'audiobook',
  Episode = 'episode',
  Playlist = 'playlist',
  Show = 'show',
  Track = 'track',
}

export enum SpotifyMarket {
  AD = 'AD',
  AE = 'AE',
  AG = 'AG',
  AL = 'AL',
  AM = 'AM',
  AO = 'AO',
  AR = 'AR',
  AT = 'AT',
  AU = 'AU',
  AZ = 'AZ',
  BA = 'BA',
  BB = 'BB',
  BD = 'BD',
  BE = 'BE',
  BF = 'BF',
  BG = 'BG',
  BH = 'BH',
  BI = 'BI',
  BJ = 'BJ',
  BN = 'BN',
  BO = 'BO',
  BR = 'BR',
  BS = 'BS',
  BT = 'BT',
  BW = 'BW',
  BY = 'BY',
  BZ = 'BZ',
  CA = 'CA',
  CD = 'CD',
  CG = 'CG',
  CH = 'CH',
  CI = 'CI',
  CL = 'CL',
  CM = 'CM',
  CO = 'CO',
  CR = 'CR',
  CB = 'CV',
  CW = 'CW',
  CY = 'CY',
  CZ = 'CZ',
  DE = 'DE',
  DJ = 'DJ',
  DK = 'DK',
  DM = 'DM',
  DO = 'DO',
  DZ = 'DZ',
  EC = 'EC',
  EE = 'EE',
  EG = 'EG',
  ES = 'ES',
  ET = 'ET',
  FI = 'FI',
  FJ = 'FJ',
  FM = 'FM',
  FR = 'FR',
  GA = 'GA',
  GB = 'GB',
  GD = 'GD',
  GE = 'GE',
  GH = 'GH',
  GM = 'GM',
  GN = 'GN',
  GQ = 'GQ',
  GR = 'GR',
  GT = 'GT',
  GW = 'GW',
  GY = 'GY',
  HK = 'HK',
  HN = 'HN',
  HR = 'HR',
  HT = 'HT',
  HU = 'HU',
  ID = 'ID',
  IE = 'IE',
  IL = 'IL',
  IN = 'IN',
  IQ = 'IQ',
  IS = 'IS',
  IT = 'IT',
  JM = 'JM',
  JO = 'JO',
  JP = 'JP',
  KE = 'KE',
  KG = 'KG',
  KH = 'KH',
  KI = 'KI',
  KM = 'KM',
  KN = 'KN',
  KR = 'KR',
  KW = 'KW',
  KZ = 'KZ',
  LA = 'LA',
  LB = 'LB',
  LC = 'LC',
  LI = 'LI',
  LK = 'LK',
  LR = 'LR',
  LS = 'LS',
  LT = 'LT',
  LU = 'LU',
  LV = 'LV',
  LY = 'LY',
  MA = 'MA',
  MC = 'MC',
  MD = 'MD',
  ME = 'ME',
  MG = 'MG',
  MH = 'MH',
  MK = 'MK',
  ML = 'ML',
  MN = 'MN',
  MO = 'MO',
  MR = 'MR',
  MT = 'MT',
  MU = 'MU',
  MV = 'MV',
  MW = 'MW',
  MX = 'MX',
  MY = 'MY',
  MZ = 'MZ',
  NA = 'NA',
  NE = 'NE',
  NG = 'NG',
  NI = 'NI',
  NL = 'NL',
  NO = 'NO',
  NP = 'NP',
  NR = 'NR',
  NZ = 'NZ',
  OM = 'OM',
  PA = 'PA',
  PE = 'PE',
  PG = 'PG',
  PH = 'PH',
  PK = 'PK',
  PL = 'PL',
  PS = 'PS',
  PT = 'PT',
  PW = 'PW',
  PY = 'PY',
  QA = 'QA',
  RO = 'RO',
  RS = 'RS',
  RW = 'RW',
  SA = 'SA',
  SB = 'SB',
  SC = 'SC',
  SE = 'SE',
  SG = 'SG',
  SI = 'SI',
  SK = 'SK',
  SL = 'SL',
  SM = 'SM',
  SN = 'SN',
  SR = 'SR',
  ST = 'ST',
  SV = 'SV',
  SZ = 'SZ',
  TD = 'TD',
  TG = 'TG',
  TH = 'TH',
  TJ = 'TJ',
  TL = 'TL',
  TN = 'TN',
  TO = 'TO',
  TR = 'TR',
  TT = 'TT',
  TV = 'TV',
  TW = 'TW',
  TZ = 'TZ',
  UA = 'UA',
  UG = 'UG',
  US = 'US',
  UY = 'UY',
  UZ = 'UZ',
  VS = 'VC',
  VE = 'VE',
  VN = 'VN',
  VU = 'VU',
  WS = 'WS',
  XK = 'XK',
  ZA = 'ZA',
  ZM = 'ZM',
  ZW = 'ZW',
}

export enum SpotifyTopTimeRange {
  Long_Term = 'long_term',
  Medium_Term = 'medium_term',
  Short_Term = 'short_term',
}

export interface ExternalUrls {
  spotify: string;
}

export interface Followers {
  href: string;
  total: number;
}

export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface Owner {
  id: string;
  display_name: string;
  external_urls: ExternalUrls;
  href: string;
  type: string;
  uri: string;
}

export interface SpotifyAlbum {
  album_type: SpotifyAlbumType;
  artists: SpotifyArtist[];
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  label: string;
  name: string;
  release_date: string;
  release_date_precision: ReleaseDatePrecision;
  total_tracks: number;
  tracks: SpotifyDataGetResponse<SpotifyTrack[]>;
  type: SpotifyItemType;
  uri: string;
}

export interface SpotifyArtist {
  external_urls: ExternalUrls;
  followers: Followers;
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: SpotifyItemType;
  uri: string;
}

export interface SpotifyDataGetResponse<T> {
  href: string;
  items: T;
  limit: number;
  next: string;
  offset: number;
  previous: null;
  total: number;
}

export interface SpotifyPlaylist {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  primary_color: any;
  public: boolean;
  snapshot_id: string;
  tracks: SpotifyPlaylistTracks;
  type: SpotifyItemType;
  uri: string;
}

export interface SpotifyPlaylistTracks {
  href: string;
  items: SpotifyTrackMetaData[];
  total: number;
}

export interface SpotifyTrack {
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  available_markets: any[];
  disc_number: number;
  duration_ms: number;
  episode: boolean;
  explicit: boolean;
  external_ids: any;
  external_urls: any;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track: boolean;
  track_number: number;
  type: SpotifyItemType;
  uri: string;
}

export interface SpotifyTrackMetaData {
  added_at: string;
  added_by: {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  is_local: false;
  primary_color: any;
  track: SpotifyTrack;
  video_thumbnail: { url: any };
}

export interface VideoThumbnail {
  url: null;
}

export type SpotifyArtistAlbum = Omit<SpotifyAlbum, 'label' | 'track'>;
