import React, { useEffect, useState } from 'react';
import '../css/rankingCategory.css';
import { rankingCategorySelect } from '../types/rankingTypes';
import { rankingCategoryInfo } from '../types/rankingTypes';

const RankingCategory: React.FC<rankingCategorySelect> = ({select}) => {

    const [rankingCategory, setRankingCategory] = useState<rankingCategoryInfo>([]);

    useEffect(() => {
        if (select === "see") {
            setRankingCategory(["패딩", "부츠", "겨울 액세사리", "뷰티", "주얼리", "신발", "슬리퍼", "후드", "의류", "지갑", "가방", "패션잡화", "레고", "라이프", "테크"]);
        }
        if (select === "buy") {
            setRankingCategory(["패딩", "부츠", "겨울 액세사리", "뷰티", "주얼리", "신발", "슬리퍼", "후드", "의류", "지갑", "가방", "패션잡화", "레고", "라이프", "테크"]);
        }
        if (select === "brand") {
            setRankingCategory(["의류", "패션잡화", "가방", "신발", "테크", "뷰티", "럭셔리리"]);
        }
    }, [select])

    return(
        <div className='ranking_category_container'>
            {rankingCategory.map((category, index) => (
                <div className='ranking_category_content' key={index}>
                    {category}
                </div>
            ))}
        </div>
    )
}

export default RankingCategory;