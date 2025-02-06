import '../css/rankingPage.css';
import React from "react";
import HomeTop from '../../common/components/top';
import RankingTop from '../../common/components/rankingTop';
import RankingCategory from '../components/rankingCategory';
import RankingWrap from '../../common/components/rankingWrap';

const RankingPage: React.FC = () => {

    return(
        <div className='ranking_page_conatainer'>
            <HomeTop select="ranking" />
            <RankingTop select="see" />
            <RankingCategory select="see" />
            <RankingWrap select="see" />
        </div>
    )
}

export default RankingPage;