import { IconName, IconPrefix } from '@fortawesome/free-solid-svg-icons';

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

export interface NavigationItem {
  pathname: string;
  title: string;
}

export interface Notification {
  timeout?: number;
  title: string;
}

export interface TabItem extends NavigationItem {
  icon: [IconPrefix, IconName];
}
