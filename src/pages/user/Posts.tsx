import Loading from '../../components/Loading';
import PostsRenderer from '../../components/PostsRenderer';

export default function Posts(props: { posts: any; hideReplies?: boolean; onlyReplies?: boolean }) {
  const { posts, hideReplies, onlyReplies } = props;

  return !posts ? (
    <div className="d-flex align-items-center justify-content-center p-5">
      <Loading isColored />
    </div>
  ) : (
    <>
      <PostsRenderer
        onlyReplies={onlyReplies}
        hideReplies={hideReplies}
        isLoading={false}
        feed={posts.feed}
        isProfile={true}
      />
    </>
  );
}
