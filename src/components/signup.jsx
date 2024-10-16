import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { BeatLoader } from "react-spinners"
import Error from "./error"
import { useState } from "react"
import * as Yup from 'yup'
import useFetch from "@/hooks/use-fetch"
import { signup } from "@/db/apiAuth"
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { UrlState } from "@/context"



const Signup = () => {
  const [errors, setErrors] = useState([])
  const [formData, setFormData] = useState({
      name:"",
      email:"",
      password:"",
      profile_pic: null
  }
  )

  const navigate = useNavigate()
  let [searchParams] = useSearchParams()
  const longlink = searchParams.get("createNew")

  const handleInputChange = (e) =>{
     const {name, value, files} = e.target
     setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0]: value
     }))
  }

  const {data, loading, error, fn:fnSignup} = useFetch(signup, formData)
  const {fetchUser} = UrlState()

  useEffect(() => {
      console.log(data)
      if (error === null && data){
          navigate(`/dashboard?${longlink ? `createNew=${longlink}` : ""}`)
          fetchUser()
      }
  }, [error, loading])

  const handleSignup = async () => {
      setErrors([])
      try {
          const schema = Yup.object().shape({
              name: Yup.string()
              .required("Name is Required"),
              email: Yup.string()
              .email("Invalid Email")
              .required("Email is Required"),
              password: Yup.string()
              .min(6, "Password must be at least 6 characters")
              .required("Password is Required"),
              profile_pic: Yup.mixed()
              .required("Profile Picture is Required"),
          })
          await schema.validate(formData, {abortEarly: false})
          await fnSignup()
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
              <CardTitle>Signup</CardTitle>
              <CardDescription>Create a new account if you don&rsquo;t already have one</CardDescription>
              {error && <Error message={error.message}/>}
          </CardHeader>
          <CardContent className="space-y-2">
              <div className="space-y-1">
                      <span>
                          Enter your name
                      </span>
                      <Input 
                      name="name" 
                      type="text" 
                      placeholder="stevoooo"
                      onChange={handleInputChange}
                      />
                      {errors.name && <Error message={errors.name}/>}
                  </div>
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
              <div className="space-y-1">
                  <span>
                      Enter your email address
                  </span>
                  <Input 
                  name="profile_pic" 
                  type="file" 
                  accept = "image/*"
                  onChange={handleInputChange}
                  />
                  {errors.profile_pic && <Error message={errors.profile_pic}/>}
              </div>
          </CardContent>
          <CardFooter>
              <Button onClick={handleSignup}>
                  {loading ? <BeatLoader size={10} color="#ffffff"/> : "Create Account"}
              </Button>
          </CardFooter>
      </Card>

  </div>
)
}

export default Signup