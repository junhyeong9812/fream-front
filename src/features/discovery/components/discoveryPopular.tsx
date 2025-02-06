import '../css/discoveryPopular.css';
import React from 'react';
import ProductLoadingWrap from '../../common/components/productLoadingWrap';

const DiscoveryPopular: React.FC = () => {

    return(
        <div className='discovery_popular_container'>
            <div className='discovery_popular_title'>브랜드 인기상품 순위</div>
            <ProductLoadingWrap select="discovery" />
        </div>
    )
}

export default DiscoveryPopular;