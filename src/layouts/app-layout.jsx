import Header from "@/components/header"
import { Outlet } from "react-router-dom"

const AppLayout = () => {
  return (
    <div>
        <main className="min-h-screen pr-10 pl-10 container">
            <Header/>
           <Outlet/>
        </main>

        <div className="p-3 text-sm text-center bg-gray-700 mt-10">
          Made with 💖 by Taiwo Stephen
        </div>
       
    </div>
  )
}

export default AppLayout