import '../css/womenItem.css';
import React from 'react';
import ShortcutItemWrap from '../../common/components/shortcutItemWrap';
import { ShortcutItems } from '../types/womenTypes';

const WomenItem: React.FC = () => {

    const itemList: ShortcutItems[] = [
        {img: `${process.env.PUBLIC_URL}/womenImg/shortcut/shortcut1.webp`, name: "BEST 가방"},
        {img: `${process.env.PUBLIC_URL}/womenImg/shortcut/shortcut2.webp`, name: "인기 니트 & 가디건"},
        {img: `${process.env.PUBLIC_URL}/womenImg/shortcut/shortcut3.webp`, name: "인기 신발"},
        {img: `${process.env.PUBLIC_URL}/womenImg/shortcut/shortcut4.webp`, name: "15만원 이하 신발"},
        {img: `${process.env.PUBLIC_URL}/womenImg/shortcut/shortcut5.webp`, name: "인기 아우터"},
        {img: `${process.env.PUBLIC_URL}/womenImg/shortcut/shortcut6.webp`, name: "취향저격 뷰티템"},
        {img: `${process.env.PUBLIC_URL}/womenImg/shortcut/shortcut7.webp`, name: "인기 Acc."},
        {img: `${process.env.PUBLIC_URL}/womenImg/shortcut/shortcut8.webp`, name: "지금 핫한 아이템!"},
        {img: `${process.env.PUBLIC_URL}/womenImg/shortcut/shortcut9.webp`, name: "올해 트렌드 리포트"},
        {img: `${process.env.PUBLIC_URL}/womenImg/shortcut/shortcut10.webp`, name: "파인드카푸어 입점"},
    ]

    return(
        <div className='women_item_container'>
            <ShortcutItemWrap shortcutList = {itemList} />
        </div>
    )
}

export default WomenItem;