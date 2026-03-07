import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom' 

export default function Login() {

  const navigate = useNavigate()

  const [companyName, setCompanyName] = useState('')
  const [password, setPassword] = useState('')

  const login = async () => {
    if (!companyName || !password) {
      alert('Please fill in all fields')
      return
    }

    try {

      const response = await axios.post(
        "http://localhost:3000/auth/login",
        {
          company_name: companyName,
          password: password
        }
      )

      // Save the token after successful login
      localStorage.setItem('token', response.data.token)

      console.log("Server Response:", response.data)
      alert("Login successful")

      if (companyName === "admin@gmail.com") {
        navigate("/company")
        return
      }
      navigate('/ProductStock') // Redirect to product stock page after successful login
      
    } catch (error) {

      if (error.response) {
        console.log("Backend Error:", error.response.data)
        console.log("Status Code:", error.response.status)
        alert(error.response.data.message || "Login failed")
      } else {
        console.log("Network Error:", error.message)
        alert("Server not responding")
      }

    }
  }

  return (
    <div>
      <h1>Login</h1>

      <input
        type="text"
        placeholder="Company Name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>Login</button>
      <Link to="/register">Don't have an account? Register here</Link>
    </div>
  )
}