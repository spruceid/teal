import cn from 'classnames';
import AvatarPlaceholder from '../../assets/placeholder.png';
import styles from './Right.module.scss';

export default function User(props: {
  user: any;
  hideFollowIndicator?: boolean;
  className?: string;
}) {
  const { user, hideFollowIndicator, className } = props;
  console.log('right is beign called');

  return (
    <div className={cn('user', styles.user, className)}>
      <div className={styles.avatar}>
        <img src={user.avatar || AvatarPlaceholder} alt="" />
      </div>
      <div className={styles.userRight}>
        <p className="font-weight-bold">{user.displayName}</p>
        <span>@{user.handle}</span>
        {user.viewer.followedBy && !hideFollowIndicator ? (
          <span className={styles.tag}>Follows You</span>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
