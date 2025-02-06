import '../css/womenRocci.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const WomenRocci: React.FC = () => {

    const productCategory: string = "womenRocci";

    return(
        <div className='women_rocci_container'>
            <div className='women_rocci_title'>ROCCI ROCCI 24FW 발매</div>
            <div className='women_rocci_serve_title'>~30% 할인ㅣ10% 쿠폰</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default WomenRocci;