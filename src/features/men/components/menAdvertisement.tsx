import React from "react"
import Advertisement from "../../common/components/advertisement";
import { AdvertisementImg, AdvertisementNum } from "../types/menTypes";

const MenAdvertisement: React.FC<AdvertisementNum> = ({ num }) => {

    const advertisement1: AdvertisementImg = {img: `${process.env.PUBLIC_URL}/menImg/advertisement/advertisement1.webp`, backgroundcolor: "#6E7C74"}
    const advertisement2: AdvertisementImg = {img: `${process.env.PUBLIC_URL}/menImg/advertisement/advertisement2.webp`, backgroundcolor: "#90ABA8"}
    const advertisement3: AdvertisementImg = {img: `${process.env.PUBLIC_URL}/menImg/advertisement/advertisement3.webp`, backgroundcolor: "#C8DADB"}
    const advertisement4: AdvertisementImg = {img: `${process.env.PUBLIC_URL}/menImg/advertisement/advertisement4.webp`, backgroundcolor: "#719473"}
    const advertisement5: AdvertisementImg = {img: `${process.env.PUBLIC_URL}/menImg/advertisement/advertisement5.webp`, backgroundcolor: "#B4D3E4"}

    if (num === 1) {
        return(<Advertisement advertisement={advertisement1} />);
    }if (num === 2) {
        return(<Advertisement advertisement={advertisement2} />);
    }if (num === 3) {
        return(<Advertisement advertisement={advertisement3} />);
    }if (num === 4) {
        return(<Advertisement advertisement={advertisement4} />);
    }if (num === 5) {
        return(<Advertisement advertisement={advertisement5} />);
    }else {
        return(<></>);
    }
}

export default MenAdvertisement;