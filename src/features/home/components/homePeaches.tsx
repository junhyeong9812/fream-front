import '../css/homePeaches.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const HomePeaches: React.FC = () => {

    const productCategory: string = "peaches";

    return(
        <div className='home_peaches_container'>
            <div className='home_peaches_title'>Peaches 24FW</div>
            <div className='home_peaches_serve_title'>KREAM 단독 드랍</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default HomePeaches;