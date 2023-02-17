import { useTranslation } from 'react-i18next';

// Types
import { SpotifyAlbumType } from '../../shared/types/spotify.types';

const useAlbum = () => {
  const { t } = useTranslation();

  /**
   * GET Album type translation by type.
   * @param type SpotifyAlbumType
   * @returns Album type translation
   */
  const typeTranslationByTypeGet = (type: SpotifyAlbumType): string => {
    switch (type) {
      case SpotifyAlbumType.Album:
        return t('album.type.album');
      case SpotifyAlbumType.Compilation:
        return t('album.type.compilation');
      case SpotifyAlbumType.Single:
        return t('album.type.single');
      default:
        return '';
    }
  };

  return {
    typeTranslationByTypeGet,
  };
};

export default useAlbum;
