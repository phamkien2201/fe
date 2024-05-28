import React, { useState, useEffect } from "react";
import { Avatar, RadioGroup, Radio, FormControlLabel } from "@material-ui/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./UserScreen.css";
import ChangeInfoText from "./ChangesText";
import getCustomerID from "./APIcustumerIP";

import axios from "axios";

const UserScreen = () => {
  const [userData, setUserData] = useState({
    firstName: " ",
    lastName: " ",
    gender: " ",
    phoneNumber: " ",
    birthDay: "2024-05-11T04:59:54.344Z",
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        console.error("Access token not found!");
        return;
      }
      const email = sessionStorage.getItem("email");
      const response = await axios.get(
        "http://localhost:5002/api/customer?Email=" + email,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userDataFromApi = response.data.data;
      sessionStorage.setItem("customerId", userDataFromApi.id); // Lưu customerId vào sessionStorage
      setUserData({
        firstName: userDataFromApi.firstName, // Thay đổi tại đây
        lastName: userDataFromApi.lastName, // Và tại đây
        phoneNumber: userDataFromApi.phoneNumber,
        gender: userDataFromApi.gender,
        birthDay: new Date(userDataFromApi.birthDay),
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const saveUserDataToServer = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const customerId = await getCustomerID();
      const response = await axios.put(
        `http://localhost:5002/api/customer/info/${customerId}`,
        userData,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            body: JSON.stringify(userData),
          },
        }
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error saving user data to server:", error);
      throw error;
    }
  };

  const handleSaveChanges = async () => {
    try {
      console.log("Saving changes...", userData);
      await saveUserDataToServer(); // Save user data to server
      setIsEditMode(false);
      fetchUserData(); // Call fetchUserData again to update the data
    } catch (error) {
      console.error("Error saving changes:", error);
      // Handle error if needed
    }
  };

  const handleChange = (key, value) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      [key]: value,
    }));
  };

  const handleEditButtonClick = () => {
    setIsEditMode(true);
  };

  return (
    <div className="user-screen">
      <>
        <div className="title-profiles">Thông tin cá nhân</div>
        <div className="avatar-container">
          <Avatar
            alt="Avatar"
            src="https://th.bing.com/th/id/OIP.KdRE7KHqL-46M8nrvOX2CgAAAA?rs=1&pid=ImgDetMain"
            sx={{ width: 100, height: 100 }}
          />
        </div>
        <div className="user-info">
          <div className="info-item">
            <span className="label">Họ:</span>
            <div className="value">
              {!isEditMode ? (
                userData.lastName || "lastName"
              ) : (
                <input
                  type="text"
                  value={userData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                />
              )}
            </div>
          </div>{" "}
          <div className="info-item">
            <span className="label">Tên:</span>
            <div className="value">
              {!isEditMode ? (
                userData.firstName || "firstName"
              ) : (
                <input
                  type="text"
                  value={userData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                />
              )}
            </div>
          </div>
          <div className="info-item">
            <span className="label">Số điện thoại:</span>
            <div className="value">
              {!isEditMode ? (
                userData.phoneNumber || "phoneNumber"
              ) : (
                <input
                  type="text"
                  value={userData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                />
              )}
            </div>
          </div>
          <div className="info-item">
            <span className="label">Giới tính:</span>
            <div className="value">
              {!isEditMode ? (
                userData.gender != null ? (
                  userData.gender
                ) : (
                  <ChangeInfoText onClick={handleEditButtonClick} />
                )
              ) : (
                <RadioGroup
                  row
                  aria-label="gender"
                  name="gender"
                  value={userData.gender || ""}
                  onChange={(e) => handleChange("gender", e.target.value)}
                >
                  <FormControlLabel
                    value="Male"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="Female"
                    control={<Radio />}
                    label="Female"
                  />
                </RadioGroup>
              )}
            </div>
          </div>
          <div className="info-item">
            <span className="label">Ngày sinh:</span>
            <div className="value">
              {!isEditMode ? (
                userData.birthDay instanceof Date ? (
                  userData.birthDay.toLocaleDateString()
                ) : (
                  <ChangeInfoText onClick={handleEditButtonClick} />
                )
              ) : (
                <DatePicker
                  selected={userData.birthDay}
                  onChange={(date) => handleChange("birthDay", date)}
                  dateFormat="dd/MM/yyyy"
                />
              )}
            </div>
          </div>
        </div>
        <div className="update-buttons">
          {isEditMode ? (
            <>
              <button className="save-button" onClick={handleSaveChanges}>
                Cập nhật thông tin
              </button>
            </>
          ) : (
            <button className="updated-button" onClick={handleEditButtonClick}>
              Chỉnh sửa thông tin
            </button>
          )}
        </div>
      </>
    </div>
  );
};

export default UserScreen;
