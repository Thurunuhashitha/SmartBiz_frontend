import React, { useState } from 'react'

export default function Company() {

    const [company_name, setCompany_name] = useState("")
    const [owner, setOwner] = useState("")
    const [email, setEmail] = useState("")
    const [id, setId] = useState("")
    const [phone, setPhone] = useState("")

    const token = localStorage.getItem("token") // Get JWT token

    const getall = async () => {
        try {
            const response = await fetch("http://localhost:3000/admin/getallcompanies", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            const data = await response.json()
            console.log("Company Data:", data)
            alert("Check console for company data")
        } catch (error) {
            console.log("Error fetching companies:", error)
            alert("Failed to fetch companies")
        }
    }

    const edit = async () => {
        try {
            const response = await fetch(`http://localhost:3000/admin/updatecompany/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    company_name,
                    owner,
                    email,
                    phone   
                })
            })

            const data = await response.json()
            console.log("Company updated:", data)
            alert("Company updated successfully")

        } catch (error) {
            console.log("Error updating company:", error)
            alert("Failed to update company")
        }
    }

    const deleteCompany = async () => {
        try {
            const response = await fetch(`http://localhost:3000/admin/deletecompany/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            const data = await response.json()
            console.log("Company deleted:", data)
            alert("Company deleted successfully")

        } catch (error) {
            console.log("Error deleting company:", error)
            alert("Failed to delete company")
        }
    }

    return (
        <div>
            <h1>Company Management</h1>

            <input
                type="number"
                placeholder="Company ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
            />

            <input
                type="text"
                placeholder="Company Name"
                value={company_name}
                onChange={(e) => setCompany_name(e.target.value)}
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


            <br /><br />

            <button onClick={edit}>Edit Company</button>
            <button onClick={deleteCompany}>Delete Company</button>
            <button onClick={getall}>View Companies</button>

        </div>
    )
}