import '../css/luxuryWish.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const LuxuryWish: React.FC = () => {

    const productCategory: string = "luxuryWish";

    return(
        <div className='luxury_wish_container'>
            <div className='luxury_wish_title'>Best Wish Items</div>
            <div className='luxury_wish_serve_title'></div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default LuxuryWish;