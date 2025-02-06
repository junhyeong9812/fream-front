import '../css/womenArrivals.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const WomenArrivals: React.FC = () => {

    const productCategory: string = "womenArrivals";

    return(
        <div className='women_arrivals_container'>
            <div className='women_arrivals_title'>New Arrivals</div>
            <div className='women_arrivals_serve_title'>신규 등록 여성 상품</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default WomenArrivals;