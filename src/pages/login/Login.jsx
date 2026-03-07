import React, { useState } from 'react'
import axios from 'axios'

export default function Login() {

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

      console.log("Server Response:", response.data)
      alert("Login successful")

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
    </div>
  )
}