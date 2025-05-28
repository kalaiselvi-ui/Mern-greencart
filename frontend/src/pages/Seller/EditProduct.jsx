import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { id } = useParams();
  const { axios, fetchProducts } = useAppContext();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/product/${id}`);
        setProduct(data.product);
      } catch (err) {
        toast.error("Failed to fetch product.");
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/product/${id}`, product);
      toast.success(data.message || "Product updated!");
      //   fetchProducts(); // optional
      navigate("/seller/product-list");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={product.name}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Product Name"
        />
        <input
          name="category"
          value={product.category}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Category"
        />
        <input
          name="offerPrice"
          value={product.offerPrice}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Price"
        />
        <textarea
          name="description"
          value={product.description?.join("\n") || ""}
          onChange={(e) =>
            setProduct({
              ...product,
              description: e.target.value.split("\n"),
            })
          }
          className="border p-2 w-full"
          rows={5}
          placeholder="Enter description (one per line)"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
