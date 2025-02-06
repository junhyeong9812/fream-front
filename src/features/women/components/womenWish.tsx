import '../css/womenWish.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const WomenWish: React.FC = () => {

    const productCategory: string = "womenWish";

    return(
        <div className='women_wish_container'>
            <div className='women_wish_title'>20대 여성 위시리스트 랭킹</div>
            <div className='women_wish_serve_title'>지금 주목해야 하는 아이템</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default WomenWish;