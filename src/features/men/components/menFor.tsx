import '../css/menFor.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const MenFor: React.FC = () => {

    const productCategory: string = "menFor";

    return(
        <div className='men_for_container'>
            <div className='men_for_title'>For Men</div>
            <div className='men_for_serve_title'>남성 추천 상품</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default MenFor;