import './App.css'
import Register from '../pages/register/Register'
import Login from '../pages/login/Login'
import Company from '../pages/admin/company/Company'
import ProductStock from '../pages/product and stock/productStock'
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
      </Routes> 
   </div>
  )
}

export default App
