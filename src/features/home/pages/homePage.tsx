import '../css/homePage.css';
import React from "react";
import HomeTop from '../../common/components/top';
import Banner from "../../common/components/banner";
import HomeItem from '../components/homeItem';
import HomeTopPicks from '../components/homeTopPicks';
import HomeJustDropped from '../components/homeJustDropped';
import HomeTopBrand from '../components/homeTopBrand';
import HomeAdvertisement from '../components/homeAdvertisement';
import HomeMostPopular from '../components/homeMostPopular';
import HomeNewIn from '../components/homeNewIn';
import HomeMuffler from '../components/homeMuffler';
import HomeOutdoor from '../components/homeOutdoor';
import HomePeaches from '../components/homePeaches';
import HomeBlrLeebok from '../components/homeBlrLeebok';
import HomeWinter from '../components/homeWinter';
import HomeRecommend from '../components/homeRecommend';


const HomePage: React.FC = () => {

  return (
    <div className='home_page_container'>
      <HomeTop select="home" />
      <Banner select='home' />
      <HomeItem />
      <HomeTopPicks />
      <HomeJustDropped />
      <HomeTopBrand />
      <HomeAdvertisement num={1}/>
      <HomeMostPopular />
      <HomeAdvertisement num={2}/>
      <HomeNewIn />
      <HomeAdvertisement num={3}/>
      <HomeMuffler />
      <HomeAdvertisement num={4}/>
      <HomeOutdoor />
      <HomeAdvertisement num={5}/>
      <HomePeaches />
      <HomeAdvertisement num={6}/>
      <HomeBlrLeebok />
      <HomeAdvertisement num={7}/>
      <HomeWinter />
      <HomeRecommend />
    </div>
  );
};

export default HomePage;
