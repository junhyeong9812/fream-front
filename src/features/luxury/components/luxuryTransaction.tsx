import '../css/luxuryTransaction.css';
import React from 'react';
import ProductLoadingWrap from '../../common/components/productLoadingWrap';

const LuxuryTransaction: React.FC = () => {

    return(
        <div className='luxury_transaction_container'>
            <div className='luxury_transaction_title'>지금 많이 거래되는 럭셔리</div>
            <ProductLoadingWrap select="luxury" />
        </div>
    )
}

export default LuxuryTransaction;