import '../css/womenCute.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const WomenCute: React.FC = () => {

    const productCategory: string = "womenCute";

    return(
        <div className='women_cute_container'>
            <div className='women_cute_title'>든든한데 귀엽기까지!</div>
            <div className='women_cute_serve_title'>덕분에 겨울이 기다려지는 방한 아이템 모아보기</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default WomenCute;