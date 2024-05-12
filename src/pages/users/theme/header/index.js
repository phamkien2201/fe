import React, { useEffect, useState, memo } from "react";
import "./style.scss";
import { BsCartFill, BsChevronDown, BsPersonCircle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import SearchComponent from "../../../../component/SearchComponent";
import { useCart } from "../../Cart/CartContainer/CartContext";

const Header = ({ userData, setUserData }) => {
  const [menus, setMenus] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [activeSubMenuId, setActiveSubMenuId] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { cartItems } = useCart();
  const navigate = useNavigate();
  useEffect(() => {
    const loggedInEmail = sessionStorage.getItem("email");
    if (loggedInEmail) {
      setLoggedInUser(loggedInEmail); // Lưu email vào state
      setIsLoggedIn(true);
    }
    if (userData) {
      console.log("User data:", userData);
      const userDataFromStorage = sessionStorage.getItem("userData");
      if (userDataFromStorage) {
        // Nếu có thông tin người dùng, cập nhật state
        setUserData(JSON.parse(userDataFromStorage));
      }
    }
  }, [userData]);

  const handleLogout = () => {
    // Xóa thông tin người dùng khỏi sessionStorage
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("userData"); // Xóa thông tin người dùng
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    setLoggedInUser("");
    setIsLoggedIn(false);
    // Chuyển hướng người dùng về trang đăng nhập
    navigate("/login");
  };

  const handleUserClick = () => {
    // Chuyển hướng đến tab menu
    navigate("/custumer");
  };

  useEffect(() => {
    const urls = [
      "http://localhost:5000/api/category?PageNumber=1",
      "http://localhost:5000/api/category?PageNumber=2",
      "http://localhost:5000/api/category?PageNumber=3",
      "http://localhost:5000/api/category?PageNumber=4",
      "http://localhost:5000/api/category?PageNumber=5",
      "http://localhost:5000/api/category?PageNumber=6",
      "http://localhost:5000/api/category?PageNumber=7",
      "http://localhost:5000/api/category?PageNumber=8",
    ];

    // Thực hiện tất cả các lời gọi API cùng một lúc
    Promise.all(urls.map((url) => fetch(url).then((res) => res.json())))
      .then((results) => {
        // Kết hợp tất cả các mảng 'data' từ từng response vào một mảng duy nhất
        const combinedData = results.flatMap((result) => result.data);

        // Tách menu chính dựa trên parentId
        const mainMenus = combinedData.filter(
          (item) => item.parentId === "00000000-0000-0000-0000-000000000000"
        );

        // Tạo Map để tìm nhanh submenu và sub-submenu
        let itemsMap = new Map(
          combinedData.map((item) => [item.id, { ...item, subMenus: [] }])
        );

        // Phân loại submenu và sub-submenu
        combinedData.forEach((item) => {
          if (
            item.parentId !== "00000000-0000-0000-0000-000000000000" &&
            itemsMap.has(item.parentId)
          ) {
            itemsMap.get(item.parentId).subMenus.push(item);
          }
        });

        // Bây giờ, chúng ta cần phân loại subMenus dựa trên parentId của chúng
        // Đối với mỗi subMenu, kiểm tra xem nó có phải là parent của subSubMenu nào không
        itemsMap.forEach((item, itemId, map) => {
          item.subMenus.forEach((subMenu, index) => {
            // Xác định subSubMenus cho subMenu này
            const subSubMenus = combinedData.filter(
              (i) => i.parentId === subMenu.id
            );
            // Gán subSubMenus vào subMenu
            item.subMenus[index] = { ...subMenu, subMenus: subSubMenus };
          });
        });

        // Gắn submenu và sub-submenu vào menu chính
        const organizedMenus = mainMenus.map((menu) => ({
          ...menu,
          subMenus: itemsMap.get(menu.id).subMenus,
        }));

        setMenus(organizedMenus);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleMenuMouseEnter = (menuId) => {
    setActiveMenuId(menuId);
    if (menus.length > 0) {
      const menu = menus.find((menu) => menu.id === menuId);
      if (menu && menu.subMenus.length > 0) {
        setActiveSubMenuId(menu.subMenus[0].id); // Automatically activate the first submenu
      }
    }
  };

  const handleSubMenuMouseEnter = (subMenuId, parentId) => {
    setActiveSubMenuId(subMenuId);
    setActiveMenuId(parentId);
  };

  const handleMouseLeave = () => {
    setActiveMenuId(null);
    setActiveSubMenuId(null);
  };

  return (
    <>
      <div className="header_top">
        <div className="container">
          <div className="row-header-top">
            <div className="col-6 header_top_left">
              <ul></ul>
            </div>
            <div className="col-6 header_top_right"></div>
          </div>
        </div>
      </div>
      <div className="container-header">
        <div className="row-header">
          <div className="col-xl-3 ">
            <div className="header_logo">
              <a href="/">
                <h1>Medicine Shopping App</h1>
              </a>
            </div>
          </div>
          <div className="col-xl-6 hero_search_container">
            <SearchComponent />
          </div>
          <div className="col-xl-3 ">
            <div className="header_cart">
              <ul>
                <li className="dropdown">
                  {isLoggedIn ? (
                    <div className="dropdown-content">
                      <h4 onClick={handleUserClick}>
                        <BsPersonCircle />
                        {loggedInUser}
                        <h4>{userData}</h4>
                      </h4>

                      <button className="logout" onClick={handleLogout}>
                        Đăng xuất
                      </button>
                    </div>
                  ) : (
                    <Link to="/login" className="login-link">
                      <BsPersonCircle />{" "}
                      <h4 className="underline-text"> Đăng nhập</h4>
                    </Link>
                  )}
                </li>
                <li className="dropdown">
                  <Link to="/cart" className="login-link">
                    <BsCartFill /> <h4 className="underline-text"> Giỏ hàng</h4>
                    <span>{cartItems.length}</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <ul className="menu">
          {menus.map((menu) => (
            <li
              key={menu.id}
              className="menu-item"
              onMouseEnter={() => handleMenuMouseEnter(menu.id)}
              onMouseLeave={handleMouseLeave}
            >
              <Link to={`/category/${menu.id}`}>
                {menu.name}
                <BsChevronDown />
              </Link>
              {activeMenuId === menu.id && (
                <ul className="sub-menu">
                  {menu.subMenus.map((subMenu) => (
                    <li
                      key={subMenu.id}
                      className="sub-menu-item"
                      onMouseEnter={() =>
                        handleSubMenuMouseEnter(subMenu.id, menu.id)
                      } // Thêm parentId ở đây
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link to={`/category/parentid/${subMenu.id}`}>
                        {subMenu.name}
                        <BsChevronDown />
                      </Link>
                      {activeSubMenuId === subMenu.id && (
                        <ul className="sub-sub-menu">
                          {subMenu.subMenus.map((subSubMenu) => (
                            <li key={subSubMenu.id}>
                              <Link to={`/product/categoryId/${subSubMenu.id}`}>
                                {subSubMenu.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default memo(Header);
