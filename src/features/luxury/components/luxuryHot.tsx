import '../css/luxuryHot.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const LuxuryHot: React.FC = () => {

    const productCategory: string = "luxuryHot";

    return(
        <div className='luxury_hot_container'>
            <div className='luxury_hot_title'>Hot Luxury</div>
            <div className='luxury_hot_serve_title'>지금 가장 핫한 럭셔리</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default LuxuryHot;