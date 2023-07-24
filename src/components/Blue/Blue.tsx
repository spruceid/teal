import { AppBskyActorProfile } from '@atproto/api';
import {
  FeedViewPost,
  PostView,
  ReasonRepost
} from '@atproto/api/src/client/types/app/bsky/feed/defs';
import { ReasonType } from '@atproto/api/src/client/types/com/atproto/moderation/defs';
import cn from 'classnames';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AvatarPlaceholder from '../../assets/placeholder.png';
import RepostIcon from '../../assets/repost.svg';
import fromNow from '../../utils/fromNow';
import linkFromPost from '../../utils/linkFromPost';
import styles from './Blue.module.scss';
import Comments from './Comments';
import Like from './Like';
import Repost from './Repost';

export default function Blue(props: {
  post: FeedViewPost | PostView;
  isReply?: boolean;
  isParent?: boolean;
  isSingle?: boolean;
  reason?: ReasonType | any;
  className?: string;
}) {
  const { post, isReply, isParent, isSingle, reason, className } = props;
  const elementRef = useRef<any>(null);

  const navigate = useNavigate();
  const author = post?.author as AppBskyActorProfile.Record;

  const _handleSingleScroll = () => {
    if (!isSingle) return;
    (elementRef.current as HTMLElement).scrollIntoView({
      behavior: 'auto',
      inline: 'start'
    });
  };

  useEffect(() => {
    _handleSingleScroll();
  }, []);

  const _handleClick = (e: any, isMouseDown: any = null) => {
    if (e.button == 0 && e.target != elementRef.current && isMouseDown) return;
    if (e.target.tagName != 'A' && e.target.tagName != 'IMG') {
      if (isSingle) {
        return e.preventDefault();
      }
      if (e.ctrlKey || e.button == 1) {
        window.open('/#' + linkFromPost(post), '_blank');
      } else {
        navigate(linkFromPost(post));
      }
    }
  };

  return !post ? (
    <p>Not Found</p>
  ) : (
    <>
      <div
        ref={elementRef}
        className={cn(styles.blue, className, {
          [styles.isReply]: isReply,
          [styles.parent]: isParent,
          [styles.single]: isSingle
        })}
        onClick={_handleClick}
        onMouseDown={(e) => _handleClick(e, true)}
      >
        {reason ? (
          <div className={styles.reasonRepost}>
            <div>
              <img src={RepostIcon} alt="Repost" />
              Reposted By {(reason as ReasonRepost).by.displayName}
            </div>
          </div>
        ) : (
          ''
        )}
        <div className={styles.avatar}>
          <img src={author.avatar || (AvatarPlaceholder as any)} />
        </div>
        <div className={styles.body}>
          <div className={styles.header}>
            <div>
              <strong>{author.displayName}</strong>
              <span>@{author.handle as string}</span>
            </div>
            {post.indexedAt ? <span>{fromNow(new Date(post.indexedAt as string))}</span> : ''}
          </div>
          <div dir="auto" style={{ whiteSpace: 'pre-wrap' }}>
            {/* <p dir="auto"> */}
            <p>{(post?.record as any)?.text}</p>
          </div>
          {/* </p> */}
          <>
            <div className={styles.footer}>
              <Comments post={post} />
              <Repost post={post} />
              <Like post={post} />
            </div>
          </>
        </div>
      </div>
    </>
  );
}
