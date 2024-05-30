import axios from "axios";

const getCustomerID = async () => {
  const token = sessionStorage.getItem("accessToken");
  if (!token) {
    console.error("Access token not found!");
    return;
  }

  const email = sessionStorage.getItem("email");

  if (email === "admin@gmail.com") {
    console.log("Admin email detected, skipping customer ID retrieval.");
    return;
  }

  try {
    const response = await axios.get(
      `http://localhost:5002/api/customer?Email=${email}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const customerID = response.data.data.id;
    console.log("CustomerId:", customerID);
    return customerID;
  } catch (error) {
    console.error("Error fetching customer ID:", error);
  }
};

export default getCustomerID;
