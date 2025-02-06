import '../css/discoveryMellow.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const DiscoveryMellow: React.FC = () => {

    const productCategory: string = "discoveryMellow";

    return(
        <div className='discovery_mellow_container'>
            <div className='discovery_mellow_title'>MELLOW</div>
            <div className='discovery_mellow_serve_title'>멜로우</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default DiscoveryMellow;