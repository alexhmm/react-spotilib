import { memo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box } from '@mui/material';

// Components
import ImageFallback from '../../../../shared/components/ImageFallback/ImageFallback';

// Styles
import styles from './PlaylistEditDetails.module.scss';

// Types
import { Playlist, PlaylistUpdateRequest } from '../../playlist.types';
import {
  ImageFallbackType,
  ResultState,
} from '../../../../shared/types/shared.types';

// UI
import Icon from '../../../../shared/ui/Icon/Icon';
import Input from '../../../../shared/ui/Input/Input';
import TextButtonOutlined from '../../../../shared/ui/TextButtonOutlined/TextButtonOutlined';

type PlaylistEditDetailsProps = {
  playlist: Playlist;
  onClose: () => void;
  onSubmit: (body: PlaylistUpdateRequest) => void;
};

const PlaylistEditDetails = (props: PlaylistEditDetailsProps) => {
  const { t } = useTranslation();

  // React hook form validation schema
  const details = z.object({
    description: z.string(),
    name: z.string().min(1, {
      message: t('playlist.detail.action.edit_details.name.error').toString(),
    }),
  });

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<PlaylistUpdateRequest>({
    resolver: zodResolver(details),
  });

  // ####### //
  // EFFECTS //
  // ####### //

  // Set form values on mount
  useEffect(() => {
    reset();
    setValue('description', props.playlist.description);
    setValue('name', props.playlist.name);
    // eslint-disable-next-line
  }, [props.playlist]);

  // ######### //
  // CALLBACKS //
  // ######### //

  /**
   * Handler to edit playlist details.
   * @param body PlaylistUpdateRequest
   */
  const onEditDetails = useCallback(
    (body: PlaylistUpdateRequest) => {
      props.onSubmit({
        description:
          body.description && body.description.length > 1
            ? body.description
            : undefined,
        name: body.name,
      });
      props.onClose();
    },
    [props]
  );

  return (
    <form
      className={styles['playlist-edit-details']}
      onSubmit={handleSubmit(onEditDetails)}
    >
      {errors?.name && (
        <Box
          className={styles['playlist-edit-details-error']}
          sx={{ backgroundColor: 'error.main', color: 'white' }}
        >
          <Icon
            classes={styles['playlist-edit-details-error-icon']}
            icon={['fas', 'exclamation-triangle']}
            htmlColor="#ffffff"
          />
          {errors.name.message}
        </Box>
      )}
      <div className={styles['playlist-edit-details-form']}>
        <div className={styles['playlist-edit-details-form-cover']}>
          {props.playlist.images[0]?.url ? (
            <img
              alt={`${t('playlist.detail.title')} ${props.playlist.name}`}
              src={props.playlist.images[0].url}
            />
          ) : (
            <ImageFallback type={ImageFallbackType.Playlist} />
          )}
        </div>
        <div className={styles['playlist-edit-details-form-inputs']}>
          <Input
            classes="mb-4"
            label={t(
              'playlist.detail.action.edit_details.name.label'
            ).toString()}
            placeholder={t(
              'playlist.detail.action.edit_details.name.placeholder'
            ).toString()}
            register={register('name')}
            state={errors?.name && ResultState.Error}
          />
          <Input
            fullHeight
            label={t(
              'playlist.detail.action.edit_details.description.label'
            ).toString()}
            placeholder={t(
              'playlist.detail.action.edit_details.description.placeholder'
            ).toString()}
            multiline={6}
            register={register('description')}
          />
        </div>
      </div>
      <TextButtonOutlined
        classes={styles['playlist-edit-details-form-save']}
        type="submit"
      >
        {t('app.save.title')}
      </TextButtonOutlined>
      <div className={styles['playlist-edit-details-form-disclaimer']}>
        {t('playlist.detail.action.edit_details.disclaimer')}
      </div>
    </form>
  );
};

export default memo(PlaylistEditDetails);
