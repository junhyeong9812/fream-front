import "../css/discoveryPage.css";
import React from "react";
import HomeTop from "../../common/components/top";
import Banner from "../../common/components/banner";
import DiscoverySomething from "../components/discoverySomething";
import DiscoveryFocus from "../components/discoveryFocus";
import DiscoveryPdp from "../components/discoveryPdp";
import DiscoveryMellow from "../components/discoveryMellow";
import DiscoveryRoughneck from "../components/discoveryRoughneck";
import DiscoveryAdvertisement from "../components/discoveryAdvertisement";
import DiscoveryPopular from "../components/discoveryPopular";
import { useHeader } from "src/global/context/HeaderContext";

const DiscoveryPage: React.FC = () => {
  const { headerHeight } = useHeader();

  return (
    <div
      className="discovery_page_container"
      style={{
        paddingTop: `${headerHeight + 60}px`,
        minHeight: `calc(100vh - ${headerHeight}px)`,
      }}
    >
      <HomeTop select="discovery" />
      <Banner select="discovery" />
      <DiscoverySomething />
      <DiscoveryFocus />
      <DiscoveryPdp />
      <DiscoveryMellow />
      <DiscoveryRoughneck />
      <DiscoveryAdvertisement num={1} />
      <DiscoveryAdvertisement num={2} />
      <DiscoveryPopular />
    </div>
  );
};

export default DiscoveryPage;
