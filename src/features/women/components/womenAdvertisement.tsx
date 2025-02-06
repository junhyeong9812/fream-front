import React from "react"
import Advertisement from "../../common/components/advertisement";
import { AdvertisementImg, AdvertisementNum } from "../types/womenTypes";

const WomenAdvertisement: React.FC<AdvertisementNum> = ({ num }) => {

    const advertisement1: AdvertisementImg = {img: `${process.env.PUBLIC_URL}/womenImg/advertisement/advertisement1.webp`, backgroundcolor: "#EDECD7"}
    const advertisement2: AdvertisementImg = {img: `${process.env.PUBLIC_URL}/womenImg/advertisement/advertisement2.webp`, backgroundcolor: "#B4B4CC"}
    const advertisement3: AdvertisementImg = {img: `${process.env.PUBLIC_URL}/womenImg/advertisement/advertisement3.webp`, backgroundcolor: "#D69EC7"}
    const advertisement4: AdvertisementImg = {img: `${process.env.PUBLIC_URL}/womenImg/advertisement/advertisement4.webp`, backgroundcolor: "#E3E6F8"}
    const advertisement5: AdvertisementImg = {img: `${process.env.PUBLIC_URL}/womenImg/advertisement/advertisement5.webp`, backgroundcolor: "#DBC5D5"}
    const advertisement6: AdvertisementImg = {img: `${process.env.PUBLIC_URL}/womenImg/advertisement/advertisement6.webp`, backgroundcolor: "#6B9A9C"}
    const advertisement7: AdvertisementImg = {img: `${process.env.PUBLIC_URL}/womenImg/advertisement/advertisement7.webp`, backgroundcolor: "#7BA699"}

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
    }if (num === 6) {
        return(<Advertisement advertisement={advertisement6} />);
    }if (num === 7) {
        return(<Advertisement advertisement={advertisement7} />);
    }else {
        return(<></>);
    }
}

export default WomenAdvertisement;