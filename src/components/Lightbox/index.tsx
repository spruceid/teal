import cn from 'classnames';
import { useAtom } from "jotai";
import { SyntheticEvent } from "react";
import { Portal } from "react-portal";
import Slider from 'react-slick';
import { lightboxAtom } from "../../store/lightbox";
import styles from './Lightbox.module.scss';

export default function Lightbox(props: {}) {
    const [lightbox, setLightbox] = useAtom(lightboxAtom);

    const _handleClose = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLightbox(prev => ({ ...prev, show: false, isFleet: false, meta: null }))
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        lightbox.show ? <Portal>
            <div className={styles.lightbox}>
                <div className={styles.backdrop} onClick={_handleClose}></div>
                <div className={cn(styles.content, { [styles.fleetContent]: lightbox.isFleet })}>
                    {lightbox.images.length > 1 ? <Slider {...settings}>
                        {lightbox.images?.map((img, index) => <div key={index} onClick={_handleClose}>
                            <img src={(img as any).fullsize || img} alt="" />
                        </div>)}
                    </Slider> :
                        lightbox.images?.map((img, index) => <div key={index} onClick={_handleClose}>
                            <img src={(img as any).fullsize || img} alt="" />
                        </div>)
                    }
                </div>
            </div>
        </Portal> : null
    );
}