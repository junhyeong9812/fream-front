import '../css/discoveryRoughneck.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const DiscoveryRoughneck: React.FC = () => {

    const productCategory: string = "discoveryRoughneck";

    return(
        <div className='discovery_roughneck_container'>
            <div className='discovery_roughneck_title'>Roughneck</div>
            <div className='discovery_roughneck_serve_title'>러프넥</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default DiscoveryRoughneck;