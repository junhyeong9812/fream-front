import '../css/luxuryPage.css';
import React from "react";
import HomeTop from '../../common/components/top';
import Banner from '../../common/components/banner';
import LuxuryItem from '../components/luxuryItem';
import LuxuryWish from '../components/luxuryWish';
import LuxuryHot from '../components/luxuryHot';
import LuxuryCheap from '../components/luxuryCheap';
import LuxurySmall from '../components/luxurySmall';
import LuxuryTopBrand from '../components/luxuryTopBrand';
import LuxuryTransaction from '../components/luxuryTransaction';

const LuxuryPage: React.FC = () => {

    return(
        <div className='luxury_page_conatainer'>
            <HomeTop select="luxury" />
            <Banner select='luxury' />
            <LuxuryItem />
            <LuxuryWish />
            <LuxuryHot />
            <LuxuryCheap />
            <LuxurySmall />
            <LuxuryTopBrand />
            <LuxuryTransaction />
        </div>
    )
}

export default LuxuryPage;