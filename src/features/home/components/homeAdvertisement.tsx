import React from "react"
import Advertisement from "../../common/components/advertisement";
import { AdvertisementImg, AdvertisementNum } from "../types/homeTypes";

const HomeAdvertisement: React.FC<AdvertisementNum> = ({ num }) => {

    const advertisement1: AdvertisementImg = {img: `${process.env.PUBLIC_URL}/mainImg/advertisement/advertisement1.webp`, backgroundcolor: "#96A8B8"}
    const advertisement2: AdvertisementImg = {img: `${process.env.PUBLIC_URL}/mainImg/advertisement/advertisement2.webp`, backgroundcolor: "#5D6657"}
    const advertisement3: AdvertisementImg = {img: `${process.env.PUBLIC_URL}/mainImg/advertisement/advertisement3.webp`, backgroundcolor: "#760000"}
    const advertisement4: AdvertisementImg = {img: `${process.env.PUBLIC_URL}/mainImg/advertisement/advertisement4.webp`, backgroundcolor: "#97A4AE"}
    const advertisement5: AdvertisementImg = {img: `${process.env.PUBLIC_URL}/mainImg/advertisement/advertisement5.webp`, backgroundcolor: "#838383"}
    const advertisement6: AdvertisementImg = {img: `${process.env.PUBLIC_URL}/mainImg/advertisement/advertisement6.webp`, backgroundcolor: "#252828"}
    const advertisement7: AdvertisementImg = {img: `${process.env.PUBLIC_URL}/mainImg/advertisement/advertisement7.webp`, backgroundcolor: "#8AAAB8"}

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

export default HomeAdvertisement;