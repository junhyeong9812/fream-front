import '../css/ranking.css';
import React from 'react';
import { rankingProps } from '../types/commonTypes';
import { PiBookmarkSimpleThin } from "react-icons/pi";

const Ranking: React.FC<rankingProps> = ({ranking, rank}) => {

    return(
        <div className='ranking_container'>
            {ranking.transaction === "0" ? 
                <></>
                :
                <div className='ranking_transaction'>거래 {ranking.transaction}</div>
            }
            <div className='ranking_bookmark'><PiBookmarkSimpleThin /></div>
            <img className='ranking_img'  style={{backgroundColor:ranking.backgroundcolor}} src={ranking.img}></img>
            <div style={{display:"flex", alignItems:"center"}}>
                <p className='ranking_rank'>{rank}</p>
                {ranking.polarity ? 
                    <div className='ranking_porarity'>▲{ranking.porarityNum}</div>
                :
                    <div className='ranking_none_porarity'>▼{ranking.porarityNum}</div>
                }
            </div>
            <p className='ranking_name'>{ranking.name}</p>
            <p className='ranking_price'>{ranking.price}원</p>
        </div>
    )
}

export default Ranking;