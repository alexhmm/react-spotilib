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
