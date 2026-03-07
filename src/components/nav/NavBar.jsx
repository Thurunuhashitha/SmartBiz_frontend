import React from 'react'
import { Link} from 'react-router-dom'

export default function NavBar() {
  return (
    <div>
        <button><Link to="/ProductStock">Products and stock</Link></button>
        <button><Link to="/customer">Customer management</Link></button>
        <button><Link to="/supplier">Supplier management</Link></button>
        <button><Link to="/sales">Sales management</Link></button>
        <button><Link to="/expenses">Expenses management</Link></button>
         
    </div>
  )
}
