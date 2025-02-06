import '../css/homeMostPopular.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const HomeMostPopular: React.FC = () => {

    const productCategory: string = "mostPopular";

    return(
        <div className='home_most_popular_container'>
            <div className='home_most_popular_title'>Most Popular</div>
            <div className='home_most_popular_serve_title'>인기 상품</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default HomeMostPopular;