import { FeedViewPost } from '@atproto/api/src/client/types/app/bsky/feed/defs';
import { useAtomValue } from 'jotai';
import React, { useCallback } from 'react';
import { userAtom } from '../store/user';
import Blue from './Blue/Blue';
import Loading from './Loading';

export default function PostsRenderer(props: {
  isLoading?: boolean;
  feed?: any;
  isProfile?: boolean;
  hideReplies?: boolean;
  onlyReplies?: boolean;
}) {
  const { isLoading, feed, isProfile, hideReplies, onlyReplies } = props;
  const user = useAtomValue(userAtom);

  const _sortPosts: any | FeedViewPost = useCallback(() => {
    // @ts-ignore
    return feed
      ?.reduce((p1, p2: FeedViewPost) => {
        // @ts-ignore
        const postExists = p1.find((i) => i.post.cid == p2.post.cid);
        if (p2.reply && !p2.randomness) {
          p2.randomness = Math.random();
        }

        if (
          postExists ||
          (!isProfile &&
            p2.post.author.did != user?.did &&
            p2.reply &&
            p2.reply.parent.cid == p2.reply.root.cid) ||
          (hideReplies && p2.reply) ||
          (onlyReplies && !p2.reply)
        ) {
          return [...p1];
        }
        return [...p1, p2];
      }, [])
      .filter(
        (value: any, index: number, self: any[]) =>
          index ===
          self.findIndex(
            (p) =>
              p.post.cid == value.post.cid ||
              p.reply?.root.cid == value.post.cid ||
              p.reply?.parent.cid == value.post.cid ||
              (p.reply?.root.cid == value.reply?.root.cid &&
                p.reply?.parent.cid != value.reply?.parent.cid)
          )
      );
  }, [feed]);

  return isLoading || !feed ? (
    <div className="d-flex align-items-center justify-content-center p-5">
      <Loading isColored />
    </div>
  ) : feed && feed.length ? (
    _sortPosts()
      .filter((post: any) => !post?.blocked)
      .map((post: FeedViewPost, index: number) => {
        if (!!post.reply && !post.reason) {
          return (
            <React.Fragment key={index}>
              <Blue post={post.post} key={post.post.cid} isReply={true} reason={post.reason} />
            </React.Fragment>
          );
        }
        return (
          <Blue
            key={post?.post?.cid}
            post={post?.post}
            isReply={!!post.reply}
            reason={post.reason}
          />
        );
      })
  ) : (
    <p className="d-flex align-items-center justify-content-center p-5 text-grey">
      There are no posts here!
    </p>
  );
}
