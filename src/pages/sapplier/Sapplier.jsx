import React, { useState } from "react";
import NavBar from "../../components/nav/NavBar";

export default function SupplierCRUD() {

  const token = localStorage.getItem("token");

  const [showCreate, setShowCreate] = useState(false);
  const [showGetById, setShowGetById] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [product, setProduct] = useState("");
  const [phone, setPhone] = useState("");

  const [suppliers, setSuppliers] = useState([]);

  // CREATE SUPPLIER
  const createSupplier = async () => {
    try {

      const response = await fetch("http://localhost:3000/supplier/createSupplier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          product,
          phone
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Supplier created successfully");
        setName("");
        setProduct("");
        setPhone("");
      } else {
        alert(data.error);
      }

    } catch (error) {
      console.log(error);
      alert("Error creating supplier");
    }
  };

  // GET ALL SUPPLIERS
  const getAllSuppliers = async () => {

    try {

      const response = await fetch("http://localhost:3000/supplier/getAllSuppliers", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      setSuppliers(data);

    } catch (error) {
      console.log(error);
      alert("Error fetching suppliers");
    }
  };

  // GET SUPPLIER BY ID
  const getSupplierById = async () => {

    try {

      const response = await fetch(`http://localhost:3000/supplier/getSupplierById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      setSuppliers([data]);

    } catch (error) {
      console.log(error);
      alert("Error fetching supplier");
    }
  };

  // UPDATE SUPPLIER
  const updateSupplier = async () => {

    try {

      const response = await fetch(`http://localhost:3000/supplier/updateSupplier/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          product,
          phone
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Supplier updated successfully");
      } else {
        alert(data.error);
      }

    } catch (error) {
      console.log(error);
      alert("Error updating supplier");
    }
  };

  // DELETE SUPPLIER
  const deleteSupplier = async () => {

    try {

      const response = await fetch(`http://localhost:3000/supplier/deleteSupplier/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert("Supplier deleted successfully");
        setId("");
      } else {
        alert(data.error);
      }

    } catch (error) {
      console.log(error);
      alert("Error deleting supplier");
    }
  };

  return (
    <div>
      <NavBar />
      <h1>Supplier CRUD Page</h1>

      <button onClick={() => setShowCreate(!showCreate)}>Create Supplier</button>
      <button onClick={getAllSuppliers}>Get All Suppliers</button>
      <button onClick={() => setShowGetById(!showGetById)}>Get Supplier By ID</button>
      <button onClick={() => setShowUpdate(!showUpdate)}>Update Supplier</button>
      <button onClick={() => setShowDelete(!showDelete)}>Delete Supplier</button>

      <hr/>

      {/* CREATE */}

      {showCreate && (
        <div>

          <h3>Create Supplier</h3>

          <input
            type="text"
            placeholder="Supplier Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Product"
            value={product}
            onChange={(e)=>setProduct(e.target.value)}
          />

          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
          />

          <button onClick={createSupplier}>Submit</button>

        </div>
      )}

      {/* GET BY ID */}

      {showGetById && (
        <div>

          <h3>Get Supplier By ID</h3>

          <input
            type="number"
            placeholder="Supplier ID"
            value={id}
            onChange={(e)=>setId(e.target.value)}
          />

          <button onClick={getSupplierById}>Search</button>

        </div>
      )}

      {/* UPDATE */}

      {showUpdate && (
        <div>

          <h3>Update Supplier</h3>

          <input
            type="number"
            placeholder="Supplier ID"
            value={id}
            onChange={(e)=>setId(e.target.value)}
          />

          <input
            type="text"
            placeholder="Supplier Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Product"
            value={product}
            onChange={(e)=>setProduct(e.target.value)}
          />

          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
          />

          <button onClick={updateSupplier}>Update</button>

        </div>
      )}

      {/* DELETE */}

      {showDelete && (
        <div>

          <h3>Delete Supplier</h3>

          <input
            type="number"
            placeholder="Supplier ID"
            value={id}
            onChange={(e)=>setId(e.target.value)}
          />

          <button onClick={deleteSupplier}>Delete</button>

        </div>
      )}

      <hr/>

      {/* TABLE */}

      {suppliers.length > 0 && (

        <table border="1">

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Product</th>
              <th>Phone</th>
            </tr>
          </thead>

          <tbody>

            {suppliers.map((s)=>(
              <tr key={s.sID}>
                <td>{s.sID}</td>
                <td>{s.name}</td>
                <td>{s.product}</td>
                <td>{s.phone}</td>
              </tr>
            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}