import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import agent from '../../Agent';
import Loading from '../../components/Loading';
import Image from './Media/Image';

export default function Media(props: { user: any }) {
  const { user } = props;
  const params = useParams();
  const { did } = params;
  const { data, isLoading } = useQuery(['listBlobs', did], () => _fetchBlobList(), {
    cacheTime: Infinity,
    staleTime: Infinity,
    refetchOnWindowFocus: false
  });

  const _fetchBlobList = async () => {
    const blobs = await agent.com.atproto.sync.listBlobs({
      did: user?.did!
    });
    return blobs.data.cids;
  };

  return isLoading ? (
    <div className="d-flex align-items-center justify-content-center p-5">
      <Loading isColored />
    </div>
  ) : (
    <>
      <div className="media-page">
        {data?.length ? (
          <div className="medias">
            {data.map((i, index) => (
              <Image key={i} cid={i} user={user} />
            ))}
          </div>
        ) : (
          <p className="text-center p-5 text-grey">There are no images!</p>
        )}
      </div>
      {/* {hasNextPage ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> : ''} */}
    </>
  );
}
