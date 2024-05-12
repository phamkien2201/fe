import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./style.scss";

function SubMenuDetails() {
  let { subMenuId } = useParams();
  const [submenuDetails, setsubMenuDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:5000/api/category/parentid/${subMenuId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setsubMenuDetails(data);
        console.log("data:", data);
        console.log("name", subMenuId);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setError(error.message);
        setIsLoading(false);
      });
  }, [subMenuId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <div className="featured">
        {submenuDetails && (
          <div>
            <div className="section-title">
              <h2>Chi tiết Menu</h2>
            </div>
            <div className="submenus-1">
              {submenuDetails?.data.map((subMenu) => (
                <div className="submenu-item-1" key={subMenu.id}>
                  <Link to={`/product/categoryId/${subMenu.id}`}>
                    <h4>{subMenu.name}</h4>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubMenuDetails;
