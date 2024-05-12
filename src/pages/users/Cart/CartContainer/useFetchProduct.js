import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function useFetchProduct() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/product/${productId}`
        );
        const data = await response.json();
        setProduct(data.data);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setError(error);
      }
    };

    fetchData();
  }, [productId]);

  return { product, error };
}
