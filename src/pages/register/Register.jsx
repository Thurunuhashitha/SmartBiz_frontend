import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {

  const navigate = useNavigate()

  const [companyName, setCompanyName] = useState('')
  const [owner, setOwner] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  const register = async () => { 
    if (!companyName || !owner || !email || !phone || !password) {
      alert('Please fill in all fields')
      return
    }

    try {

      const response = await axios.post(
        "http://localhost:3000/auth/register",
        {
          company_name: companyName,
          owner: owner,
          email: email,
          phone: phone,
          password: password
        }
      )

      console.log("Server Response:", response.data)
      alert("Registration successful")
      navigate('/login') // Redirect to login page after successful registration

    } catch (error) {

      if (error.response) {
        console.log("Backend Error:", error.response.data)
        console.log("Status Code:", error.response.status)
        alert(error.response.data.message || "Registration failed")
      } else {
        console.log("Network Error:", error.message)
        alert("Server not responding")
      }

    }
  }

  return (
    <div>
      <h1>Register</h1>

      <input 
        type="text" 
        placeholder="Company Name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />

      <input 
        type="text" 
        placeholder="Owner"
        value={owner}
        onChange={(e) => setOwner(e.target.value)}
      />

      <input 
        type="email" 
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input 
        type="text" 
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input 
        type="password" 
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={register}>Register</button>
      <Link to="/login">Already have an account? Login here</Link>
    </div>
  )
}