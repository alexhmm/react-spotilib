import { IconName, IconPrefix } from '@fortawesome/free-solid-svg-icons';

export enum FormType {
  Select = 'SELECT',
  Switch = 'SWITCH',
}

export enum ImageFallbackType {
  Album = 'ALBUM',
  Artist = 'ARTIST',
  Playlist = 'PLAYLIST',
  Profile = 'PROFILE',
}

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

export interface FollowingStateGetRequest {
  ids: string[];
}

export interface FormItem {
  title: string;
  value: any;
}

export interface MenuItem {
  action: any;
  disabled?: boolean;
  icon?: [IconPrefix, IconName];
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
