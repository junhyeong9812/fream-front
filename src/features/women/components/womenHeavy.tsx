import '../css/womenHeavy.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const WomenHeavy: React.FC = () => {

    const productCategory: string = "womenHeavy";

    return(
        <div className='women_heavy_container'>
            <div className='women_heavy_title'>Heavy Outer</div>
            <div className='women_heavy_serve_title'>트렌디한 패딩 모아보기</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default WomenHeavy;