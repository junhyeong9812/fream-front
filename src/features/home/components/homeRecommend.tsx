import '../css/homeRecommend.css';
import React from 'react';
import ProductLoadingWrap from '../../common/components/productLoadingWrap';

const HomeRecommend: React.FC = () => {

    return(
        <div className='home_recommend_container'>
            <div className='home_recommend_title'>회원님을 위한 추천 상품</div>
            <ProductLoadingWrap select="home" />
        </div>
    )
}

export default HomeRecommend;