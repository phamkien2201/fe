import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Menudetails.scss";

function MenuDetails() {
  let { menuId } = useParams();
  const [menuDetails, setMenuDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:5000/api/category/parentid/${menuId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setMenuDetails(data);
        console.log("data:", data);
        console.log("name", menuId);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        setError(error.message);
        setIsLoading(false);
      });
  }, [menuId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <div className="featured">
        {menuDetails && (
          <div>
            <div className="section-title">
              <h2>Chi tiết Menu</h2>
            </div>
            <div className="container-submenu">
              <div className="submenus-1">
                {menuDetails?.data.map((subMenu) => (
                  <div className="submenu-item-1">
                    <Link to={`/category/parentid/${subMenu.id}`}>
                      <h4>{subMenu.name}</h4>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MenuDetails;
