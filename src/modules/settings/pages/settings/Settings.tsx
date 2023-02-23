import { useTranslation } from 'react-i18next';

// Stores
import useThemeStore from '../../../../shared/stores/use-theme.store';

// Styles
import styles from './Settings.module.scss';

// Types
import {
  FormItem,
  FormType,
  Theme,
} from '../../../../shared/types/shared.types';

// UI
import H3 from '../../../../shared/ui/H3/H3';
import Select from '../../../../shared/ui/Select/Select';
import Switch from '../../../../shared/ui/Switch/Switch';

type SettingsFormItemProps = {
  items?: FormItem[];
  title: string;
  type: FormType;
  value: any;
  onChange: (value: any) => void;
};

const SettingsFormItem = (props: SettingsFormItemProps) => {
  return (
    <div className={styles['settings-form-item']}>
      <div className={styles['settings-form-item-title']}>{props.title}</div>
      <div className={styles['settings-form-item-action']}>
        {props.type === FormType.Select && props.items && (
          <Select
            items={props.items}
            value={props.value}
            onChange={props.onChange}
          />
        )}
        {props.type === FormType.Switch && (
          <Switch checked={props.value} onChange={props.onChange} />
        )}
      </div>
    </div>
  );
};

const Settings = () => {
  const { t, i18n } = useTranslation();

  // Theme store state
  const [theme, setTheme] = useThemeStore((state) => [
    state.theme,
    state.setTheme,
  ]);

  return (
    <div className={styles['settings']}>
      <div className={styles['settings-content']}>
        <H3>{t('app.settings.title')}</H3>
        <div className={styles['settings-form']}>
          <SettingsFormItem
            items={[
              {
                title: t('app.settings.language.english'),
                value: 'en-US',
              },
              {
                title: t('app.settings.language.german'),
                value: 'de-DE',
              },
            ]}
            type={FormType.Select}
            title={t('app.settings.language.title')}
            value={i18n.language}
            onChange={(value) => i18n.changeLanguage(value)}
          />
          <SettingsFormItem
            title={t('app.settings.theme')}
            type={FormType.Switch}
            value={theme === Theme.Dark}
            onChange={(checked) =>
              checked ? setTheme(Theme.Dark) : setTheme(Theme.Light)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
