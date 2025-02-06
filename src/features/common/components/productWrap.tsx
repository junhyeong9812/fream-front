import '../css/productWrap.css';
import React, { useEffect, useState } from 'react';
import Product from './product';
import { productWrapProps } from '../types/commonTypes';
import { productInfo } from '../types/commonTypes';
import { fetchJustDroppedData } from '../../home/services/homeJustDroppedService';
import { fetchMostPopularData } from '../../home/services/homeMostPopularService';
import { fetchNewInData } from '../../home/services/homeNewInService';
import { fetchMufflerData } from '../../home/services/homeMufflerService';
import { fetchOutdoorData } from '../../home/services/homeOutdoorService';
import { fetchPeachesData } from '../../home/services/homePeachesService';
import { fetchBlrLeebokData } from '../../home/services/homeBlrLeebokService';
import { fetchWinterData } from '../../home/services/homeWinterService';
import { justDroppedData } from '../data/commonDummyData';
import { mostPopularData } from '../data/commonDummyData';
import { newInData } from '../data/commonDummyData';
import { mufflerData } from '../data/commonDummyData';
import { outdoorData } from '../data/commonDummyData';
import { peachesData } from '../data/commonDummyData';
import { blrLeebokData } from '../data/commonDummyData';
import { winterData } from '../data/commonDummyData';

import { fetchLuxuryWishData } from '../../luxury/services/luxuryWishService';
import { fetchLuxuryHotData } from '../../luxury/services/luxuryHotService';
import { fetchLuxuryCheapData } from '../../luxury/services/luxuryCheapService';
import { fetchLuxurySmallData } from '../../luxury/services/luxurySmallService';
import { luxuryWishData } from '../data/commonDummyData';
import { luxuryHotData } from '../data/commonDummyData';
import { luxuryCheapData } from '../data/commonDummyData';
import { luxurySmallData } from '../data/commonDummyData';

import { fetchDiscoverySomethingData } from '../../discovery/services/discoverySomethingService';
import { fetchDiscoveryPdpData } from '../../discovery/services/discoveryPdpService';
import { fetchDiscoveryMellowData } from '../../discovery/services/discoveryMellowService';
import { fetchDiscoveryRoughneckData } from '../../discovery/services/discoveryRoughneckService';
import { discoverySomethingData } from '../data/commonDummyData';
import { discoveryPdpData } from '../data/commonDummyData';
import { discoveryMellowData } from '../data/commonDummyData';
import { discoveryRoughneckData } from '../data/commonDummyData';

import { fetchMenForData } from '../../men/services/menForService';
import { fetchMenSneakersData } from '../../men/services/menSneakersService';
import { fetchMenArrivalsData } from '../../men/services/menArrivalsService';
import { fetchMenKnitData } from '../../men/services/menKnitService';
import { fetchMenJacketData } from '../../men/services/menJacketService';
import { fetchMenLightData } from '../../men/services/menLightService';
import { fetchMenChoiceData } from '../../men/services/menChoiceService';
import { menForData } from '../data/commonDummyData';
import { menSneakersData } from '../data/commonDummyData';
import { menArrivalsData } from '../data/commonDummyData';
import { menKnitData } from '../data/commonDummyData';
import { menJacketData } from '../data/commonDummyData';
import { menLightData } from '../data/commonDummyData';
import { menChoiceData } from '../data/commonDummyData';

import { fetchWomenForData } from '../../women/services/womenForService';
import { fetchWomenRisingData } from '../../women/services/womenRisingService';
import { fetchWomenArrivalsData } from '../../women/services/womenArrivalsService';
import { fetchWomenRocciData } from '../../women/services/womenRocciService';
import { fetchWomenWishData } from '../../women/services/womenWishService';
import { fetchWomenBeautyData } from '../../women/services/womenBeautyService';
import { fetchWomenCuteData } from '../../women/services/womenCuteService';
import { fetchWomenPinkBrownData } from '../../women/services/womenPinkBrownService';
import { fetchWomenHeavyData } from '../../women/services/womenHeavyService';
import { fetchWomenSienneData } from '../../women/services/womenSienneService';
import { womenForData } from '../data/commonDummyData';
import { womenRisingData } from '../data/commonDummyData';
import { womenArrivalsData } from '../data/commonDummyData';
import { womenRocciData } from '../data/commonDummyData';
import { womenWishData } from '../data/commonDummyData';
import { womenBeautyData } from '../data/commonDummyData';
import { womenCuteData } from '../data/commonDummyData';
import { womenPinkBrownData } from '../data/commonDummyData';
import { womenHeavyData } from '../data/commonDummyData';
import { womenSienneData } from '../data/commonDummyData';

