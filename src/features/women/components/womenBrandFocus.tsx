import '../css/womenBrandFocus.css';
import React from 'react';
import ShortcutItemWrap from '../../common/components/shortcutItemWrap';
import { ShortcutItems } from '../types/womenTypes';

const WomenBrandFocus: React.FC = () => {

    const itemList: ShortcutItems[] = [
        {img: `${process.env.PUBLIC_URL}/womenImg/brandfocus/brandfocus1.webp`, name: "아디다스"},
        {img: `${process.env.PUBLIC_URL}/womenImg/brandfocus/brandfocus2.webp`, name: "아식스"},
        {img: `${process.env.PUBLIC_URL}/womenImg/brandfocus/brandfocus3.webp`, name: "나이키"},
        {img: `${process.env.PUBLIC_URL}/womenImg/brandfocus/brandfocus4.webp`, name: "어그"},
        {img: `${process.env.PUBLIC_URL}/womenImg/brandfocus/brandfocus5.webp`, name: "살로몬"},
        {img: `${process.env.PUBLIC_URL}/womenImg/brandfocus/brandfocus6.webp`, name: "뉴발란스"},
        {img: `${process.env.PUBLIC_URL}/womenImg/brandfocus/brandfocus7.webp`, name: "스투시"},
        {img: `${process.env.PUBLIC_URL}/womenImg/brandfocus/brandfocus8.webp`, name: "아이앱 스튜디오"},
        {img: `${process.env.PUBLIC_URL}/womenImg/brandfocus/brandfocus9.webp`, name: "마뗑킴"},
        {img: `${process.env.PUBLIC_URL}/womenImg/brandfocus/brandfocus10.webp`, name: "크롬하츠"},
        {img: `${process.env.PUBLIC_URL}/womenImg/brandfocus/brandfocus11.webp`, name: "비비안 웨스트우드"},
        {img: `${process.env.PUBLIC_URL}/womenImg/brandfocus/brandfocus12.webp`, name: "휴먼 메이드"},
        {img: `${process.env.PUBLIC_URL}/womenImg/brandfocus/brandfocus13.webp`, name: "산리오"},
        {img: `${process.env.PUBLIC_URL}/womenImg/brandfocus/brandfocus14.webp`, name: "뉴진스"},
        {img: `${process.env.PUBLIC_URL}/womenImg/brandfocus/brandfocus15.webp`, name: "폴로 랄프로렌"},
    ]

    return(
        <div className='women_brand_focus_container'>
            <div className='women_brand_focus_title'>Brand Focus</div>
            <div className='women_brand_focus_serve_title'>인기 여성 브랜드</div>
            <ShortcutItemWrap shortcutList = {itemList} />
        </div>
    )
}

export default WomenBrandFocus;