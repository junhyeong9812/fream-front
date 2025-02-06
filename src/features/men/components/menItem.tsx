import '../css/menItem.css';
import React from 'react';
import ShortcutItemWrap from '../../common/components/shortcutItemWrap';
import { ShortcutItems } from '../types/menTypes';

const MenItem: React.FC = () => {

    const itemList: ShortcutItems[] = [
        {img: `${process.env.PUBLIC_URL}/menImg/shortcut/shortcut1.webp`, name: "인기 후드 & 맨투맨"},
        {img: `${process.env.PUBLIC_URL}/menImg/shortcut/shortcut2.webp`, name: "인기 신발"},
        {img: `${process.env.PUBLIC_URL}/menImg/shortcut/shortcut3.webp`, name: "인기 Acc."},
        {img: `${process.env.PUBLIC_URL}/menImg/shortcut/shortcut4.webp`, name: "인기 니트 & 가디건"},
        {img: `${process.env.PUBLIC_URL}/menImg/shortcut/shortcut5.webp`, name: "20대의 위시템"},
        {img: `${process.env.PUBLIC_URL}/menImg/shortcut/shortcut6.webp`, name: "인기 자켓"},
        {img: `${process.env.PUBLIC_URL}/menImg/shortcut/shortcut7.webp`, name: "인기 아우터"},
        {img: `${process.env.PUBLIC_URL}/menImg/shortcut/shortcut8.webp`, name: "15만원 이하 신발"},
        {img: `${process.env.PUBLIC_URL}/menImg/shortcut/shortcut9.webp`, name: "고프코어 브랜드"},
        {img: `${process.env.PUBLIC_URL}/menImg/shortcut/shortcut10.webp`, name: "레인스 신상 발매"},
    ]

    return(
        <div className='men_item_container'>
            <ShortcutItemWrap shortcutList = {itemList} />
        </div>
    )
}

export default MenItem;