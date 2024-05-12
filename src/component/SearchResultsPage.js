import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useSearch from "./useSearch";
import { Link } from "react-router-dom";
import "./style.scss";
import { formatter } from "../utils/formater";

const SearchResultsPage = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    fetchSearchResults,
    isSearching,
  } = useSearch();
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("query");
    const page = parseInt(params.get("page") || "1", 10);
    if (query) {
      setSearchQuery(decodeURIComponent(query));
      setCurrentPage(page);
      fetchSearchResults();
    }
  }, [location.search]);

  // Tính toán tổng số trang
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);

  const startIndex = (currentPage - 1) * resultsPerPage;
  const currentResults = searchResults.slice(
    startIndex,
    startIndex + resultsPerPage
  );

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          disabled={currentPage === i}
        >
          {i}
        </button>
      );
    }
    return <div className="pagination">{pages}</div>; // Sử dụng class 'pagination'
  };

  return (
    <div className="container">
      <div className="featured">
        <div className="section-title">
          <h2>Kết quả tìm kiếm</h2>
        </div>
        {isSearching ? (
          <div>Loading...</div>
        ) : currentResults.length > 0 ? (
          <div className="products">
            {currentResults.map((result) => (
              <Link
                to={`/product/${result.id}`}
                key={result.id}
                style={{ textDecoration: "none" }}
              >
                <div className="product">
                  {result.price && result.price.phanTramGiamGia > 0 && (
                    <div className="discount">
                      - {result.price.phanTramGiamGia}%
                    </div>
                  )}
                  <img src={result.imageUrl[0]} alt={result.tenSanPham} />
                  <h3 className="product-name">{result.tenSanPham}</h3>
                  <div className="price">
                    <span className="current-price">
                      {formatter(result.price.giaTienHienTai)}
                    </span>
                    <span className="original-price">
                      {formatter(result.price.giaTienGoc)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div>No results found.</div>
        )}
        {renderPagination()}
      </div>
    </div>
  );
};

export default SearchResultsPage;
