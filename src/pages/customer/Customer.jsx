import React, { useState } from "react";
import NavBar from "../../components/nav/NavBar";

export default function CustomerCRUD() {

  const token = localStorage.getItem("token");

  const [showCreate, setShowCreate] = useState(false);
  const [showGetById, setShowGetById] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [customers, setCustomers] = useState([]);

  // CREATE CUSTOMER
  const createCustomer = async () => {
    try {
      const response = await fetch("http://localhost:3000/customer/createCustomer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          phone,
          email
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Customer created successfully");
        setName("");
        setPhone("");
        setEmail("");
      } else {
        alert(data.error);
      }

    } catch (error) {
      console.log(error);
      alert("Error creating customer");
    }
  };

  // GET ALL CUSTOMERS
  const getAllCustomers = async () => {
    try {
      const response = await fetch("http://localhost:3000/customer/getAllCustomers", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      setCustomers(data);

    } catch (error) {
      console.log(error);
      alert("Error fetching customers");
    }
  };

  // GET CUSTOMER BY ID
  const getCustomerById = async () => {
    try {
      const response = await fetch(`http://localhost:3000/customer/getCustomerById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      setCustomers([data]);

    } catch (error) {
      console.log(error);
      alert("Error fetching customer");
    }
  };

  // UPDATE CUSTOMER
  const updateCustomer = async () => {
    try {
      const response = await fetch(`http://localhost:3000/customer/updateCustomer/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          phone,
          email
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Customer updated successfully");
      } else {
        alert(data.error);
      }

    } catch (error) {
      console.log(error);
      alert("Error updating customer");
    }
  };

  // DELETE CUSTOMER
  const deleteCustomer = async () => {
    try {
      const response = await fetch(`http://localhost:3000/customer/deleteCustomer/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert("Customer deleted successfully");
        setId("");
      } else {
        alert(data.error);
      }

    } catch (error) {
      console.log(error);
      alert("Error deleting customer");
    }
  };

  return (
    <div>
      <NavBar />
      <h1>Customer CRUD Page</h1>

      <button onClick={() => setShowCreate(!showCreate)}>Create Customer</button>
      <button onClick={getAllCustomers}>Get All Customers</button>
      <button onClick={() => setShowGetById(!showGetById)}>Get Customer By ID</button>
      <button onClick={() => setShowUpdate(!showUpdate)}>Update Customer</button>
      <button onClick={() => setShowDelete(!showDelete)}>Delete Customer</button>

      <hr />

      {/* CREATE */}
      {showCreate && (
        <div>
          <h3>Create Customer</h3>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <button onClick={createCustomer}>Submit</button>
        </div>
      )}

      {/* GET BY ID */}
      {showGetById && (
        <div>

          <h3>Get Customer By ID</h3>

          <input
            type="number"
            placeholder="Customer ID"
            value={id}
            onChange={(e)=>setId(e.target.value)}
          />

          <button onClick={getCustomerById}>Search</button>

        </div>
      )}

      {/* UPDATE */}
      {showUpdate && (
        <div>

          <h3>Update Customer</h3>

          <input
            type="number"
            placeholder="Customer ID"
            value={id}
            onChange={(e)=>setId(e.target.value)}
          />

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <button onClick={updateCustomer}>Update</button>

        </div>
      )}

      {/* DELETE */}
      {showDelete && (
        <div>

          <h3>Delete Customer</h3>

          <input
            type="number"
            placeholder="Customer ID"
            value={id}
            onChange={(e)=>setId(e.target.value)}
          />

          <button onClick={deleteCustomer}>Delete</button>

        </div>
      )}

      <hr />

      {/* TABLE */}

      {customers.length > 0 && (
        <table border="1">

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>

            {customers.map((c)=>(
              <tr key={c.cID}>
                <td>{c.cID}</td>
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.email}</td>
              </tr>
            ))}

          </tbody>

        </table>
      )}

    </div>
  );
}