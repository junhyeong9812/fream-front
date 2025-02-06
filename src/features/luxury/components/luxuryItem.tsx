import '../css/luxuryItem.css';
import React from 'react';
import ShortcutItemWrap from '../../common/components/shortcutItemWrap';
import { ShortcutItems } from '../types/luxuryTypes';

const LuxuryItem: React.FC = () => {

    const itemList: ShortcutItems[] = [
        {img: `${process.env.PUBLIC_URL}/luxuryImg/shortcut/shortcut1.webp`, name: "남성 추천"},
        {img: `${process.env.PUBLIC_URL}/luxuryImg/shortcut/shortcut2.webp`, name: "여성 추천"},
        {img: `${process.env.PUBLIC_URL}/luxuryImg/shortcut/shortcut3.webp`, name: "TOP 50"},
        {img: `${process.env.PUBLIC_URL}/luxuryImg/shortcut/shortcut4.webp`, name: "BEST 가방"},
        {img: `${process.env.PUBLIC_URL}/luxuryImg/shortcut/shortcut5.webp`, name: "샤넬 부티크"},
        {img: `${process.env.PUBLIC_URL}/luxuryImg/shortcut/shortcut6.webp`, name: "인기 의류"},
        {img: `${process.env.PUBLIC_URL}/luxuryImg/shortcut/shortcut7.webp`, name: "정가아래 럭셔리"},
        {img: `${process.env.PUBLIC_URL}/luxuryImg/shortcut/shortcut8.webp`, name: "인기 Acc"},
        {img: `${process.env.PUBLIC_URL}/luxuryImg/shortcut/shortcut9.webp`, name: "인기 신발"},
        {img: `${process.env.PUBLIC_URL}/luxuryImg/shortcut/shortcut10.webp`, name: "내일 만나요!"},
    ]

    return(
        <div className='luxury_item_container'>
            <ShortcutItemWrap shortcutList = {itemList} />
        </div>
    )
}

export default LuxuryItem;