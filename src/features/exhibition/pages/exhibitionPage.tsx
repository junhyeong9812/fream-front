import '../css/exhibitionPage.css';
import React from "react";
import HomeTop from '../../common/components/top';
import Exhibition from '../components/exhibition';

const ExhibitionPage: React.FC = () => {

    return(
        <div className='exhibition_page_conatainer'>
            <HomeTop select="exhibition" />
            <Exhibition />
        </div>
    )
}

export default ExhibitionPage;