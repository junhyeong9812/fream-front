import "../css/exhibitionPage.css";
import React from "react";
import HomeTop from "../../common/components/top";
import Exhibition from "../components/exhibition";
import { useHeader } from "src/global/context/HeaderContext";

const ExhibitionPage: React.FC = () => {
  const { headerHeight } = useHeader();
  return (
    <div
      className="exhibition_page_conatainer"
      style={{
        paddingTop: `${headerHeight + 60}px`,
        minHeight: `calc(100vh - ${headerHeight}px)`,
      }}
    >
      <HomeTop select="exhibition" />
      <Exhibition />
    </div>
  );
};

export default ExhibitionPage;
