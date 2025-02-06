import '../css/menPopular.css';
import React from 'react';
import ProductLoadingWrap from '../../common/components/productLoadingWrap';

const MenPopular: React.FC = () => {

    return(
        <div className='men_popular_container'>
            <div className='men_popular_title'>이번 주 남성 인기 상품</div>
            <ProductLoadingWrap select="men" />
        </div>
    )
}

export default MenPopular;