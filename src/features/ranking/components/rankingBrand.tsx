import '../css/rankingBrand.css';
import React, { useEffect, useRef, useState } from 'react';
import { PiBookmarkSimpleThin } from "react-icons/pi";
import { rankingBrandInfo } from '../types/rankingTypes';
import { fetchRankingBrandData } from '../services/rankingBrandService';
import { rankingBrandData } from '../data/rankingDummyData';

const RankingBrand: React.FC = () => {

    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [rankingList, setRankingList] = useState<rankingBrandInfo[]>([]);
    const [currentIndices, setCurrentIndices] = useState<number[]>([]);
    const [prevArrow, setPrevArrow] = useState<boolean[]>([]);
    const [nextArrow, setNextArrow] = useState<boolean[]>([]);

    useEffect(() => {
        async function handleRankingBrand() {
          const productData = await fetchRankingBrandData();
          const listData = productData === "no" ? rankingBrandData : productData;
      
          setRankingList(listData);
          setCurrentIndices(new Array(listData.length).fill(0)); // 초기 인덱스를 모두 0으로 설정
          setPrevArrow(new Array(listData.length).fill(false)); // 초기 상태는 모두 true 
          setNextArrow(new Array(listData.length).fill(true)); // 초기 상태는 모두 false
        }
      
        handleRankingBrand();
      }, []);


    useEffect(() => {
        // console.log(prevArrow[0]);
        // console.log(nextArrow[0]);
        // console.log(currentIndices[0]);
        for (let index = 0; index < rankingList.length+1; index++) {
            if (rankingList[index] && rankingList[index].imgs) {
                setPrevArrow(prev => {
                    const updated = [...prev];
                    updated[index] = currentIndices[index] > 0; // currentIndices[index]가 0보다 크면 true, 아니면 false
                    return updated;
                });

                setNextArrow((prev) => {
                    const updated = [...prev];
                    updated[index] = currentIndices[index] < rankingList[index].imgs.length - 3; // 15까지 보이도록 제한
                    return updated;
                });
            }
        }
    }, [currentIndices, rankingList])

    useEffect(() => {
      async function handleRankingBrand() {
        const productData = await fetchRankingBrandData();
        if (productData === "no") {
          setRankingList(rankingBrandData);
          setCurrentIndices(new Array(rankingBrandData.length).fill(0));
        } else {
          setRankingList(productData);
          setCurrentIndices(new Array(productData.length).fill(0));
        }
      }
      handleRankingBrand();
    }, []);
  
    const handlePrev = (brandIndex: number) => {
        setCurrentIndices((prev) =>
            prev.map((current, index) => {
            if (index === brandIndex && current > 0) {
                return current - 1;
            }
            return current;
            })
        );
    };
    const handleNext = (brandIndex: number, imgsLength: number) => {
        setCurrentIndices((prev) =>
          prev.map((current, index) => {
            if (index === brandIndex && current < imgsLength - 3) {
              return current + 1;
            }
            return current;
          })
        );
    };
  
    
    const calculateTransform = (brandIndex: number) => {
      return `translateX(-${currentIndices[brandIndex] * 100}%)`;
    };

    useEffect(() => {
        // rankingList가 변경될 때마다 containerWidth 업데이트
        const handleResize = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth);
            }
        };
    
        handleResize(); // 초기 설정
        window.addEventListener('resize', handleResize); // 창 크기 변경 감지
        return () => window.removeEventListener('resize', handleResize);
    }, [rankingList]); // rankingList가 변경될 때마다 실행



    const [rankingListCount, setRankingListCount] = useState<number>(14);  // 보여줄 제품 개수
    const [loading, setLoading] = useState<boolean>(false);  // 로딩 상태
    const [allDataLoaded, setAllDataLoaded] = useState<boolean>(false);  // 모든 데이터 로드 여부
    // 스크롤 이벤트 처리
    const handleScroll = () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        // 페이지 끝에 도달했는지 확인
        if (scrollTop + clientHeight >= scrollHeight - 450 && !loading && !allDataLoaded) {
            console.log('스크롤 끝에 도달했습니다!');  // 콘솔 로그 추가
            loadMoreProducts();
        }
    };

    // 15개씩 추가로 로딩
    const loadMoreProducts = () => {
        setLoading(true);  // 로딩 시작
        setTimeout(() => {  // 1초 후에 더 로딩
            setRankingListCount(prevCount => {
                if (rankingListCount >= rankingList.length) {
                    setAllDataLoaded(true);  // 모든 데이터가 로드되었을 때
                    setLoading(false);  // 로딩 끝
                    return prevCount;  // 더 이상 데이터 로딩하지 않음
                }
                setLoading(false);  // 로딩 끝
                return prevCount + 14;  // 15개씩 추가
            });
        }, 1000);  // 1초 딜레이 후 추가 로딩
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [loading, allDataLoaded, rankingList]);

    return(
        <>
            <div className='ranking_brand_container'>
                {rankingList.slice(0, rankingListCount).map((ranking, brandIndex) => (
                    <div className='ranking_brand_content' key={brandIndex}>
                        <div className='ranking_brand_info'>
                            <div className='ranking_brand_info_trend'>
                                <div className='ranking_brand_info_trend_rank'>
                                    {brandIndex+1}
                                </div>
                                    {ranking.polarity ? 
                                        <div className='ranking_brand_info_trend_polarity'>
                                            ▲{ranking.porarityNum}
                                        </div>
                                    :
                                        <div className='ranking_brand_info_trend_none_polarity'>
                                            ▼{ranking.porarityNum}
                                        </div>
                                    }
                            </div>
                            <img src={ranking.logo} className='ranking_brand_info_logo'/>
                            <div className='ranking_brand_info_name'>
                                <div className='ranking_brand_info_name_eng'>
                                    {ranking.brandEng}
                                    <svg className='ranking_brand_info_name_eng_arrow' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path style={{cursor:"pointer"}} d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className='ranking_brand_info_name_kor'>{ranking.brandKor} · 관심 {ranking.interest}</div>
                            </div>
                            <div className='ranking_brand_info_bookmark'>
                                <PiBookmarkSimpleThin />
                            </div>
                        </div>
                        <div className='ranking_brand_img_container' > 
                            
                        {ranking.imgs.map((img, index) => (
                            <div>
                                {prevArrow[brandIndex] &&
                                    <div onClick={() => handlePrev(brandIndex)} className='ranking_brand_img_left_arrow_content'>
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path style={{cursor:"pointer"}} d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                }
                            
                                <div className='ranking_brand_img_wrapper' style={{ transform: calculateTransform(brandIndex), transition: 'transform 0.3s ease-in-out' }}>
                                    <div className='ranking_brand_img_content' key={index}>
                                        <PiBookmarkSimpleThin className='ranking_brand_img_bookmark' />
                                        <img className='ranking_brand_img' src={img} />
                                    </div>
                                </div>

                                {nextArrow[brandIndex] &&
                                    <div onClick={() => handleNext(brandIndex, ranking.imgs.length)} className='ranking_brand_img_right_arrow_content'>
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path style={{cursor:"pointer"}} d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                }
                            </div>
                        ))}

                        </div>
                        <div className='ranking_brand_more_content'>
                            브랜드 더보기
                        </div>
                    </div>
                ))}
            </div>
            {loading && !allDataLoaded &&   
                <div className='ranking_brand_loading_content'>
                    <div className="ranking_brand_loading"></div> 
                </div>
            }
        </>
    )
}

export default RankingBrand;