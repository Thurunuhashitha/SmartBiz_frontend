import React, { useState } from "react";
import NavBar from "../../components/nav/NavBar";

export default function ProductCRUD() {
  const token = localStorage.getItem("token");

  // Visibility states
  const [showAdd, setShowAdd] = useState(false);
  const [showGetById, setShowGetById] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Form state
  const [id, setId] = useState("");
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [supplier, setSupplier] = useState("");
  const [date_added, setDateAdded] = useState("");

  // Product list for "Get All"
  const [allProducts, setAllProducts] = useState([]);

  // Add Product
  const addProduct = async () => {
    if (!product || !price || !stock || !supplier || !date_added) {
      alert("Please fill all fields");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/product/createProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product,
          price: Number(price),
          stock: Number(stock),
          supplier,
          date_added,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Product added successfully");
        setProduct(""); setPrice(""); setStock(""); setSupplier(""); setDateAdded("");
      } else {
        alert(data.error || "Failed to add product");
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Failed to add product");
    }
  };

  // Get All Products
  const getAllProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/product/getAllProducts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok || !data.error) {
        setAllProducts(data);
      } else {
        alert(data.error || "Failed to fetch products");
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Failed to fetch products");
    }
  };

  // Get Product By ID
  const getProductById = async () => {
    if (!id) { alert("Enter product ID"); return; }
    try {
      const response = await fetch(`http://localhost:3000/product/getProductById/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setAllProducts([data]); // show single product in table
      } else {
        alert(data.error || "Failed to fetch product");
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Failed to fetch product");
    }
  };

  // Update Product
  const updateProduct = async () => {
    if (!id) { alert("Enter product ID"); return; }
    try {
      const response = await fetch(`http://localhost:3000/product/updateProduct/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product, price: Number(price), stock: Number(stock), supplier, date_added
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Product updated successfully");
      } else {
        alert(data.error || "Failed to update product");
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Failed to update product");
    }
  };

  // Delete Product
  const deleteProduct = async () => {
    if (!id) { alert("Enter product ID"); return; }
    try {
      const response = await fetch(`http://localhost:3000/product/deleteProduct${id}1`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        alert("Product deleted successfully");
        setId("");
      } else {
        alert(data.error || "Failed to delete product");
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Failed to delete product");
    }
  };

  return (
    <div>
      <NavBar />
      <h1>Product CRUD Dashboard</h1>

      {/* Buttons to toggle sections */}
      <button onClick={() => setShowAdd(!showAdd)}>Add Product</button>
      <button onClick={getAllProducts}>Get All Products</button>
      <button onClick={() => setShowGetById(!showGetById)}>Get Product By ID</button>
      <button onClick={() => setShowUpdate(!showUpdate)}>Update Product</button>
      <button onClick={() => setShowDelete(!showDelete)}>Delete Product</button>

      <hr />

      {/* Add Section */}
      {showAdd && (
        <div>
          <input placeholder="Product Name" value={product} onChange={(e) => setProduct(e.target.value)} />
          <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
          <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
          <input placeholder="Supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
          <input type="date" value={date_added} onChange={(e) => setDateAdded(e.target.value)} />
          <button onClick={addProduct}>Confirm Add</button>
        </div>
      )}

      {/* Get By ID Section */}
      {showGetById && (
        <div>
          <input type="number" placeholder="Product ID" value={id} onChange={(e) => setId(e.target.value)} />
          <button onClick={getProductById}>Get Product</button>
        </div>
      )}

      {/* Update Section */}
      {showUpdate && (
        <div>
          <input type="number" placeholder="Product ID" value={id} onChange={(e) => setId(e.target.value)} />
          <input placeholder="Product Name" value={product} onChange={(e) => setProduct(e.target.value)} />
          <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
          <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
          <input placeholder="Supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
          <input type="date" value={date_added} onChange={(e) => setDateAdded(e.target.value)} />
          <button onClick={updateProduct}>Confirm Update</button>
        </div>
      )}

      {/* Delete Section */}
      {showDelete && (
        <div>
          <input type="number" placeholder="Product ID" value={id} onChange={(e) => setId(e.target.value)} />
          <button onClick={deleteProduct}>Confirm Delete</button>
        </div>
      )}

      <hr />

      {/* Display Products Table */}
      {allProducts.length > 0 && (
        <table border="1" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Supplier</th>
              <th>Date Added</th>
            </tr>
          </thead>
          <tbody>
            {allProducts.map((p) => (
              <tr key={p.pID}>
                <td>{p.pID}</td>
                <td>{p.product}</td>
                <td>{p.price}</td>
                <td>{p.stock}</td>
                <td>{p.supplier}</td>
                <td>{p.date_added}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}