import '../css/luxurySmall.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const LuxurySmall: React.FC = () => {

    const productCategory: string = "luxurySmall";

    return(
        <div className='luxury_small_container'>
            <div className='luxury_small_title'>Small Luxury Items</div>
            <div className='luxury_small_serve_title'>가방 속 빛나는 아이템</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default LuxurySmall;