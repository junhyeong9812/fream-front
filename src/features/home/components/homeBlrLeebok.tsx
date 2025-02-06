import '../css/homeBlrLeebok.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const HomeBlrLeebok: React.FC = () => {

    const productCategory: string = "blrLeebok";

    return(
        <div className='home_blrleebok_container'>
            <div className='home_blrleebok_title'>BLR x 리복</div>
            <div className='home_blrleebok_serve_title'>단독 선발매 드로우</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default HomeBlrLeebok;