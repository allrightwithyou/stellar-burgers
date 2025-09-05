export type TAppHeaderUIProps = {
  userName: string | undefined;
  pathname: string;
  onConstructorClick?: () => void;
  onFeedClick?: () => void;
  onProfileClick?: () => void;
  onLogoClick?: () => void;
};
