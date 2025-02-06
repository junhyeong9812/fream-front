import '../css/luxuryTopBrand.css';
import React from 'react';
import ShortcutItemWrap from '../../common/components/shortcutItemWrap';
import { ShortcutItems } from '../types/luxuryTypes';

const LuxuryTopBrand: React.FC = () => {

    const topBrandList: ShortcutItems[] = [
        {img: `${process.env.PUBLIC_URL}/luxuryImg/topbrand/topbrand1.webp`, name: "롤렉스"},
        {img: `${process.env.PUBLIC_URL}/luxuryImg/topbrand/topbrand2.webp`, name: "발렌시아가"},
        {img: `${process.env.PUBLIC_URL}/luxuryImg/topbrand/topbrand3.webp`, name: "구찌"},
        {img: `${process.env.PUBLIC_URL}/luxuryImg/topbrand/topbrand4.webp`, name: "크롬하츠"},
        {img: `${process.env.PUBLIC_URL}/luxuryImg/topbrand/topbrand5.webp`, name: "톰브라운"},
        {img: `${process.env.PUBLIC_URL}/luxuryImg/topbrand/topbrand6.webp`, name: "보테가 베네타"},
        {img: `${process.env.PUBLIC_URL}/luxuryImg/topbrand/topbrand7.webp`, name: "버버리"},
        {img: `${process.env.PUBLIC_URL}/luxuryImg/topbrand/topbrand8.webp`, name: "디올"},
        {img: `${process.env.PUBLIC_URL}/luxuryImg/topbrand/topbrand9.webp`, name: "프라다"},
        {img: `${process.env.PUBLIC_URL}/luxuryImg/topbrand/topbrand10.webp`, name: "셀린"},
        {img: `${process.env.PUBLIC_URL}/luxuryImg/topbrand/topbrand11.webp`, name: "샤넬"},
        {img: `${process.env.PUBLIC_URL}/luxuryImg/topbrand/topbrand12.webp`, name: "생로랑"},
        {img: `${process.env.PUBLIC_URL}/luxuryImg/topbrand/topbrand13.webp`, name: "루이비통"},
        {img: `${process.env.PUBLIC_URL}/luxuryImg/topbrand/topbrand14.webp`, name: "몽클레르"},
        {img: `${process.env.PUBLIC_URL}/luxuryImg/topbrand/topbrand15.webp`, name: "에르메스"},
    ]

    return(
        <div className='luxury_top_brand_container'>
            <div className='luxury_top_brand_title'>Top Brands</div>
            <div className='luxury_top_brand_serve_title'></div>
            <ShortcutItemWrap shortcutList = {topBrandList} />
        </div>
    )
}

export default LuxuryTopBrand;