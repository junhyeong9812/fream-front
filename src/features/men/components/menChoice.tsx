import '../css/menChoice.css';
import React from 'react';
import ProductWrap from '../../common/components/productWrap';

const MenChoice: React.FC = () => {

    const productCategory: string = "menChoice";

    return(
        <div className='men_choice_container'>
            <div className='men_choice_title'>20's Choice!</div>
            <div className='men_choice_serve_title'>KREAM과 함께 알아보는 최신 트렌드</div>
            <ProductWrap productCategory={productCategory} />
        </div>
    )
}

export default MenChoice;