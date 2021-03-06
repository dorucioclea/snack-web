import * as React from 'react';
import { StyleSheet, css } from 'aphrodite';
import Button from './shared/Button';
import ToolbarShell from './Shell/ToolbarShell';
import ToolbarTitleShell from './Shell/ToolbarTitleShell';
import IconButton from './shared/IconButton';
import EditorTitle from './EditorTitle';
import EditorImportTitle from './EditorImportTitle';
import SearchButton from './Search/SearchButton';
import UserMenu from './UserMenu';
import ModalAuthentication from './Auth/ModalAuthentication';
import { SaveStatus, SaveHistory, Viewer } from '../types';
import usePreferences from './Preferences/usePreferences';

type Props = {
  name: string;
  description: string;
  createdAt: string | undefined;
  saveStatus: SaveStatus;
  saveHistory: SaveHistory;
  viewer: Viewer | undefined;
  isDownloading: boolean;
  isResolving: boolean;
  isAuthModalVisible: boolean;
  isEditModalVisible: boolean;
  onSubmitMetadata: (
    details: {
      name: string;
      description: string;
    },
    draft?: boolean
  ) => Promise<void>;
  onShowPreviousSaves: () => void;
  onShowEditModal: () => void;
  onDismissEditModal: () => void;
  onShowAuthModal: () => void;
  onDismissAuthModal: () => void;
  onShowEmbedCode: () => void;
  onDownloadCode: () => Promise<void>;
  onShowQRCode: () => void;
  onPublishAsync: () => Promise<void>;
  creatorUsername?: string;
};

export default function EditorToolbar(props: Props) {
  const [isLoggingIn, setIsLoggingIn] = React.useState<boolean>(false);
  const [preferences] = usePreferences();

  const {
    name,
    description,
    createdAt,
    saveHistory,
    saveStatus,
    viewer,
    isDownloading,
    isResolving,
    isEditModalVisible,
    isAuthModalVisible,
    onSubmitMetadata,
    onShowPreviousSaves,
    onShowEditModal,
    onDismissEditModal,
    onShowAuthModal,
    onDismissAuthModal,
    onShowEmbedCode,
    onDownloadCode,
    onShowQRCode,
    onPublishAsync,
    creatorUsername,
  } = props;
  const { theme } = preferences;

  const handleShowAuthModal = () => {
    setIsLoggingIn(true);
    onShowAuthModal();
  };

  const handleDismissAuthModal = () => {
    setIsLoggingIn(false);
    onDismissAuthModal();
  };

  const isPublishing = saveStatus === 'publishing';
  const isPublished = saveStatus === 'published';

  return (
    <ToolbarShell>
      <ToolbarTitleShell>
        <img
          src={
            theme === 'dark'
              ? require('../assets/snack-icon-dark.svg')
              : require('../assets/snack-icon.svg')
          }
          alt="Snack"
          className={css(styles.logo)}
        />
        {creatorUsername !== 'git' || !name || !description ? (
          <EditorTitle
            name={name}
            description={description}
            createdAt={createdAt}
            saveHistory={saveHistory}
            saveStatus={saveStatus}
            viewer={viewer}
            onLogInClick={handleShowAuthModal}
            isEditModalVisible={isEditModalVisible}
            onSubmitMetadata={onSubmitMetadata}
            onShowPreviousSaves={onShowPreviousSaves}
            onShowEditModal={onShowEditModal}
            onDismissEditModal={onDismissEditModal}
          />
        ) : (
          <EditorImportTitle name={name} description={description} />
        )}
      </ToolbarTitleShell>
      <div className={css(styles.buttons)}>
        <SearchButton responsive />
        <IconButton responsive title="Run on device" label="Run" onClick={onShowQRCode}>
          <svg width="16px" height="20px" viewBox="0 0 16 20">
            <polygon points="0 0 0 20 16 10" />
          </svg>
        </IconButton>
        <IconButton
          responsive
          title="Export to expo-cli"
          label="Export"
          onClick={onDownloadCode}
          disabled={isDownloading || isPublishing}>
          <svg width="24px" height="16px" viewBox="0 0 24 16">
            <g transform="translate(-5976.000000, -4236.000000)">
              <path
                transform="translate(5976.000000, 4236.000000)"
                d="M19.3501,6.05005 C18.6499,2.6001 15.6499,0 12,0 C9.1001,0 6.6001,1.6499 5.3501,4.05005 C2.3501,4.3501 0,6.8999 0,10 C0,13.2998 2.69995,16 6,16 L19,16 C21.75,16 24,13.75 24,11 C24,8.3501 21.9502,6.19995 19.3501,6.05005 L19.3501,6.05005 Z M10.4,8.6 L10.4,4.8 L13.6,4.8 L13.6,8.6 L17,8.6 L12,13.6 L7,8.6 L10.4,8.6 L10.4,8.6 Z"
              />
            </g>
          </svg>
        </IconButton>
        <IconButton responsive title="Show embed code" label="Embed" onClick={onShowEmbedCode}>
          <svg width="20px" height="18px" viewBox="0 0 20 18">
            <path
              fillRule="evenodd"
              d="M0,6.76551724 L6.02049911,1.59310345 L6.02049911,4.34482759 L1.8872549,7.77931034 L1.8872549,7.86206897 L6.02049911,11.2965517 L6.02049911,14.0482759 L0,8.87586207 L0,6.76551724 Z M8.39349376,18 L6.47504456,18 L11.6065062,0 L13.5249554,0 L8.39349376,18 Z M20,8.87586207 L13.9795009,14.0482759 L13.9795009,11.2965517 L18.1127451,7.86206897 L18.1127451,7.77931034 L13.9795009,4.34482759 L13.9795009,1.59310345 L20,6.76551724 L20,8.87586207 Z"
            />
          </svg>
        </IconButton>
        <Button
          variant="accent"
          onClick={onPublishAsync}
          disabled={isPublishing || isResolving || isPublished}
          loading={isPublishing}
          className={css(styles.saveButton)}>
          {isPublishing ? 'Saving…' : isPublished ? 'Saved' : 'Save'}
        </Button>
        <UserMenu onLogInClick={handleShowAuthModal} />
        <ModalAuthentication
          visible={isLoggingIn && isAuthModalVisible}
          onDismiss={handleDismissAuthModal}
          onComplete={handleDismissAuthModal}
        />
      </div>
    </ToolbarShell>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 36,
    height: 'auto',
    margin: '0 .5em 0 .75em',
  },

  buttons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    zIndex: 5,
  },

  saveButton: {
    minWidth: 100,
  },
});
