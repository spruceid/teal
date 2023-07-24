import cn from 'classnames';
import { useAtom, useAtomValue } from 'jotai';
import AvatarPlaceholder from '../../assets/placeholder.png';
import { newAtom } from '../../store/new';
import { userAtom } from '../../store/user';
import Blue from '../Blue/Blue';
import styles from './New.module.scss';

export default function NewModal(props: {}) {
  const user: any = useAtomValue(userAtom);
  const [newModal, setNewModal] = useAtom(newAtom);
  const isQuote = newModal.quotePost;

  return (
    <div className={styles.modal}>
      <div
        className={styles.backdrop}
        onClick={() => setNewModal({ show: false, cid: null, post: null })}
      ></div>
      <div className={styles.wrapper}>
        <div className={styles.postWrapper}>
          {newModal.quotePost ? (
            ''
          ) : (
            <Blue isParent={true} post={newModal.post as any} className={styles.post} />
          )}
        </div>
        <div className={cn(styles.modalWrapper, { [styles.quoteWrapper]: isQuote })}>
          <div className={styles.left}>
            <div className={styles.avatar}>
              <img src={user?.avatar || AvatarPlaceholder} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
