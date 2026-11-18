import Home from './Home'
import Dashboard from './Dashboard'
import Product from './Product'
import ProtectedRoute from './ProtectedRoute'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  

  return (
     <Router>
        <Routes>
           <Route exact path='/' element={<Home/>}/>
           <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
           <Route path='masters/product' element={<ProtectedRoute><Product /></ProtectedRoute>}/>
        </Routes>
       </Router>
  )
}

export default App
