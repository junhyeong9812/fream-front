import '../css/exhibition.css';
import React, { useEffect, useState } from 'react';
import { fetchExhibitionData } from '../services/exhibitionService';
import { exhibitionData } from '../data/exhibitionDummyData';
import { ExhibitioinInfo } from '../types/exhibitionTypes';

const Exhibition: React.FC = () => {

    const [exhibitionList, setExhibitionList] = useState<ExhibitioinInfo[]>([]);

    useEffect(() => {
        handleJustDropped();
    }, [])

    // exhibition 정보
    async function handleJustDropped() {
        const productData = await fetchExhibitionData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setExhibitionList(exhibitionData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setExhibitionList(productData);
        }
    }    

    return(
        <div className='exhibition_container'>
            {exhibitionList.map((item, index) => (
                <div className='exhibition_content'>
                    <img src={item.img} className='exhibition_img' />
                    <p className='exhibition_title'>{item.title}</p>
                    <p className='exhibition_serve_title'>{item.serveTitle}</p>
                </div>
            ))}
        </div>
    )
}

export default Exhibition;