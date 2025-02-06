import '../css/discoveryAdvertisement.css';
import React, { useEffect, useState } from 'react';
import { AdvertisementProps } from '../types/discoveryTypes';
import { AdvertisementInfo } from '../types/discoveryTypes';

const DiscoveryAdvertisement: React.FC<AdvertisementProps> = ({num}) => {

    const [advertisement, setAdvertisement] = useState<AdvertisementInfo>();

    const advertisementImg1 = `${process.env.PUBLIC_URL}/discoveryImg/advertisement/advertisement1.webp`;
    const advertisementImg2 = `${process.env.PUBLIC_URL}/discoveryImg/advertisement/advertisement2.webp`;
    
    useEffect(() => {
        if (num === 1) {
            setAdvertisement(advertisementImg1);
        }
        if (num === 2) {
            setAdvertisement(advertisementImg2);
        }
    }, [num])

    return(
        <div className='discovery_advertisement_container'>
            <img className='discovery_advertisement_content' src={advertisement} />
        </div>
    )
}

export default DiscoveryAdvertisement;