import '../css/homeTopPicks.css';
import React from 'react';
import ShortcutItemWrap from '../../common/components/shortcutItemWrap';
import { ShortcutItems } from '../types/homeTypes';

const HomeTopPicks: React.FC = () => {

    const topPickList: ShortcutItems[] = [
        {img: `${process.env.PUBLIC_URL}/mainImg/toppick/toppick1.webp`, name: "패딩 3대장"},
        {img: `${process.env.PUBLIC_URL}/mainImg/toppick/toppick2.webp`, name: "스캇 vs 니고"},
        {img: `${process.env.PUBLIC_URL}/mainImg/toppick/toppick3.webp`, name: "10만원 이하 인기템"},
        {img: `${process.env.PUBLIC_URL}/mainImg/toppick/toppick4.webp`, name: "숨은 맛집템"},
        {img: `${process.env.PUBLIC_URL}/mainImg/toppick/toppick5.webp`, name: "연말 세일 페스타"},
        {img: `${process.env.PUBLIC_URL}/mainImg/toppick/toppick6.webp`, name: "럭셔리 부티크"},
        {img: `${process.env.PUBLIC_URL}/mainImg/toppick/toppick7.webp`, name: "파르벵 24윈터"},
        {img: `${process.env.PUBLIC_URL}/mainImg/toppick/toppick8.webp`, name: "럭셔리 X-MAS"},
        {img: `${process.env.PUBLIC_URL}/mainImg/toppick/toppick9.webp`, name: "실시간 판매 추천"},
        {img: `${process.env.PUBLIC_URL}/mainImg/toppick/toppick10.webp`, name: "더 폰 알아보기"},
    ]

    return(
        <div className='home_top_pick_container'>
            <div className='home_top_pick_title'>Top Picks!</div>
            <div className='home_top_pick_serve_title'>추천 기획전</div>
            <ShortcutItemWrap shortcutList = {topPickList} />
        </div>
    )
}

export default HomeTopPicks;