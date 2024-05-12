import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatter } from "../../../../utils/formater";

function SubSubMenuDetails() {
  let { subSubMenuId } = useParams();
  const [subSubmenuDetails, setsubSubMenuDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `http://localhost:5000/api/product/categoryId?categoryId=${subSubMenuId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không có sản phẩm");
        }
        return response.json();
      })
      .then((data) => {
        setsubSubMenuDetails(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setError(error.message);
        setIsLoading(false);
      });
  }, [subSubMenuId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <div className="featured">
        <div className="section-title">
          <h2>Sản phẩm</h2>
        </div>
        {subSubmenuDetails && (
          <div className="products">
            {subSubmenuDetails.data.map((product, index) => (
              <Link
                to={`/product/${product.id}`}
                key={index}
                style={{ textDecoration: "none" }}
              >
                <div className="product">
                  {product.price && product.price.phanTramGiamGia > 0 && (
                    <div className="discount">
                      - {product.price.phanTramGiamGia}%
                    </div>
                  )}
                  <img src={product.imageUrl[0]} alt={product.tenSanPham} />
                  <h3 className="product-name">{product.tenSanPham}</h3>
                  <div className="price">
                    <span className="current-price">
                      {formatter(product.price.giaTienHienTai)}
                    </span>
                    <span className="original-price">
                      {formatter(product.price.giaTienGoc)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SubSubMenuDetails;
