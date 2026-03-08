import React, { useState } from "react";
import NavBar from "../../components/nav/NavBar";

export default function ExpenseCRUD() {

  const token = localStorage.getItem("token");

  const [showCreate, setShowCreate] = useState(false);
  const [showGetById, setShowGetById] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [id, setId] = useState("");

  const [expense, setExpense] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const [expenses, setExpenses] = useState([]);

  // CREATE EXPENSE
  const createExpense = async () => {

    try {

      const response = await fetch("http://localhost:3000/expense/createExpense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          expense,
          amount,
          date
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Expense created successfully");
        setExpense("");
        setAmount("");
        setDate("");
      } else {
        alert(data.error);
      }

    } catch (error) {
      console.log(error);
      alert("Error creating expense");
    }
  };

  // GET ALL EXPENSES
  const getAllExpenses = async () => {

    try {

      const response = await fetch("http://localhost:3000/expense/getAllExpenses", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      setExpenses(data);

    } catch (error) {
      console.log(error);
      alert("Error fetching expenses");
    }
  };

  // GET EXPENSE BY ID
  const getExpenseById = async () => {

    try {

      const response = await fetch(`http://localhost:3000/expense/getExpenseById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      setExpenses([data]);

    } catch (error) {
      console.log(error);
      alert("Error fetching expense");
    }
  };

  // UPDATE EXPENSE
  const updateExpense = async () => {

    try {

      const response = await fetch(`http://localhost:3000/expense/updateExpense/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          expense,
          amount,
          date
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Expense updated successfully");
      } else {
        alert(data.error);
      }

    } catch (error) {
      console.log(error);
      alert("Error updating expense");
    }
  };

  // DELETE EXPENSE
  const deleteExpense = async () => {

    try {

      const response = await fetch(`http://localhost:3000/expense/deleteExpense/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert("Expense deleted successfully");
        setId("");
      } else {
        alert(data.error);
      }

    } catch (error) {
      console.log(error);
      alert("Error deleting expense");
    }
  };

  return (
    <div>
      <NavBar/>
      <h1>Expense CRUD Page</h1>

      <button onClick={() => setShowCreate(!showCreate)}>Create Expense</button>
      <button onClick={getAllExpenses}>Get All Expenses</button>
      <button onClick={() => setShowGetById(!showGetById)}>Get Expense By ID</button>
      <button onClick={() => setShowUpdate(!showUpdate)}>Update Expense</button>
      <button onClick={() => setShowDelete(!showDelete)}>Delete Expense</button>

      <hr/>

      {/* CREATE */}

      {showCreate && (
        <div>

          <h3>Create Expense</h3>

          <input
            type="text"
            placeholder="Expense Name"
            value={expense}
            onChange={(e)=>setExpense(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e)=>setAmount(e.target.value)}
          />

          <input
            type="date"
            value={date}
            onChange={(e)=>setDate(e.target.value)}
          />

          <button onClick={createExpense}>Submit</button>

        </div>
      )}

      {/* GET BY ID */}

      {showGetById && (
        <div>

          <h3>Get Expense By ID</h3>

          <input
            type="number"
            placeholder="Expense ID"
            value={id}
            onChange={(e)=>setId(e.target.value)}
          />

          <button onClick={getExpenseById}>Search</button>

        </div>
      )}

      {/* UPDATE */}

      {showUpdate && (
        <div>

          <h3>Update Expense</h3>

          <input
            type="number"
            placeholder="Expense ID"
            value={id}
            onChange={(e)=>setId(e.target.value)}
          />

          <input
            type="text"
            placeholder="Expense"
            value={expense}
            onChange={(e)=>setExpense(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e)=>setAmount(e.target.value)}
          />

          <input
            type="date"
            value={date}
            onChange={(e)=>setDate(e.target.value)}
          />

          <button onClick={updateExpense}>Update</button>

        </div>
      )}

      {/* DELETE */}

      {showDelete && (
        <div>

          <h3>Delete Expense</h3>

          <input
            type="number"
            placeholder="Expense ID"
            value={id}
            onChange={(e)=>setId(e.target.value)}
          />

          <button onClick={deleteExpense}>Delete</button>

        </div>
      )}

      <hr/>

      {/* TABLE */}

      {expenses.length > 0 && (

        <table border="1">

          <thead>
            <tr>
              <th>ID</th>
              <th>Expense</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

            {expenses.map((e)=>(
              <tr key={e.eID}>
                <td>{e.eID}</td>
                <td>{e.expense}</td>
                <td>{e.amount}</td>
                <td>{e.date}</td>
              </tr>
            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}