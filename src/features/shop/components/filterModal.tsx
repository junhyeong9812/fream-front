import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faCheck } from "@fortawesome/free-solid-svg-icons";
import styles from "./filterModal.module.css";
import {
  ButtonOption,
  CategoryDataItem,
  CategoryDto,
  ColorOption,
  FilterDataType,
  FilterModalProps,
  SelectedFiltersPayload,
} from "../types/filterTypes";
import {
  fetchFilterData,
  getFilteredProductsCount,
  prepareFilterPayload,
  resetFilters,
} from "../services/filterService";
import { useSearchParams } from "react-router-dom";

// Initial filter values
const initialFilters = {
  categories: [],
  gender: null,
  colors: [],
  priceRange: null,
  sizes: [],
  brands: [],
};

const FilterModal: React.FC<FilterModalProps> = ({
  open,
  onClose,
  onApplyFilters,
  categoryList,
  outerwearList,
  shirtsList,
}) => {
  // State for accordion sections
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [genderOpen, setGenderOpen] = useState(true);
  const [colorOpen, setColorOpen] = useState(false);
  const [discountOpen, setDiscountOpen] = useState(true);
  const [brandOpen, setBrandOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);

  // State for filter values
  const [modalFilters, setModalFilters] = useState(initialFilters);
  const [showMore, setShowMore] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  // State for filter data and product count
  const [filterData, setFilterData] = useState<FilterDataType>({
    sizes: {},
    genders: [],
    colors: [],
    discounts: [],
    priceRanges: [],
    categories: [],
  });
  const [categoryData, setCategoryData] = useState<CategoryDataItem[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, Set<string>>
  >({});
  const [filteredProductCount, setFilteredProductCount] = useState<number>(0);
  const [searchParams] = useSearchParams();

  // Get filter data on component mount
  useEffect(() => {
    const getFilterData = async () => {
      const data = await fetchFilterData();
      setFilterData(data);

      // Process category data from API response
      if (data.categories) {
        const newCategoryData: CategoryDataItem[] = data.categories.map(
          (category: CategoryDto) => ({
            name: category.label,
            options: category.subCategories
              ? category.subCategories.map((sub) => ({
                  label: sub.label,
                  value: String(sub.id),
                }))
              : [],
          })
        );
        setCategoryData(newCategoryData);
      }
    };

    getFilterData();
  }, []);

  // Update product count when filters change
  useEffect(() => {
    const updateProductCount = async () => {
      if (Object.keys(selectedFilters).length > 0) {
        const keyword = searchParams.get("keyword") || undefined;
        const payload = prepareFilterPayload(selectedFilters, keyword);
        const count = await getFilteredProductsCount(payload);
        setFilteredProductCount(count);
      } else {
        setFilteredProductCount(0);
      }
    };

    updateProductCount();
  }, [selectedFilters, searchParams]);

  if (!open) return null;

  // Helper function to get gender label
  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case "MALE":
        return "남성";
      case "FEMALE":
        return "여성";
      case "KIDS":
        return "키즈";
      case "UNISEX":
        return "공용";
      default:
        return gender;
    }
  };

  // Brand list for testing
  const items = [
    "& Other Stories",
    "0104",
    "032c",
    "&",
    "Apple",
    "Banana",
    "123",
    "Zebra",
    "!start",
    "2001",
    "coca cola",
    "coca cola",
    "coca cola",
    "coca cola",
    "coca cola",
    "coca cola",
  ];

  // Color options
  const colors: ColorOption[] = [
    { name: "블랙", rgb: "rgb(0, 0, 0)" },
    { name: "그레이", rgb: "rgb(204, 204, 204)" },
    { name: "화이트", rgb: "rgb(255, 255, 255)" },
    { name: "아이보리", rgb: "rgb(244, 238, 221)" },
    { name: "베이지", rgb: "rgb(230, 194, 129)" },
    { name: "브라운", rgb: "rgb(102, 50, 3)" },
    { name: "카키", rgb: "rgb(143, 120, 75)" },
    { name: "그린", rgb: "rgb(0, 128, 0)" },
    { name: "라이트그린", rgb: "rgb(144, 238, 144)" },
    { name: "민트", rgb: "rgb(114, 213, 192)" },
    { name: "네이비", rgb: "rgb(0, 0, 128)" },
    { name: "블루", rgb: "rgb(43, 50, 243)" },
    { name: "스카이블루", rgb: "rgb(135, 206, 235)" },
    { name: "퍼플", rgb: "rgb(128, 0, 128)" },
    { name: "핑크", rgb: "rgb(255, 192, 203)" },
    { name: "레드", rgb: "rgb(255, 0, 0)" },
    { name: "오렌지", rgb: "rgb(255, 165, 0)" },
    { name: "옐로우", rgb: "rgb(255, 255, 0)" },
    { name: "실버", img: "/shopcolorimg/silver.png" },
    { name: "골드", img: "/shopcolorimg/gold.png" },
    { name: "믹스", img: "/shopcolorimg/mixColor.png" },
  ];

  // Visible categories based on 'showMore' state
  const visibleCategories = showMore ? categoryData : categoryData.slice(0, 2);

  // Group items (for brand display)
  const groupItems = (items: string[]) => {
    const sortedItems = [...items].sort();
    const grouped: { [key: string]: string[] } = {};

    sortedItems.forEach((item) => {
      const firstChar = item[0].toUpperCase();
      if (!grouped[firstChar]) {
        grouped[firstChar] = [];
      }
      grouped[firstChar].push(item);
    });

    return grouped;
  };

  const groupedItems = groupItems(items);
  const groupKeys = Object.keys(groupedItems);

  // Handle filter selection
  const handleFilterClick = (category: string, value: string) => {
    setSelectedFilters((prevFilters) => {
      const newFilters = { ...prevFilters };

      if (category === "gender" || category === "priceRange") {
        // For single-select categories, create new set or reset if already selected
        if (newFilters[category]?.has(value)) {
          newFilters[category] = new Set();
        } else {
          newFilters[category] = new Set([value]);
        }
      } else {
        // For multi-select categories, toggle the selection
        if (!newFilters[category]) {
          newFilters[category] = new Set();
        } else {
          newFilters[category] = new Set(newFilters[category]);
        }

        if (newFilters[category].has(value)) {
          newFilters[category].delete(value);
        } else {
          newFilters[category].add(value);
        }
      }

      // If a category set is empty, remove it from filters
      if (newFilters[category].size === 0) {
        delete newFilters[category];
      }

      return newFilters;
    });
  };

  // Handle 'select all' button
  const handleSelectAll = (category: string, options: ButtonOption[]) => {
    setSelectedFilters((prevFilters) => {
      const isAllSelected = options.every((item) =>
        prevFilters[category]?.has(item.value)
      );

      if (isAllSelected) {
        const updatedFilters = { ...prevFilters };
        delete updatedFilters[category]; // Remove category if all selected
        return updatedFilters;
      } else {
        // Select all options for the category
        return {
          ...prevFilters,
          [category]: new Set(options.map((item) => item.value)),
        };
      }
    });
  };

  // Handle filter removal
  const handleRemoveFilter = (category: string, value: string) => {
    setSelectedFilters((prevFilters) => {
      const newFilters = { ...prevFilters };

      if (newFilters[category]) {
        newFilters[category].delete(value);

        // Remove category if empty
        if (newFilters[category].size === 0) {
          delete newFilters[category];
        }
      }

      return { ...newFilters };
    });
  };

  // Handle filter reset
  const handleResetFilters = async () => {
    setSelectedFilters({});
    setFilteredProductCount(0);
    await resetFilters();
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    const keyword = searchParams.get("keyword") || undefined;
    const payload = prepareFilterPayload(selectedFilters, keyword);
    onApplyFilters(payload);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalWrapper}>
        <div className={styles.modalContainer}>
          <div className={styles.modalBackground} onClick={onClose} />
          <div className={styles.modalInner}>
            <button className={styles.closeButton} onClick={onClose}>
              ×
            </button>

            <div className={styles.modalHeader}>
              <h2 className={styles.modalHeaderTitle}>필터</h2>
            </div>

            <div className={styles.modalContent}>
              {/* Category filter */}
              <div className={styles.filterSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3 className={styles.sectionTitle}>카테고리</h3>
                    {!categoryOpen && (
                      <p className={styles.sectionSubtitle}>모든 카테고리</p>
                    )}
                  </div>
                  <FontAwesomeIcon
                    icon={categoryOpen ? faMinus : faPlus}
                    onClick={() => setCategoryOpen(!categoryOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {categoryOpen &&
                  visibleCategories.map(({ name, options }) => {
                    const allSelected = options.every((item) =>
                      selectedFilters[name]?.has(item.value)
                    );
                    return (
                      <div key={name}>
                        <div className={styles.subhead}>
                          <p className={styles.subheading}>{name}</p>
                          <button
                            className={styles.btnMultiple}
                            onClick={() => handleSelectAll(name, options)}
                          >
                            {allSelected ? "모두 해제" : "모두 선택"}
                          </button>
                        </div>
                        <div className={styles.sectionContent}>
                          {options.map((item) => (
                            <label key={item.value} className={styles.bubble}>
                              <button
                                className={`${styles.filterButton} ${
                                  selectedFilters[name]?.has(item.value)
                                    ? styles.filterButtonSelected
                                    : ""
                                }`}
                                onClick={() =>
                                  handleFilterClick(name, item.value)
                                }
                              >
                                {item.label}
                              </button>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                {/* Show more button */}
                {!showMore && categoryData.length > 2 && (
                  <button
                    className={styles.seeCategory}
                    onClick={() => setShowMore(true)}
                  >
                    더보기
                  </button>
                )}
              </div>

              {/* Gender filter */}
              <div className={styles.filterSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3 className={styles.sectionTitle}>성별</h3>
                    {!genderOpen && (
                      <p className={styles.sectionSubtitle}>모든 성별</p>
                    )}
                  </div>
                  <FontAwesomeIcon
                    icon={genderOpen ? faMinus : faPlus}
                    onClick={() => setGenderOpen(!genderOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {genderOpen && (
                  <div>
                    <p className={styles.subheading}>성별</p>
                    <div className={styles.sectionContent}>
                      {filterData.genders.map((gender) => (
                        <label className={styles.bubble} key={gender}>
                          <button
                            className={`${styles.filterButton} ${
                              selectedFilters.gender?.has(gender)
                                ? styles.filterButtonSelected
                                : ""
                            }`}
                            onClick={() => handleFilterClick("gender", gender)}
                          >
                            {getGenderLabel(gender)}
                          </button>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Color filter */}
              <div className={styles.filterSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3 className={styles.sectionTitle}>색상</h3>
                    {!colorOpen && (
                      <p className={styles.sectionSubtitle}>모든 색상</p>
                    )}
                  </div>
                  <FontAwesomeIcon
                    icon={colorOpen ? faMinus : faPlus}
                    onClick={() => setColorOpen(!colorOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {colorOpen && (
                  <div>
                    <div
                      className={`${styles.sectionContent} ${styles.colorGrid}`}
                    >
                      {colors.map((color, index) => (
                        <label className={styles.filterShortcut} key={index}>
                          <div
                            className={styles.colorBox}
                            style={{
                              backgroundColor: color.rgb,
                            }}
                            onClick={() =>
                              handleFilterClick("color", color.name)
                            }
                          >
                            {color.img && (
                              <img
                                src={color.img}
                                alt={color.name}
                                className={styles.imageStyle}
                              />
                            )}
                            {selectedFilters.color?.has(color.name) && (
                              <FontAwesomeIcon
                                icon={faCheck}
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  color: [
                                    "화이트",
                                    "아이보리",
                                    "옐로우",
                                  ].includes(color.name)
                                    ? "black"
                                    : "white",
                                  fontSize: "1.2em",
                                }}
                              />
                            )}
                          </div>
                          <div className={styles.titleColor}>
                            <p className={styles.titleColorText}>
                              {color.name}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Discount/Benefit filter */}
              <div className={styles.filterSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3 className={styles.sectionTitle}>혜택/할인</h3>
                    {!discountOpen && (
                      <p className={styles.sectionSubtitle}>모든 혜택/할인</p>
                    )}
                  </div>
                  <FontAwesomeIcon
                    icon={discountOpen ? faMinus : faPlus}
                    onClick={() => setDiscountOpen(!discountOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {discountOpen &&
                  filterData.discounts &&
                  filterData.discounts.map((filter, index) => (
                    <div key={index}>
                      <div className={styles.subhead}>
                        <p className={styles.subheading}>{filter.title}</p>
                        <button
                          className={styles.btnMultiple}
                          onClick={() =>
                            handleSelectAll(
                              filter.title,
                              filter.options.map((option) => ({
                                value: option,
                                label: option,
                              }))
                            )
                          }
                        >
                          {filter.options.every((option) =>
                            selectedFilters[filter.title]?.has(option)
                          )
                            ? "모두 해제"
                            : "모두 선택"}
                        </button>
                      </div>
                      <div className={styles.sectionContent}>
                        {filter.options.map((option, idx) => (
                          <label className={styles.bubble} key={idx}>
                            <button
                              className={`${styles.filterButton} ${
                                selectedFilters[filter.title]?.has(option)
                                  ? styles.filterButtonSelected
                                  : ""
                              }`}
                              onClick={() =>
                                handleFilterClick(filter.title, option)
                              }
                            >
                              {option}
                            </button>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Brand filter */}
              <div className={styles.filterSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3 className={styles.sectionTitle}>브랜드</h3>
                    {!brandOpen && (
                      <p className={styles.sectionSubtitle}>모든 브랜드</p>
                    )}
                  </div>
                  <FontAwesomeIcon
                    icon={brandOpen ? faMinus : faPlus}
                    onClick={() => setBrandOpen(!brandOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {brandOpen && (
                  <div className={styles.scrollableList}>
                    {groupKeys.map((key, index) => (
                      <div key={index}>
                        {/* Group title */}
                        <div className={styles.groupTitle}>{key}</div>

                        {/* Group items */}
                        {groupedItems[key].map((item, itemIndex) => (
                          <div key={itemIndex} className={styles.item}>
                            {item}
                          </div>
                        ))}

                        {/* Divider */}
                        <hr className={styles.divider} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Collection filter */}
              <div className={styles.filterSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3 className={styles.sectionTitle}>컬렉션</h3>
                    {!collectionOpen && (
                      <p className={styles.sectionSubtitle}>모든 컬렉션</p>
                    )}
                  </div>
                  <FontAwesomeIcon
                    icon={collectionOpen ? faMinus : faPlus}
                    onClick={() => setCollectionOpen(!collectionOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {collectionOpen && <div></div>}
              </div>

              {/* Size filter */}
              <div className={styles.filterSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3 className={styles.sectionTitle}>사이즈</h3>
                    {!sizeOpen && (
                      <p className={styles.sectionSubtitle}>모든 사이즈</p>
                    )}
                  </div>
                  <FontAwesomeIcon
                    icon={sizeOpen ? faMinus : faPlus}
                    onClick={() => setSizeOpen(!sizeOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {sizeOpen && (
                  <div>
                    {Object.entries(filterData.sizes).map(
                      ([category, sizes]) => (
                        <div key={category}>
                          <p className={styles.subheading}>
                            {category === "CLOTHING"
                              ? "의류"
                              : category === "SHOES"
                              ? "신발"
                              : "액세서리"}
                          </p>

                          <div className={styles.sectionContent}>
                            {sizes.map((option, idx) => (
                              <label className={styles.bubble} key={idx}>
                                <button
                                  className={`${styles.filterButton} ${
                                    selectedFilters[category]?.has(option)
                                      ? styles.filterButtonSelected
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleFilterClick(category, option)
                                  }
                                >
                                  {option}
                                </button>
                              </label>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Price range filter */}
              <div className={styles.filterSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h3 className={styles.sectionTitle}>가격대</h3>
                    {!priceOpen && (
                      <p className={styles.sectionSubtitle}>모든 가격대</p>
                    )}
                  </div>
                  <FontAwesomeIcon
                    icon={priceOpen ? faMinus : faPlus}
                    onClick={() => setPriceOpen(!priceOpen)}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                {priceOpen && (
                  <div>
                    <p className={styles.subheading}>가격대</p>
                    <div className={styles.sectionContent}>
                      {filterData.priceRanges.map((range, index) => {
                        const isSelected =
                          selectedFilters.priceRange?.has(range.value) ?? false;
                        return (
                          <label className={styles.bubble} key={index}>
                            <button
                              className={`${styles.filterButton} ${
                                isSelected ? styles.filterButtonSelected : ""
                              }`}
                              onClick={() =>
                                handleFilterClick("priceRange", range.value)
                              }
                            >
                              {range.label}
                            </button>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Selected filters display */}
            <div className={styles.filterContainer}>
              <ul className={styles.filterTagsList}>
                {Object.entries(selectedFilters).map(([category, values]) =>
                  Array.from(values).map((value) => (
                    <li
                      key={`${category}-${value}`}
                      className={styles.filterTag}
                    >
                      <span>{value}</span>
                      <button
                        className={styles.removeButton}
                        onClick={() => handleRemoveFilter(category, value)}
                      >
                        ✕
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Footer with action buttons */}
            <div className={styles.modalFooter}>
              <button className={styles.btnReset} onClick={handleResetFilters}>
                초기화
              </button>
              <button className={styles.btnSubmit} onClick={handleApplyFilters}>
                {filteredProductCount > 0
                  ? `${filteredProductCount}개 상품보기`
                  : "상품보기"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
