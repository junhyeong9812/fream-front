import '../css/rankingWrap.css';
import React, { useEffect, useState } from 'react';
import { rankingWrapProps } from '../types/commonTypes';
import Ranking from './ranking';
import { rankingInfo } from '../types/commonTypes';
import { fetchRankingData } from '../../ranking/services/rankingService';
import { fetchRankingBuyData } from '../../ranking/services/rankingBuyService';
import { rankingSeeData } from '../data/commonDummyData';
import { rankingBuyData } from '../data/commonDummyData';

const RankingWrap: React.FC<rankingWrapProps> = ({select}) => {

    const [rankingList, setRankingList] = useState<rankingInfo[]>([]);
    const [rankingListCount, setRankingListCount] = useState<number>(30);  // 보여줄 제품 개수
    const [loading, setLoading] = useState<boolean>(false);  // 로딩 상태
    const [allDataLoaded, setAllDataLoaded] = useState<boolean>(false);  // 모든 데이터 로드 여부
    
    // rankingSee
    async function handleRankingSee() {
        const productData = await fetchRankingData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setRankingList(rankingSeeData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setRankingList(productData);
        }
    }   

    // rankingBuy
    async function handleRankingBuy() {
        const productData = await fetchRankingBuyData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setRankingList(rankingBuyData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setRankingList(productData);
        }
    } 
    
    useEffect(() => {
        if (select === "see") {
            handleRankingSee();
        }
        if (select === "buy") {
            handleRankingBuy();
        }
    })

    // 스크롤 이벤트 처리
    const handleScroll = () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        // 페이지 끝에 도달했는지 확인
        if (scrollTop + clientHeight >= scrollHeight - 450 && !loading && !allDataLoaded) {
            // console.log('스크롤 끝에 도달했습니다!');
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
                return prevCount + 30;  // 15개씩 추가
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
        <div>
            <div className='ranking_wrap_container'>
                {rankingList.slice(0, rankingListCount).map((ranking, index) => (
                    <Ranking ranking={ranking} rank={index+1} key={index} />
                ))}
            </div>
            {loading && !allDataLoaded &&   
                <div className='ranking_wrap_loading_content'>
                    <div className="ranking_wrap_loading"></div> 
                </div>
            }
        </div>
    )
}

export default RankingWrap;