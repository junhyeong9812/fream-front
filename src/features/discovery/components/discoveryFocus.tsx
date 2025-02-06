import '../css/discoveryFocus.css';
import React from 'react';
import ShortcutItemWrap from '../../common/components/shortcutItemWrap';
import { ShortcutItems } from '../types/discoveryTypes';

const DiscoveryFocus: React.FC = () => {

    const topBrandList: ShortcutItems[] = [
        {img: `${process.env.PUBLIC_URL}/discoveryImg/focus/focus1.webp`, name: "에스티유"},
        {img: `${process.env.PUBLIC_URL}/discoveryImg/focus/focus2.webp`, name: "폴로랄프로렌"},
        {img: `${process.env.PUBLIC_URL}/discoveryImg/focus/focus3.webp`, name: "폴리테루 휴먼인덱스"},
        {img: `${process.env.PUBLIC_URL}/discoveryImg/focus/focus4.webp`, name: "언더마이카"},
        {img: `${process.env.PUBLIC_URL}/discoveryImg/focus/focus5.webp`, name: "파르벵"},
        {img: `${process.env.PUBLIC_URL}/discoveryImg/focus/focus6.webp`, name: "산산기어"},
        {img: `${process.env.PUBLIC_URL}/discoveryImg/focus/focus7.webp`, name: "사파리스팟"},
        {img: `${process.env.PUBLIC_URL}/discoveryImg/focus/focus8.webp`, name: "닥터마틴"},
        {img: `${process.env.PUBLIC_URL}/discoveryImg/focus/focus9.webp`, name: "소니"},
        {img: `${process.env.PUBLIC_URL}/discoveryImg/focus/focus10.webp`, name: "앤더슨벨"},
        {img: `${process.env.PUBLIC_URL}/discoveryImg/focus/focus11.webp`, name: "킨"},
        {img: `${process.env.PUBLIC_URL}/discoveryImg/focus/focus12.webp`, name: "알렌느"},
        {img: `${process.env.PUBLIC_URL}/discoveryImg/focus/focus13.webp`, name: "트루릴리젼"},
        {img: `${process.env.PUBLIC_URL}/discoveryImg/focus/focus14.webp`, name: "바스켓케이스"},
        {img: `${process.env.PUBLIC_URL}/discoveryImg/focus/focus15.webp`, name: "렉토"},
        {img: `${process.env.PUBLIC_URL}/discoveryImg/focus/focus16.webp`, name: "스웨이드"},
        {img: `${process.env.PUBLIC_URL}/discoveryImg/focus/focus17.webp`, name: "떠그클럽"},
        {img: `${process.env.PUBLIC_URL}/discoveryImg/focus/focus18.webp`, name: "던스트"},
        {img: `${process.env.PUBLIC_URL}/discoveryImg/focus/focus19.webp`, name: "더바이닐하우스"},
        {img: `${process.env.PUBLIC_URL}/discoveryImg/focus/focus20.webp`, name: "에이프"},
    ]

    return(
        <div className='discovery_focus_container'>
            <div className='discovery_focus_title'>Brand Focus</div>
            <div className='discovery_focus_serve_title'>추천 브랜드</div>
            <ShortcutItemWrap shortcutList = {topBrandList} />
        </div>
    )   
}

export default DiscoveryFocus;