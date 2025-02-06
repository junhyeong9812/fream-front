import '../css/homeOutdoor.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const HomeOutdoor: React.FC = () => {

    const productCategory: string = "outdoor";

    return(
        <div className='home_outdoor_container'>
            <div className='home_outdoor_title'>Heavy Outdoor Puffers</div>
            <div className='home_outdoor_serve_title'>한겨울에도 든든한 아웃도어 패딩</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default HomeOutdoor;