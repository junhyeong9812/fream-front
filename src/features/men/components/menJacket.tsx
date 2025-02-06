import '../css/menJacket.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const MenJacket: React.FC = () => {

    const productCategory: string = "menJacket";

    return(
        <div className='men_jacket_container'>
            <div className='men_jacket_title'>포근한 플리스 자켓</div>
            <div className='men_jacket_serve_title'>추워진 날씨에 딱 맞는 아이템</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default MenJacket;