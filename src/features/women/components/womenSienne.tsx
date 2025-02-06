import '../css/womenSienne.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const WomenSienne: React.FC = () => {

    const productCategory: string = "womenSienne";

    return(
        <div className='women_sienne_container'>
            <div className='women_sienne_title'>시엔느</div>
            <div className='women_sienne_serve_title'>독보적인 무드의 시엔느 겨울</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default WomenSienne;