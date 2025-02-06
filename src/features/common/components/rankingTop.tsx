import '../css/rankingTop.css';
import React from 'react';
import { rankingTopProps } from '../types/commonTypes';
import { useNavigate } from 'react-router-dom';

const RankingTop: React.FC<rankingTopProps> = ({select}) => {
    const navigate = useNavigate();

    return(
        <div className='ranking_top_container'>
            <div onClick={() => {navigate('/ranking')}} className='ranking_top_see_content'>
                <div className={`ranking_top_img_content ${select === "see" ? "active" : ""}`}>
                    <img className='ranking_top_img' src={`${process.env.PUBLIC_URL}/rankingImg/top/top1.webp`} />
                </div>
                <p className={`ranking_top_text ${select === "see" ? "active" : ""}`}>많이 본 상품</p>
            </div>
            <div onClick={() => {navigate('/ranking/buy')}} className='ranking_top_buy_content'>
                <div className={`ranking_top_img_content ${select === "buy" ? "active" : ""}`}>
                    <img className='ranking_top_img' src={`${process.env.PUBLIC_URL}/rankingImg/top/top2.webp`} />
                </div>
                <p className={`ranking_top_text ${select === "buy" ? "active" : ""}`}>많이 산 상품</p>
            </div>
            <div onClick={() => {navigate('/ranking/brand')}} className='ranking_top_brand_content'>
                <div className={`ranking_top_img_content ${select === "brand" ? "active" : ""}`}>
                    <img className='ranking_top_img' src={`${process.env.PUBLIC_URL}/rankingImg/top/top3.webp`} />
                </div>
                <p className={`ranking_top_text ${select === "brand" ? "active" : ""}`}>인기 브랜드</p>
            </div>
        </div>
    )
}

export default RankingTop;