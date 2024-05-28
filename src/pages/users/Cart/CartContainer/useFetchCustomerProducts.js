import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function useFetchCustomerProducts() {
  const { customerId } = useParams();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!customerId) return;

    const fetchCustomerProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5003/api/order/create-order/${customerId}`
        );
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching customer products data:", error);
        setError(error);
      }
    };

    fetchCustomerProducts();
  }, [customerId]);

  return { products, error };
}
