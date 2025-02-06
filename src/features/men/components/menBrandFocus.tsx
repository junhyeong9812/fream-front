import '../css/menBrandFocus.css';
import React from 'react';
import ShortcutItemWrap from '../../common/components/shortcutItemWrap';
import { ShortcutItems } from '../types/menTypes';

const MenBrandFocus: React.FC = () => {

    const itemList: ShortcutItems[] = [
        {img: `${process.env.PUBLIC_URL}/menImg/brandfocus/brandfocus1.webp`, name: "나이키"},
        {img: `${process.env.PUBLIC_URL}/menImg/brandfocus/brandfocus2.webp`, name: "아디다스"},
        {img: `${process.env.PUBLIC_URL}/menImg/brandfocus/brandfocus3.webp`, name: "슈프림"},
        {img: `${process.env.PUBLIC_URL}/menImg/brandfocus/brandfocus4.webp`, name: "스투시"},
        {img: `${process.env.PUBLIC_URL}/menImg/brandfocus/brandfocus5.webp`, name: "아식스"},
        {img: `${process.env.PUBLIC_URL}/menImg/brandfocus/brandfocus6.webp`, name: "뉴발란스"},
        {img: `${process.env.PUBLIC_URL}/menImg/brandfocus/brandfocus7.webp`, name: "우영미"},
        {img: `${process.env.PUBLIC_URL}/menImg/brandfocus/brandfocus8.webp`, name: "베이프"},
        {img: `${process.env.PUBLIC_URL}/menImg/brandfocus/brandfocus9.webp`, name: "아크테릭스"},
        {img: `${process.env.PUBLIC_URL}/menImg/brandfocus/brandfocus10.webp`, name: "폴로 랄프로렌"},
        {img: `${process.env.PUBLIC_URL}/menImg/brandfocus/brandfocus11.webp`, name: "휴먼 메이드"},
        {img: `${process.env.PUBLIC_URL}/menImg/brandfocus/brandfocus12.webp`, name: "아이앱 스튜디오"},
        {img: `${process.env.PUBLIC_URL}/menImg/brandfocus/brandfocus13.webp`, name: "크롬하츠"},
        {img: `${process.env.PUBLIC_URL}/menImg/brandfocus/brandfocus14.webp`, name: "아더에러"},
        {img: `${process.env.PUBLIC_URL}/menImg/brandfocus/brandfocus15.webp`, name: "데우스 엑스 마키나"},
    ]

    return(
        <div className='men_brand_focus_container'>
            <div className='men_brand_focus_title'>Brand Focus</div>
            <div className='men_brand_focus_serve_title'>인기 남성 브랜드</div>
            <ShortcutItemWrap shortcutList = {itemList} />
        </div>
    )
}

export default MenBrandFocus;