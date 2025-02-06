import '../css/womenPopular.css';
import React from 'react';
import ProductLoadingWrap from '../../common/components/productLoadingWrap';

const WomenPopular: React.FC = () => {

    return(
        <div className='women_popular_container'>
            <div className='women_popular_title'>이번 주 여성 인기 상품</div>
            <ProductLoadingWrap select="women" />
        </div>
    )
}

export default WomenPopular;