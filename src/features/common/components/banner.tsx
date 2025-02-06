import '../css/banner.css';
import React, { useEffect, useRef, useState } from "react";
import { BannerSelect } from '../types/commonTypes';
import { BannerItems } from '../types/commonTypes';

const HomeBanner: React.FC<BannerSelect> = ({select}) => {

  const homeBannerItemList: BannerItems[] = [
    {img: `${process.env.PUBLIC_URL}/mainImg/banner/banner1.webp`, backgroundColor: "#ADACB3"},
    {img: `${process.env.PUBLIC_URL}/mainImg/banner/banner2.webp`, backgroundColor: "#818C8F"},
    {img: `${process.env.PUBLIC_URL}/mainImg/banner/banner3.webp`, backgroundColor: "#9C9B99"},
  ]
  const LuxuryBannerItemList: BannerItems[] = [
    {img: `${process.env.PUBLIC_URL}/luxuryImg/banner/banner1.webp`, backgroundColor: "#BEDAB7"},
    {img: `${process.env.PUBLIC_URL}/luxuryImg/banner/banner2.webp`, backgroundColor: "#D1CBBD"},
    {img: `${process.env.PUBLIC_URL}/luxuryImg/banner/banner3.webp`, backgroundColor: "#BDBDBF"},
  ]
  const DiscoveryBannerItemList: BannerItems[] = [
    {img: `${process.env.PUBLIC_URL}/discoveryImg/banner/banner1.webp`, backgroundColor: "#B5A3E7"},
    {img: `${process.env.PUBLIC_URL}/discoveryImg/banner/banner2.webp`, backgroundColor: "#E1DFD9"},
    {img: `${process.env.PUBLIC_URL}/discoveryImg/banner/banner3.webp`, backgroundColor: "#040404"},
  ]
  
  const [bannerItemList, setBannerItemLIst] = useState<BannerItems[]>(homeBannerItemList);
  
  useEffect(() => {
    if (select === "home") {
      setBannerItemLIst(homeBannerItemList);
    }
    if (select === "luxury") {
      setBannerItemLIst(LuxuryBannerItemList);
    }
    if (select === "discovery") {
      setBannerItemLIst(DiscoveryBannerItemList);
    }
  }, [select])
  
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // interval을 저장할 ref

  const startAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current); // 기존 interval 정리
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerItemList.length);
    }, 3000); // 새로운 interval 시작
  };

  // 페이지 로드 시 자동 슬라이드 시작
  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current); // 컴포넌트 언마운트 시 interval 정리
    };
  }, [bannerItemList.length]);

  // 왼쪽 화살표 클릭 핸들러
  const handleLeftArrowClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? bannerItemList.length - 1 : prevIndex - 1
    );
    startAutoSlide(); // 클릭 시 interval 초기화
  };

  // 오른쪽 화살표 클릭 핸들러
  const handleRightArrowClick = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex + 1) % bannerItemList.length
    );
    startAutoSlide(); // 클릭 시 interval 초기화
  };

  return (
    <div className='home_banner_container' style={{ backgroundColor: bannerItemList[currentIndex].backgroundColor }}>
      <div className='home_banner_left_arrow_content'>
        <svg onClick={handleLeftArrowClick} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path style={{cursor:"pointer"}} d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <img src={bannerItemList[currentIndex].img} className='home_banner_content'/>
      <div className='home_banner_right_arrow_content'>
        <svg onClick={handleRightArrowClick} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path style={{cursor:"pointer"}} d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className='home_banner_pagination_content'>
        {bannerItemList.map((_, index) => (
          <span style={{backgroundColor: currentIndex === index ? 'white' : "rgba(127, 127, 127, 0.5)"}} onClick={() => {setCurrentIndex(index); startAutoSlide();}} className='home_banner_pagination'></span>
        ))}
      </div>
    </div>
                        

  );
};

export default HomeBanner;