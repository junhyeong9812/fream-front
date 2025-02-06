import '../css/womenPage.css';
import React from 'react';
import HomeTop from '../../common/components/top';
import WomenItem from '../components/womenItem';
import WomenFor from '../components/womenFor';
import WomenRising from '../components/womenRising';
import WomenArrivals from '../components/womenArrivals';
import WomenBrandFocus from '../components/womenBrandFocus';
import WomenAdvertisement from '../components/womenAdvertisement';
import WomenRocci from '../components/womenRocci';
import WomenWish from '../components/womenWish';
import WomenBeauty from '../components/womenBeauty';
import WomenCute from '../components/womenCute';
import WomenPinkBrown from '../components/womenPinkBrown';
import WomenHeavy from '../components/womenHeavy';
import WomenSienne from '../components/womenSienne';
import WomenPopular from '../components/womenPopular';

const WomenPage: React.FC = () => {

    return(
        <div className='women_page_container'>
            <HomeTop select='women' />
            <WomenItem />
            <WomenFor />
            <WomenRising />
            <WomenArrivals />
            <WomenBrandFocus />
            <WomenAdvertisement num={1} />
            <WomenRocci />
            <WomenAdvertisement num={2} />
            <WomenWish />
            <WomenAdvertisement num={3} />
            <WomenBeauty />
            <WomenAdvertisement num={4} />
            <WomenCute />
            <WomenAdvertisement num={5} />
            <WomenPinkBrown />
            <WomenAdvertisement num={6} />
            <WomenHeavy />
            <WomenAdvertisement num={7} />
            <WomenSienne />
            <WomenPopular />
        </div>
    )
}

export default WomenPage;