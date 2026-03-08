import React, { useState } from "react";
import NavBar from "../../components/nav/NavBar";

export default function SalesCRUD() {

  const token = localStorage.getItem("token");

  const [showCreate, setShowCreate] = useState(false);
  const [showGetById, setShowGetById] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [id, setId] = useState("");

  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [customer, setCustomer] = useState("");

  const [sales, setSales] = useState([]);

  // CREATE SALE
  const createSale = async () => {

    try {

      const response = await fetch("http://localhost:3000/sales/createSale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          product,
          quantity,
          price,
          date,
          customer
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Sale created successfully");
        setProduct("");
        setQuantity("");
        setPrice("");
        setDate("");
        setCustomer("");
      } else {
        alert(data.error);
      }

    } catch (error) {
      console.log(error);
      alert("Error creating sale");
    }
  };

  // GET ALL SALES
  const getAllSales = async () => {

    try {

      const response = await fetch("http://localhost:3000/sales/getAllSales", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      setSales(data);

    } catch (error) {
      console.log(error);
      alert("Error fetching sales");
    }
  };

  // GET SALE BY ID
  const getSaleById = async () => {

    try {

      const response = await fetch(`http://localhost:3000/sales/getSaleById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      setSales([data]);

    } catch (error) {
      console.log(error);
      alert("Error fetching sale");
    }
  };

  // UPDATE SALE
  const updateSale = async () => {

    try {

      const response = await fetch(`http://localhost:3000/sales/updateSale/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          product,
          quantity,
          price,
          date,
          customer
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Sale updated successfully");
      } else {
        alert(data.error);
      }

    } catch (error) {
      console.log(error);
      alert("Error updating sale");
    }
  };

  // DELETE SALE
  const deleteSale = async () => {

    try {

      const response = await fetch(`http://localhost:3000/sales/deleteSale/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert("Sale deleted successfully");
        setId("");
      } else {
        alert(data.error);
      }

    } catch (error) {
      console.log(error);
      alert("Error deleting sale");
    }
  };

  return (
    <div>
      <NavBar />
      <h1>Sales CRUD Page</h1>

      <button onClick={() => setShowCreate(!showCreate)}>Create Sale</button>
      <button onClick={getAllSales}>Get All Sales</button>
      <button onClick={() => setShowGetById(!showGetById)}>Get Sale By ID</button>
      <button onClick={() => setShowUpdate(!showUpdate)}>Update Sale</button>
      <button onClick={() => setShowDelete(!showDelete)}>Delete Sale</button>

      <hr/>

      {/* CREATE */}

      {showCreate && (
        <div>

          <h3>Create Sale</h3>

          <input
            type="text"
            placeholder="Product"
            value={product}
            onChange={(e)=>setProduct(e.target.value)}
          />

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e)=>setQuantity(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e)=>setPrice(e.target.value)}
          />

          <input
            type="date"
            value={date}
            onChange={(e)=>setDate(e.target.value)}
          />

          <input
            type="text"
            placeholder="Customer"
            value={customer}
            onChange={(e)=>setCustomer(e.target.value)}
          />

          <button onClick={createSale}>Submit</button>

        </div>
      )}

      {/* GET BY ID */}

      {showGetById && (
        <div>

          <h3>Get Sale By ID</h3>

          <input
            type="number"
            placeholder="Sale ID"
            value={id}
            onChange={(e)=>setId(e.target.value)}
          />

          <button onClick={getSaleById}>Search</button>

        </div>
      )}

      {/* UPDATE */}

      {showUpdate && (
        <div>

          <h3>Update Sale</h3>

          <input
            type="number"
            placeholder="Sale ID"
            value={id}
            onChange={(e)=>setId(e.target.value)}
          />

          <input
            type="text"
            placeholder="Product"
            value={product}
            onChange={(e)=>setProduct(e.target.value)}
          />

          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e)=>setQuantity(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e)=>setPrice(e.target.value)}
          />

          <input
            type="date"
            value={date}
            onChange={(e)=>setDate(e.target.value)}
          />

          <input
            type="text"
            placeholder="Customer"
            value={customer}
            onChange={(e)=>setCustomer(e.target.value)}
          />

          <button onClick={updateSale}>Update</button>

        </div>
      )}

      {/* DELETE */}

      {showDelete && (
        <div>

          <h3>Delete Sale</h3>

          <input
            type="number"
            placeholder="Sale ID"
            value={id}
            onChange={(e)=>setId(e.target.value)}
          />

          <button onClick={deleteSale}>Delete</button>

        </div>
      )}

      <hr/>

      {/* SALES TABLE */}

      {sales.length > 0 && (

        <table border="1">

          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Date</th>
              <th>Customer</th>
            </tr>
          </thead>

          <tbody>

            {sales.map((s)=>(
              <tr key={s.sID}>
                <td>{s.sID}</td>
                <td>{s.product}</td>
                <td>{s.quantity}</td>
                <td>{s.price}</td>
                <td>{s.date}</td>
                <td>{s.customer}</td>
              </tr>
            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}