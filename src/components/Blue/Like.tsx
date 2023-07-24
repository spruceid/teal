import { FeedViewPost, PostView } from '@atproto/api/src/client/types/app/bsky/feed/defs';
import HeartFillIcon from '../../assets/like-fill.svg';
import HeartIcon from '../../assets/like.svg';
import styles from './Blue.module.scss';

export default function Like(props: {
    post: PostView | FeedViewPost
}) {
    const { post } = props;

    return (
        <div>
            <div className={styles.icon}>
                <img src={(post.viewer as any)?.like ? HeartFillIcon : HeartIcon} alt="" />
            </div>
            {post.likeCount as number ? <span>{post.likeCount as number}</span> : ''}
        </div>
    );
}