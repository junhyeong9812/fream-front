import '../css/menSneakers.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const MenSneakers: React.FC = () => {

    const productCategory: string = "menSneakers";

    return(
        <div className='men_sneakers_container'>
            <div className='men_sneakers_title'>Rising Sneakers</div>
            <div className='men_sneakers_serve_title'>인기 상승 스니커즈</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default MenSneakers;