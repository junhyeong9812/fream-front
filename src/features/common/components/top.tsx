import '../css/top.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopProps } from '../types/commonTypes';

const Top: React.FC<TopProps> = ({select}) => {
    const navigate = useNavigate();

    return (
        <div className='home_top_container'>
            <div className='home_top_content'>
                <div onClick={() => { navigate("/") }} className={select  === "home" ? 'home_top_first_subject_content' : "home_top_first_subject_none_content"}>추천</div>
                <div onClick={() => { navigate("/ranking") }} className={select  === "ranking" ? 'home_top_subject_content' : "home_top_subject_none_content"}>랭킹</div>
                <div onClick={() => { navigate("/luxury") }} className={select  === "luxury" ? 'home_top_subject_content' : "home_top_subject_none_content"}>럭셔리</div>
                <div onClick={() => { navigate("/men") }} className={select  === "men" ? 'home_top_subject_content' : "home_top_subject_none_content"}>남성</div>
                <div onClick={() => { navigate("/women") }} className={select  === "women" ? 'home_top_subject_content' : "home_top_subject_none_content"}>여성</div>
                <div onClick={() => { navigate("/discovery") }} className={select  === "discovery" ? 'home_top_subject_content' : "home_top_subject_none_content"}>발견</div>
                <div onClick={() => { navigate("/exhibition") }} className={select  === "exhibition" ? 'home_top_subject_content' : "home_top_subject_none_content"}>이벤트</div>
            </div>
        </div>
    )
}

export default Top;