import PostsRenderer from '../../components/PostsRenderer';

export default function Likes(props: { likes: any }) {
  const { likes } = props;
  return (
    <div>
      {likes ? (
        <PostsRenderer isLoading={false} feed={likes.records} />
      ) : (
        <p className="text-center p-5 text-grey">There are no likes!</p>
      )}
    </div>
  );
}
