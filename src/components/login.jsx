import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { BeatLoader } from "react-spinners"
import Error from "./error"
import { useState } from "react"
import * as Yup from 'yup'
import useFetch from "@/hooks/use-fetch"
import { login } from "@/db/apiAuth"
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { UrlState } from "@/context"


  
const Login = () => {
    const [errors, setErrors] = useState([])
    const [formData, setFormData] = useState({
        email:"",
        password:""
    }
    )

    const navigate = useNavigate()
    let [searchParams] = useSearchParams()
    const longlink = searchParams.get("createNew")

    const handleInputChange = (e) =>{
       const {name, value} = e.target
       setFormData((prevState) => ({
        ...prevState,
        [name]: value
       }))
    }

    const {data, loading, error, fn:fnLogin} = useFetch(login, formData)
    const {fetchUser} = UrlState()

    useEffect(() => {
        console.log(data)
        if (error === null && data){
            navigate(`/dashboard?${longlink ? `createNew=${longlink}` : ""}`)
            fetchUser()
        }
    }, [data, error])

    const handleLogin = async () => {
        setErrors([])
        try {
            const schema = Yup.object().shape({
                email: Yup.string()
                .email("Invalid Email")
                .required("Email is Required"),
                password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is Required")
            })
            await schema.validate(formData, {abortEarly: false})
            await fnLogin()
        } catch (e) {
            const newErrors = {}

            e?.inner?.forEach((err) => {
                newErrors[err.path] =  err.message;
            })
            setErrors(newErrors)
        }

    }
  return (
    <div>
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Login to your account if you already have one</CardDescription>
                {error && <Error message={error.message}/>}
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="space-y-1">
                    <span>
                        Enter your email address
                    </span>
                    <Input 
                    name="email" 
                    type="email" 
                    placeholder="you@example.com"
                    onChange={handleInputChange}
                    />
                    {errors.email && <Error message={errors.email}/>}
                </div>
                <div className="space-y-1">
                <span>
                        Enter your password
                    </span>
                    <Input 
                    name="password" 
                    type="password" 
                    placeholder="*********"
                    onChange={handleInputChange}
                    />
                    {errors.password && <Error message={errors.password}/>}
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleLogin}>
                    {loading ? <BeatLoader size={10} color="#ffffff"/> : "Login"}
                </Button>
            </CardFooter>
        </Card>

    </div>
  )
}

export default Login