import '../css/luxuryCheap.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const LuxuryCheap: React.FC = () => {

    const productCategory: string = "luxuryCheap";

    return(
        <div className='luxury_cheap_container'>
            <div className='luxury_cheap_title'>정가보다 저렵하게</div>
            <div className='luxury_cheap_serve_title'>럭셔리도 크더싼!</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default LuxuryCheap;