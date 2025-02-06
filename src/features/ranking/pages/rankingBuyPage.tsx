import '../css/rankingBuyPage.css';
import React from 'react';
import HomeTop from '../../common/components/top';
import RankingTop from '../../common/components/rankingTop';
import RankingCategory from '../components/rankingCategory';
import RankingWrap from '../../common/components/rankingWrap';

const RankingBuyPage: React.FC = () => {
    
    return(
        <div className='ranking_buy_page_container'>
            <HomeTop select="ranking" />
            <RankingTop select="buy" />
            <RankingCategory select='buy' />
            <RankingWrap select='buy' />
        </div>
    )
}

export default RankingBuyPage;