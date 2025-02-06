import '../css/homeNewIn.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const HomeNewIn: React.FC = () => {

    const productCategory: string = "newIn";

    return(
        <div className='home_new_in_container'>
            <div className='home_new_in_title'>New In</div>
            <div className='home_new_in_serve_title'>신규 등록 상품</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default HomeNewIn;