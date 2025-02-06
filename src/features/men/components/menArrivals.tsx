import '../css/menArrivals.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const MenArrivals: React.FC = () => {

    const productCategory: string = "menArrivals";

    return(
        <div className='men_arrivals_container'>
            <div className='men_arrivals_title'>New Arrivals</div>
            <div className='men_arrivals_serve_title'>신규 등록 남성 상품</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default MenArrivals;