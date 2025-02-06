import '../css/rankingBrandPage.css';
import React from 'react';
import HomeTop from '../../common/components/top';
import RankingTop from '../../common/components/rankingTop';
import RankingCategory from '../components/rankingCategory';
import RankingBrand from '../components/rankingBrand';

const RankingBrandPage: React.FC = () => {
    
    return(
        <div className='ranking_brand_page_container'>
            <HomeTop select="ranking" />
            <RankingTop select="brand" />
            <RankingCategory select='brand' />
            <RankingBrand />
        </div>
    )
}

export default RankingBrandPage;