const ProductWrap: React.FC<productWrapProps> = ({ productCategory }) => {

    const [productList, setProductList] = useState<productInfo[]>([]);
    
    useEffect(() => {
        if (productCategory === "justDropped") {
            handleJustDropped();
        }
        if (productCategory === "mostPopular") {
            handleMostPopular();
        }
        if (productCategory === "newIn") {
            handleNewIn();
        }
        if (productCategory === "muffler") {
            handleMuffler();
        }
        if (productCategory === "outdoor") {
            handleOutdoor();
        }
        if (productCategory === "peaches") {
            handlePeaches();
        }
        if (productCategory === "blrLeebok") {
            handleBlrLeebok();
        }
        if (productCategory === "winter") {
            handleWinter();
        }

        if (productCategory === "luxuryWish") {
            handleLuxuryWish();
        }
        if (productCategory === "luxuryHot") {
            handleLuxuryHot();
        }
        if (productCategory === "luxuryCheap") {
            handleLuxuryCheap();
        }
        if (productCategory === "luxurySmall") {
            handleLuxurySmall();
        }

        if (productCategory === "discoverySomething") {
            handleDiscoverySomething();
        }
        if (productCategory === "discoveryPdp") {
            handleDiscoveryPdp();
        }
        if (productCategory === "discoveryMellow") {
            handleDiscoveryMellow();
        }
        if (productCategory === "discoveryRoughneck") {
            handleDiscoveryRoughneck();
        }

        if (productCategory === "menFor") {
            handleMenFor();
        }
        if (productCategory === "menSneakers") {
            handleMenSneakers();
        }
        if (productCategory === "menArrivals") {
            handleMenArrivals();
        }
        if (productCategory === "menKnit") {
            handleMenKnit();
        }
        if (productCategory === "menJacket") {
            handleMenJacket();
        }
        if (productCategory === "menLight") {
            handleMenLight();
        }
        if (productCategory === "menChoice") {
            handleMenChoice();
        }

        if (productCategory === "womenFor") {
            handleWomenFor();
        }
        if (productCategory === "womenRising") {
            handleWomenRising();
        }
        if (productCategory === "womenArrivals") {
            handleWomenArrivals();
        }
        if (productCategory === "womenRocci") {
            handleWomenRocci();
        }
        if (productCategory === "womenWish") {
            handleWomenWish();
        }
        if (productCategory === "womenBeauty") {
            handleWomenBeauty();
        }
        if (productCategory === "womenCute") {
            handleWomenCute();
        }
        if (productCategory === "womenPinkBrown") {
            handleWomenPinkBrown();
        }
        if (productCategory === "womenHeavy") {
            handleWomenHeavy();
        }
        if (productCategory === "womenSienne") {
            handleWomenSienne();
        }
    }, [productCategory]);
    
    // JustDropped 정보
    async function handleJustDropped() {
        const productData = await fetchJustDroppedData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(justDroppedData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }    
    // MostPopular 정보
    async function handleMostPopular() {
        const productData = await fetchMostPopularData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(mostPopularData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }  
    // NewIn 정보
    async function handleNewIn() {
        const productData = await fetchNewInData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(newInData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }  
    // muffler 정보
    async function handleMuffler() {
        const productData = await fetchMufflerData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(mufflerData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }  
    // outdoor 정보
    async function handleOutdoor() {
        const productData = await fetchOutdoorData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(outdoorData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // peaches 정보
    async function handleBlrLeebok() {
        const productData = await fetchBlrLeebokData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(blrLeebokData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // blrLeebok 정보
    async function handlePeaches() {
        const productData = await fetchPeachesData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(peachesData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // winter 정보
    async function handleWinter() {
        const productData = await fetchWinterData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(winterData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    

    // luxuryWish
    async function handleLuxuryWish() {
        const productData = await fetchLuxuryWishData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(luxuryWishData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // luxuryHot
    async function handleLuxuryHot() {
        const productData = await fetchLuxuryHotData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(luxuryHotData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // luxuryCheap
    async function handleLuxuryCheap() {
        const productData = await fetchLuxuryCheapData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(luxuryCheapData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // luxurySmall
    async function handleLuxurySmall() {
        const productData = await fetchLuxurySmallData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(luxurySmallData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }


    // discoverySomething
    async function handleDiscoverySomething() {
        const productData = await fetchDiscoverySomethingData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(discoverySomethingData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // discoveryPdp
    async function handleDiscoveryPdp() {
        const productData = await fetchDiscoveryPdpData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(discoveryPdpData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // discoveryMellow
    async function handleDiscoveryMellow() {
        const productData = await fetchDiscoveryMellowData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(discoveryMellowData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // discoveryRoughneck
    async function handleDiscoveryRoughneck() {
        const productData = await fetchDiscoveryRoughneckData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(discoveryRoughneckData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }


    // menFor 
    async function handleMenFor() {
        const productData = await fetchMenForData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(menForData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // menSneakers
    async function handleMenSneakers() {
        const productData = await fetchMenSneakersData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(menSneakersData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // menArrivals
    async function handleMenArrivals() {
        const productData = await fetchMenArrivalsData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(menArrivalsData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // menKnit
    async function handleMenKnit() {
        const productData = await fetchMenKnitData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(menKnitData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // menJacket
    async function handleMenJacket() {
        const productData = await fetchMenJacketData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(menJacketData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // menLight
    async function handleMenLight() {
        const productData = await fetchMenLightData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(menLightData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // menChoice
    async function handleMenChoice() {
        const productData = await fetchMenChoiceData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(menChoiceData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }


    // womenFor
    async function handleWomenFor() {
        const productData = await fetchWomenForData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(womenForData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // womenRising
    async function handleWomenRising() {
        const productData = await fetchWomenRisingData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(womenRisingData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // womenArrivals
    async function handleWomenArrivals() {
        const productData = await fetchWomenArrivalsData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(womenArrivalsData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // womenRocci
    async function handleWomenRocci() {
        const productData = await fetchWomenRocciData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(womenRocciData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // womenWish
    async function handleWomenWish() {
        const productData = await fetchWomenWishData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(womenWishData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // womenBeauty
    async function handleWomenBeauty() {
        const productData = await fetchWomenBeautyData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(womenBeautyData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // womenCute
    async function handleWomenCute() {
        const productData = await fetchWomenCuteData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(womenCuteData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // womenPinkBrown
    async function handleWomenPinkBrown() {
        const productData = await fetchWomenPinkBrownData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(womenPinkBrownData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // womenHeavy
    async function handleWomenHeavy() {
        const productData = await fetchWomenHeavyData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(womenHeavyData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }
    // womenSienne
    async function handleWomenSienne() {
        const productData = await fetchWomenSienneData();
        if (productData === "no") {
            // console.log("더미데이터 들어옴");
            setProductList(womenSienneData);
        }else {
            console.log("정상적으로 데이터 들어옴");
            setProductList(productData);
        }
    }


    // 더보기 버튼
    const [productListCount, setProductListCount] = useState<number>(5);

    const handleProductListMore = () => {
        setProductListCount(prevCount => prevCount + 5);
    };

    return(
        <div>
            <div className='product_wrap_container'>
                {productList.slice(0, productListCount).map((product, index) => (
                    <Product product={product} key={index}/> 
                ))}
            </div>
            {productListCount < productList.length && (
                <div className='product_wrap_btn_content' onClick={handleProductListMore}>
                    더보기
                </div>
            )}
        </div>
    )
}

export default ProductWrap;