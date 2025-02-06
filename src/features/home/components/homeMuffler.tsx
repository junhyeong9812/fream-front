import '../css/homeMuffler.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const HomeMuffler: React.FC = () => {

    const productCategory: string = "muffler";

    return(
        <div className='home_muffler_container'>
            <div className='home_muffler_title'>모헤어 목도리로 포근함 UP</div>
            <div className='home_muffler_serve_title'>지금 가장 핫한 목도리</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default HomeMuffler;