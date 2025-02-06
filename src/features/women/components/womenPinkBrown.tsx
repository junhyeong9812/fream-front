import '../css/womenPinkBrown.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const WomenPinkBrown: React.FC = () => {

    const productCategory: string = "womenPinkBrown";

    return(
        <div className='women_pink_brown_container'>
            <div className='women_pink_brown_title'>Pink & Brown Shoes</div>
            <div className='women_pink_brown_serve_title'>모카무스와 핑크의 부드러운 트렌드</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default WomenPinkBrown;