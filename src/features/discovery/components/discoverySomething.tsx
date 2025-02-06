import '../css/discoverySomething.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const DiscoverySomething: React.FC = () => {

    const productCategory: string = "discoverySomething";

    return(
        <div className='discovery_something_container'>
            <div className='discovery_something_title'>Something Else</div>
            <div className='discovery_something_serve_title'>새로움을 발견해 보세요</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default DiscoverySomething;