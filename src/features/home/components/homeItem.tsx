import '../css/homeItem.css';
import React from 'react';
import ShortcutItemWrap from '../../common/components/shortcutItemWrap';
import { ShortcutItems } from '../types/homeTypes';

const HomeItem: React.FC = () => {

    const itemList: ShortcutItems[] = [
        {img: `${process.env.PUBLIC_URL}/mainImg/shortcut/shortcut1.webp`, name: "KREAM DRAW"},
        {img: `${process.env.PUBLIC_URL}/mainImg/shortcut/shortcut2.webp`, name: "남성 추천"},
        {img: `${process.env.PUBLIC_URL}/mainImg/shortcut/shortcut3.webp`, name: "여성 추천"},
        {img: `${process.env.PUBLIC_URL}/mainImg/shortcut/shortcut4.webp`, name: "색다른 추천"},
        {img: `${process.env.PUBLIC_URL}/mainImg/shortcut/shortcut5.webp`, name: "정가 아래"},
        {img: `${process.env.PUBLIC_URL}/mainImg/shortcut/shortcut6.webp`, name: "뻔하지 않은 선물"},
        {img: `${process.env.PUBLIC_URL}/mainImg/shortcut/shortcut7.webp`, name: "겨울 액세서리"},
        {img: `${process.env.PUBLIC_URL}/mainImg/shortcut/shortcut8.webp`, name: "패딩"},
        {img: `${process.env.PUBLIC_URL}/mainImg/shortcut/shortcut9.webp`, name: "어그"},
        {img: `${process.env.PUBLIC_URL}/mainImg/shortcut/shortcut10.webp`, name: "신발"},
        {img: `${process.env.PUBLIC_URL}/mainImg/shortcut/shortcut11.webp`, name: "지갑"},
        {img: `${process.env.PUBLIC_URL}/mainImg/shortcut/shortcut12.webp`, name: "주얼리"},
        {img: `${process.env.PUBLIC_URL}/mainImg/shortcut/shortcut13.webp`, name: "키링"},
        {img: `${process.env.PUBLIC_URL}/mainImg/shortcut/shortcut14.webp`, name: "후드"},
        {img: `${process.env.PUBLIC_URL}/mainImg/shortcut/shortcut15.webp`, name: "모자"},
    ]

    return(
        <div className='home_item_container'>
            <ShortcutItemWrap shortcutList = {itemList} />
        </div>
    )
}

export default HomeItem;