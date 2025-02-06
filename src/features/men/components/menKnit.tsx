import '../css/menKnit.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const MenKnit: React.FC = () => {

    const productCategory: string = "menKnit";

    return(
        <div className='men_knit_container'>
            <div className='men_knit_title'>인기 니트 몰아보기</div>
            <div className='men_knit_serve_title'>겨울 패션의 기본 아이템!</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default MenKnit;