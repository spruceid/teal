import cn from 'classnames';
import { useAtom } from 'jotai';
import React, { useMemo, useState } from 'react';
import { Portal } from 'react-portal';
import AvatarPlaceholder from '../../assets/placeholder.png';
import Lightbox from '../../components/Lightbox';
import Loading from "../../components/Loading";
import { lightboxAtom } from '../../store/lightbox';
import Likes from './Likes';
import Media from './Media';
import Posts from './Posts';
import Stats from './Stats';
import styles from './User.module.scss';

export default function User(props: {
    user: any,
    likes: any,
    posts: any,
    media: any
}) {

    const { user, likes, posts, media } = props;
    const [lightbox, setLightbox] = useAtom<any>(lightboxAtom);
    const [tab, setTab] = useState("posts")

    const joinDate = useMemo(() => {
        const date = new Date(user?.indexedAt).toDateString().split(' ');
        return `${date[2]} ${date[1]} ${date[3]}`;
    }, [user]);

    return (
        <React.Fragment key={user?.did}>
            <div>
            { !user ? <div className="d-flex align-items-center justify-content-center p-5"><Loading isColored /></div> :
                <>
                    <div className={styles.header}>
                        {user.banner ? <div className={styles.cover} onClick={() =>
                            // @ts-ignore
                            setLightbox(() => ({ show: true, images: [user.banner] }))}>
                            <img src={user?.banner} />
                        </div> : ''}
                        <div className={cn(styles.info, { [styles.noCover]: !user?.banner })}>
                            <div className={styles.avatar} onClick={() =>
                                // @ts-ignore
                                setLightbox(() => ({ show: true, images: [user?.avatar] }))}>
                                <img src={user?.avatar || AvatarPlaceholder} alt={user?.displayName} />
                            </div>
                        </div>
                        <div>
                            <div className={cn("d-flex align-items-center", styles.nameWrapper)}>
                                <h1>{user?.displayName}</h1>
                                {user?.viewer?.followedBy ? <span className="tag">Follows You</span> : ''}
                            </div>
                            <span className="text-grey">@{user?.handle}</span>
                            <p className="text-grey">Joined at {joinDate}</p>
                            <Stats user={user} />
                        </div>
                    </div>

                    <div className={styles.tabs}>
                        <button onClick={() => {setTab('posts')}} className={cn(styles.tab, { [styles.active]: tab == 'posts' })}>Posts</button>
                        <button onClick={() => {setTab('replies')}} className={cn(styles.tab, { [styles.active]: tab == 'replies' })}>Replies</button>
                        <button onClick={() => {setTab('likes')}} className={cn(styles.tab, { [styles.active]: tab== 'likes' })}>Likes</button>
                        <button onClick={() => {setTab('media')}} className={cn(styles.tab, { [styles.active]: tab == 'media' })}>Media</button>
                    </div>
                    <div className={styles.posts}>
                        {{
                            posts: <Posts key={`posts-${user.did}`} hideReplies posts={posts} />,
                            replies: <Posts key={`replies-${user.did}`} onlyReplies posts={posts} />,
                            likes: <Likes likes={likes}/>,
                            media: <Media user={user} />,
                        }[tab]}
                    </div>
                </>
            }
            </div>
            {lightbox.show ? <Portal>
                <Lightbox />
            </Portal> : ''}
        </React.Fragment>
    );


}