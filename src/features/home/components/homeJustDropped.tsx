import '../css/homeJustDropped.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const HomeJustDropped: React.FC = () => {

    const productCategory: string = "justDropped";

    return(
        <div className='home_just_dropped_container'>
            <div className='home_just_dropped_title'>Just Dropped</div>
            <div className='home_just_dropped_serve_title'>발매 상품</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default HomeJustDropped;