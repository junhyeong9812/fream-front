import '../css/discoveryPdp.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const DiscoveryPdp: React.FC = () => {

    const productCategory: string = "discoveryPdp";

    return(
        <div className='discovery_pdp_container'>
            <div className='discovery_pdp_title'>Punch Drunk Parties</div>
            <div className='discovery_pdp_serve_title'>펀치드렁크파티즈</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default DiscoveryPdp;