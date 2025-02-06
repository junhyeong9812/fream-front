import '../css/womenRising.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const WomenRising: React.FC = () => {

    const productCategory: string = "womenRising";

    return(
        <div className='women_rising_container'>
            <div className='women_rising_title'>Rising Shoes</div>
            <div className='women_rising_serve_title'>인기 상승 슈즈</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default WomenRising;