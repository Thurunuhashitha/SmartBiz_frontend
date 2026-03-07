import './App.css'
import Register from '../pages/register/Register'
import Login from '../pages/login/Login'
import Company from '../pages/admin/company/Company'
import ProductStock from '../pages/product and stock/productStock'
import Customer from '../pages/customer/Customer'
import Supplier from '../pages/sapplier/Sapplier'
import Sales from '../pages/sales/Sales'
import Expenses from '../pages/expenses/Expenses'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'

function App() { 

  return (
   <div>
    <Routes>   
        {/* Default route */}
        <Route path="/" element={<Login/>} />

        <Route path='/login' element = {<Login/>} />         {/* url ekee "/login" meeka gahuwoth ookata yanawa */}
        <Route path='/register' element = {<Register/>} />  
        <Route path='/ProductStock' element = {<ProductStock/>} /> 
        <Route path='/company' element = {<Company/>} />
        <Route path='/customer' element = {<Customer/>} />
        <Route path='/supplier' element = {<Supplier/>} />
        <Route path='/sales' element = {<Sales/>} />
        <Route path='/expenses' element = {<Expenses/>} />
      </Routes> 
   </div>
  )
}

export default App
