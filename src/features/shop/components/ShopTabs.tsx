import React, { useState, useEffect } from "react";
import { useHeader } from "src/global/context/HeaderContext";
import { fetchFilterData } from "../services/filterService";
import styles from "./shopTabs.module.css";

interface CategoryItem {
  id: number;
  value: string;
  label: string;
  subCategories: CategoryItem[] | null;
}

interface TabMenuItem {
  id: string;
  label: string;
  filterValue: string;
}

interface ShopTabsProps {
  activeTabId: string;
  onTabClick: (tabId: string, filterValue: string) => void;
}

const ShopTabs: React.FC<ShopTabsProps> = ({ activeTabId, onTabClick }) => {
  const [tabMenuData, setTabMenuData] = useState<TabMenuItem[]>([
    { id: "all", label: "전체", filterValue: "" },
  ]);
  const { headerHeight } = useHeader();

  useEffect(() => {
    // API에서 카테고리 데이터 가져오기
    const loadCategories = async () => {
      try {
        const filterData = await fetchFilterData();

        // 탭 메뉴 아이템 생성
        const tabs: TabMenuItem[] = [
          { id: "all", label: "전체", filterValue: "" }, // 기본 "all" 탭
        ];

        // API에서 가져온 카테고리 처리
        filterData.categories.forEach((category) => {
          // 상위 카테고리 추가
          tabs.push({
            id: category.value.toLowerCase(),
            label: category.label,
            filterValue: category.id.toString(),
          });

          // 서브카테고리 중 subCategories가 null인 항목만 추가
          if (category.subCategories) {
            category.subCategories.forEach((subCategory) => {
              if (subCategory.subCategories === null) {
                tabs.push({
                  id: subCategory.value.toLowerCase().replace(/\s+/g, "_"),
                  label: subCategory.label,
                  filterValue: subCategory.id.toString(),
                });
              }
            });
          }
        });

        setTabMenuData(tabs);
      } catch (error) {
        console.error("카테고리 로드 실패:", error);
        // API 호출 실패 시 기본 탭 유지
      }
    };

    loadCategories();
  }, []);

  // 탭 클릭 핸들러
  const handleTabClick = (tabId: string, filterValue: string) => {
    onTabClick(tabId, filterValue);
  };

  return (
    <nav className={styles.shopTab} style={{ top: `${headerHeight}px` }}>
      <div className={styles.tabs}>
        <ul className={styles.ulTab}>
          {tabMenuData.map((menu) => (
            <li key={menu.id} className={styles.liTab}>
              <button
                type="button"
                className={`${styles.tabLink} ${
                  activeTabId === menu.id ? styles.tabLinkActive : ""
                }`}
                onClick={() => handleTabClick(menu.id, menu.filterValue)}
              >
                {menu.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default ShopTabs;
