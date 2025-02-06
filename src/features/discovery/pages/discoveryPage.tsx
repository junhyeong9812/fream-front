import '../css/discoveryPage.css';
import React from 'react';
import HomeTop from '../../common/components/top';
import Banner from '../../common/components/banner';
import DiscoverySomething from '../components/discoverySomething';
import DiscoveryFocus from '../components/discoveryFocus';
import DiscoveryPdp from '../components/discoveryPdp';
import DiscoveryMellow from '../components/discoveryMellow';
import DiscoveryRoughneck from '../components/discoveryRoughneck';
import DiscoveryAdvertisement from '../components/discoveryAdvertisement';
import DiscoveryPopular from '../components/discoveryPopular';

const DiscoveryPage: React.FC = () => {

    return(
        <div className='discovery_page_container'>
            <HomeTop select='discovery' />
            <Banner select='discovery' />
            <DiscoverySomething />
            <DiscoveryFocus />
            <DiscoveryPdp />
            <DiscoveryMellow />
            <DiscoveryRoughneck />
            <DiscoveryAdvertisement num={1} />
            <DiscoveryAdvertisement num={2} />
            <DiscoveryPopular />
        </div>
    )
}

export default DiscoveryPage;