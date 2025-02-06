import '../css/menPage.css';
import React from 'react';
import HomeTop from '../../common/components/top';
import MenItem from '../components/menItem';
import MenBrandFocus from '../components/menBrandFocus';
import MenFor from '../components/menFor';
import MenSneakers from '../components/menSneakers';
import MenArrivals from '../components/menArrivals';
import MenAdvertisement from '../components/menAdvertisement';
import MenKnit from '../components/menKnit';
import MenJacket from '../components/menJacket';
import MenLight from '../components/menLight';
import MenChoice from '../components/menChoice';
import MenPopular from '../components/menPopular';

const MenPage: React.FC = () => {

    return(
        <div className='men_page_container'>
            <HomeTop select='men' />
            <MenItem />
            <MenFor />
            <MenSneakers />
            <MenArrivals />
            <MenBrandFocus />
            <MenAdvertisement num={1} />
            <MenKnit />
            <MenAdvertisement num={2} />
            <MenJacket />
            <MenAdvertisement num={3} />
            <MenLight />
            <MenAdvertisement num={4} />
            <MenChoice />
            <MenAdvertisement num={5} />
            <MenPopular />
        </div>
    )
}

export default MenPage;