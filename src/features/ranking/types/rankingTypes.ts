// ranking category
export interface rankingCategorySelect {
    select: string;
}
export type rankingCategoryInfo = string[];

// ranking brand
export interface rankingBrandInfo {
    polarity: boolean;
    porarityNum: string;
    logo: string;
    brandEng: string;
    brandKor: string;
    interest: string;
    imgs: string[];
}