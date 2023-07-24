import { FeedViewPost, PostView } from '@atproto/api/src/client/types/app/bsky/feed/defs';
import RepostFillIcon from '../../assets/repost-fill.svg';
import RepostIcon from '../../assets/repost.svg';
import styles from './Blue.module.scss';

export default function Repost(props: {
    post: FeedViewPost | PostView
}) {
    const { post } = props;

    return (
        <div className={styles.repost}>
            <div className={styles.icon}>
                <img src={(post.viewer as any)?.repost ? RepostFillIcon : RepostIcon} alt="" />
            </div>
            {// @ts-ignore
                post.repostCount > 0 ? <span>{post.repostCount}</span> : ''}
        </div>
    );
}