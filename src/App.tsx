import './App.css'
import { Outlet } from 'react-router'


 function App() {
  return (
    <>  
      <main>
        <Outlet /> {/* 這裡就是子頁面會被渲染出來的位置 */}
      </main>
    </>
  )
}

export default App
