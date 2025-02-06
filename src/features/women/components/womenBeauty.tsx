import '../css/womenBeauty.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const WomenBeauty: React.FC = () => {

    const productCategory: string = "womenBeauty";

    return(
        <div className='women_beauty_container'>
            <div className='women_beauty_title'>Beauty Collection</div>
            <div className='women_beauty_serve_title'>뷰티 아이템도 KREAM</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default WomenBeauty;