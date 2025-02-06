import '../css/menLight.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const MenLight: React.FC = () => {

    const productCategory: string = "menLight";

    return(
        <div className='men_light_container'>
            <div className='men_light_title'>라이트 다운 자켓은 KREAM에서</div>
            <div className='men_light_serve_title'>이번 겨울, 가볍게 대비!</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default MenLight;