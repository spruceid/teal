import { ProfileViewDetailed } from '@atproto/api/src/client/types/app/bsky/actor/defs';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import agent, { SESSION_LOCAL_STORAGE_KEY } from '../../Agent';
import User from '../user';
import SIWE from '../SIWE';

export default function Home(props: {}) {
  const getUser = () => {
    const localData = localStorage.getItem(SESSION_LOCAL_STORAGE_KEY);
    if (localData) {
      const parsedData = JSON.parse(localData);
      return parsedData.did;
    }
    return 'error';
  };

  const did = getUser();
  const userResults = useQuery(
    ['user', did],
    () =>
      agent.getProfile({
        actor: did!
      }),
    {
      onSuccess: (d) => {
        setUser(d.data);
      },
      onError: (error) => {
        console.error(error);
      }
    }
  );

  useEffect(() => {
    return () => {
      setUser(null);
    };
  }, []);

  const postResults = useQuery(
    ['userPosts', did],
    () =>
      agent.getAuthorFeed({
        actor: did!
      }),
    {
      onSuccess: (d) => {
        setPosts(d.data);
      },
      onError: (error) => {
        console.error(error);
      }
    }
  );

  const _fetchLikes = async () => {
    const records = await agent.api.com.atproto.repo.listRecords({
      collection: 'app.bsky.feed.like',
      repo: did!,
      limit: 25
    });
    const posts = await agent.api.app.bsky.feed.getPosts({
      uris: records.data.records.map((record) => (record.value as any).subject.uri)
    });
    let newPosts = records ? [...records.data.records!] : [];
    for (let i = 0; i < posts.data.posts.length; i++) {
      const post = posts.data.posts[i];
      const indexInPostsData = newPosts.findIndex((i) => (i.value as any).subject.uri == post.uri);
      if (indexInPostsData > -1) {
        newPosts[indexInPostsData].post = post;
      }
    }
    newPosts = newPosts.filter((p) => p.post);
    return { data: { records: newPosts, cursor: records.data.cursor } };
  };

  const likesResults = useQuery(['userLikes', did], () => _fetchLikes(), {
    onSuccess: (d) => {
      setLikes(d.data);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  const mediaResults = useQuery(['listBlobs', did], () => _fetchBlobList(), {
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    onSuccess: (d) => {
      setMedia(d);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  const _fetchBlobList = async () => {
    const blobs = await agent.com.atproto.sync.listBlobs({
      did: user?.did!
    });
    return blobs.data.cids;
  };

  const [user, setUser] = useState<ProfileViewDetailed | any>(userResults?.data! || null);
  const [posts, setPosts] = useState<any>(postResults?.data! || null);
  const [likes, setLikes] = useState<any>(likesResults?.data! || null);
  const [media, setMedia] = useState<any>(mediaResults?.data! || null);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyItems: 'left' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '20rem', marginLeft: '4rem' }}>
        <Link
          to="/logout"
          style={{
            marginTop: '8rem',
            alignSelf: 'left',
            color: '#323232',
            backgroundColor: 'white',
            border: 'white',
            fontSize: '20px'
          }}
        >
          <strong>Logout</strong>
        </Link>
        <div style={{ marginTop: '2rem' }}>
          <SIWE posts={posts} likes={likes} media={media} />
        </div>
      </div>
      <div style={{ width: '60rem' }}>
        <User user={user} posts={posts} likes={likes} media={media}></User>
      </div>
    </div>
  );
}
