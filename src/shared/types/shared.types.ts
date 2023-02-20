export enum RequestMethod {
  Delete = 'DELETE',
  Get = 'GET',
  Patch = 'PATCH',
  Put = 'PUT',
}

export enum SidebarTabType {
  Collections = 'COLLECTIONS',
  Playlists = 'PLAYLISTS',
}

export enum Theme {
  Dark = 'Dark',
  Light = 'Light',
}

export interface MenuItem<T> {
  action: T;
  disabled?: boolean;
  title: string;
  tooltip?: string;
}
