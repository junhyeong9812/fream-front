import '../css/homeTopBrand.css';
import React from 'react';
import ShortcutItemWrap from '../../common/components/shortcutItemWrap';
import { ShortcutItems } from '../types/homeTypes';

const HomeTopBrand: React.FC = () => {

    const topBrandList: ShortcutItems[] = [
        {img: `${process.env.PUBLIC_URL}/mainImg/topbrand/topbrand1.webp`, name: "나이키"},
        {img: `${process.env.PUBLIC_URL}/mainImg/topbrand/topbrand2.webp`, name: "아디다스"},
        {img: `${process.env.PUBLIC_URL}/mainImg/topbrand/topbrand3.webp`, name: "뉴발란스"},
        {img: `${process.env.PUBLIC_URL}/mainImg/topbrand/topbrand4.webp`, name: "아이앱 스튜디오"},
        {img: `${process.env.PUBLIC_URL}/mainImg/topbrand/topbrand5.webp`, name: "스투시"},
        {img: `${process.env.PUBLIC_URL}/mainImg/topbrand/topbrand6.webp`, name: "아식스"},
        {img: `${process.env.PUBLIC_URL}/mainImg/topbrand/topbrand7.webp`, name: "슈프림"},
        {img: `${process.env.PUBLIC_URL}/mainImg/topbrand/topbrand8.webp`, name: "팔라스"},
        {img: `${process.env.PUBLIC_URL}/mainImg/topbrand/topbrand9.webp`, name: "크롬하츠"},
        {img: `${process.env.PUBLIC_URL}/mainImg/topbrand/topbrand10.webp`, name: "아크테릭스"},
        {img: `${process.env.PUBLIC_URL}/mainImg/topbrand/topbrand11.webp`, name: "어그"},
        {img: `${process.env.PUBLIC_URL}/mainImg/topbrand/topbrand12.webp`, name: "살로몬"},
        {img: `${process.env.PUBLIC_URL}/mainImg/topbrand/topbrand13.webp`, name: "조던"},
        {img: `${process.env.PUBLIC_URL}/mainImg/topbrand/topbrand14.webp`, name: "노스페이스"},
        {img: `${process.env.PUBLIC_URL}/mainImg/topbrand/topbrand15.webp`, name: "스톤 아일랜드"},
    ]

    return(
        <div className='home_top_brand_container'>
            <div className='home_top_brand_title'>Top Brand</div>
            <div className='home_top_brand_serve_title'>인기 탑 브랜드</div>
            <ShortcutItemWrap shortcutList = {topBrandList} />
        </div>
    )
}

export default HomeTopBrand;