import React, { useState, useEffect, useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import useSearch from "./useSearch";
import "./style.scss";
import { Link } from "react-router-dom";
import { formatter } from "../utils/formater";

const SearchComponent = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    fetchSearchResults,
    isSearching,
  } = useSearch();
  const [showResults, setShowResults] = useState(true);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length > 2) {
      fetchSearchResults(value);
    }
    setShowResults(true);
  };

  const handleResultItemClick = () => {
    setShowResults(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  const handleSearchIconClick = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  const displayedResults =
    searchResults.length > 4 ? searchResults.slice(0, 4) : searchResults;
  const moreThanFour = searchResults.length > 4;

  return (
    <div className="hero_search_form">
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Tìm thuốc, bệnh lý, thực phẩm chức năng..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button type="submit" onClick={handleSearchIconClick}>
          <AiOutlineSearch />
        </button>
      </form>
      {isSearching && <div>Loading...</div>}
      {searchQuery && showResults && displayedResults.length > 0 && (
        <div className="search-results" ref={searchRef}>
          {displayedResults.map((result, index) => (
            <Link
              to={`/product/${result.id}`}
              key={index}
              style={{ textDecoration: "none" }}
            >
              <div className="result-item" onClick={handleResultItemClick}>
                <img src={result.imageUrl[0]} alt={result.tenSanPham} />
                <div className="result-info">
                  <h3 className="result-name">{result.tenSanPham}</h3>
                  <div className="price">
                    <span className="current-price">
                      {formatter(result.price.giaTienGoc)} / {result.quyCach}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {moreThanFour && (
            <div className="more-results">
              <Link to={`/search?query=${searchQuery}`}>Xem tất cả</Link>
            </div>
          )}
        </div>
      )}
      {searchQuery && !showResults && <div>Chữ tìm kiếm: {searchQuery}</div>}
    </div>
  );
};

export default SearchComponent;
