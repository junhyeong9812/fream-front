import { ShortcutItems } from "../../home/types/homeTypes";
import { AdvertisementImg } from "../../home/types/homeTypes";
// homeTop
export interface TopProps {
  select: string;
}

// 배너
export interface BannerSelect {
  select: string;
}
export interface BannerItems {
  img: string;
  backgroundColor: string;
}

// shortcut

export interface ShortcutItemWrapProps {
  shortcutList: ShortcutItems[];
}
export interface ShortcutItemProps {
  shortcut: {
    img: string;
    name: string;
  };
}

// 광고

export interface AdvertisementProps {
  advertisement: AdvertisementImg;
}

// product
export interface productWrapProps {
  productCategory: string;
}
export interface productInfo {
  id: number;
  colorName: string;
  transaction: string;
  img: string;
  backgroundcolor: string;
  brand: string;
  name: string;
  price: string;
  buy: boolean;
  coupon: boolean;
  earn: boolean;
}

export interface productProps {
  product: productInfo;
}

// product loading
export interface productLoadingProps {
  select: string;
}

// ranking
export interface rankingTopProps {
  select: string;
}
export interface rankingWrapProps {
  select: string;
}
export interface rankingInfo {
  transaction: string;
  img: string;
  backgroundcolor: string;
  polarity: boolean;
  porarityNum: string;
  name: string;
  price: string;
}
export interface rankingProps {
  ranking: rankingInfo;
  rank: number;
}
