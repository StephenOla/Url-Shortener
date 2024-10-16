import {Link, useNavigate} from "react-router-dom"
import { Button } from "./ui/button"
import { DropdownMenu } from "./ui/dropdown-menu"
import { DropdownMenuTrigger } from "./ui/dropdown-menu"
import { DropdownMenuContent } from "./ui/dropdown-menu"
import { DropdownMenuLabel } from "./ui/dropdown-menu"
import { DropdownMenuItem } from "./ui/dropdown-menu"
import { DropdownMenuSeparator } from "./ui/dropdown-menu"
import { Avatar } from "./ui/avatar"
import { AvatarImage } from "./ui/avatar"
import { AvatarFallback } from "./ui/avatar"
import { LinkIcon, LogOut } from "lucide-react"
import { UrlState } from "@/context"
import useFetch from "@/hooks/use-fetch"
import { BarLoader } from "react-spinners"
import { logout } from "@/db/apiAuth"


const Header = () => {
    const{loading, fn:fnLogout} = useFetch(logout)
    const navigate = useNavigate()
    const {user, fetchUser} = UrlState()

  return <>
  <nav className="py-4 flex justify-between items-center">
    <Link to="/">
        <img src="/logo.png" className="h-16" alt=" Shortnr logo"/>
    </Link>

    <div>
        {!user ?
            <Button onClick ={() => navigate("/auth")}>Login</Button>
            :(
                <DropdownMenu>
                    <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">
                    <Avatar>
                        <AvatarImage src={user.user_metadata?.profile_pic} />
                        <AvatarFallback>TS</AvatarFallback>
                    </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>{user.user_metadata?.name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link to="/dashboard" className="flex">
                            <LinkIcon className="mr-2 h-4 w-4"/>
                            My Links
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400">
                            <LogOut className="mr-2 h-4 w-4"/>
                            <span onClick={() => {
                                fnLogout().then(() => {
                                    fetchUser()
                                    navigate("/")
                                })
                            }}>
                                Logout  
                            </span>
                            </DropdownMenuItem>
                    </DropdownMenuContent>
              </DropdownMenu>
              
            )
        }
    </div>
  </nav>
   {loading && <BarLoader className="mb-4" width={"100%"} color="#ffffff" />}
   </>
}

export default Header