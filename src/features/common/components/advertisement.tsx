import '../css/advertisement.css';
import React from 'react';
import { AdvertisementProps } from '../types/commonTypes';

const Advertisement: React.FC<AdvertisementProps> = ({ advertisement }) => {

    return(
        <div style={{backgroundColor:advertisement.backgroundcolor}} className='advertisement_container'>
            <img className='advertisement_content' src={advertisement.img} />
        </div>
    )
}

export default Advertisement;