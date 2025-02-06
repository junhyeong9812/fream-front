import '../css/womenFor.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const WomenFor: React.FC = () => {

    const productCategory: string = "womenFor";

    return(
        <div className='women_for_container'>
            <div className='women_for_title'>For Women</div>
            <div className='women_for_serve_title'>여성 추천 상품</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default WomenFor;