"use client"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { redirect } from "next/navigation"


export default function Login() {
  const {toast} = useToast()
  const [emailOrUsername, setEmailOrUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(true)
  const [wait, setWait] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setWait(true)
    const req1 = await fetch("/api/account/login", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emailOrUsername, password })
    })
    const res1 = await req1.json()
    setWait(false)
    if (!res1.success) {
      toast({
        description: `❌ ${res1.message}`,
      })
      return
    }
    setEmailOrUsername("")
    setPassword("")
    toast({
      description: `✅ You are logged in`,
    })
    redirect("/user/profile")
  }

  useEffect(() => {
    if (!emailOrUsername.includes(" ") && emailOrUsername.length >= 5 && password.length >= 8 && password.length <= 30) {
      setError(false)
    } else {
      setError(true)
    }
  }, [emailOrUsername, password])

  useEffect(()=>{
      (async()=>{
        const req1= await fetch("/api/account/checkAuthenticate", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify()
        })
        const res1= await req1.json()
        if(res1.authenticated){
          console.log("live")
          redirect("/user/profile")
        }else{
          console.log("leave")
        }
      })()
    },[])
    
  return (
    <div className="flex justify-center min-h-screen items-center">
      <div className="flex w-90 flex-col justify-center items-center">
        <div className="flex w-full flex-col border items-center justify-center p-8 ">
          <h1 className="pb-10 pt-3 px-10 font-serif text-3xl font-bold">Social Media</h1>
          <form className="flex flex-col items-center justify-center gap-3">
            <Input value={emailOrUsername} onChange={(e) => { setEmailOrUsername(e.target.value) }} type="text" placeholder="Email or Username" />
            <Input value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" placeholder="Password" />
            <div className='flex justify-center items-center gap-2'>
              <Button disabled={error || wait} onClick={handleSubmit} variant="outline">Log in</Button>
              <AlertDialog>
                <AlertDialogTrigger>Rule</AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Rules:</AlertDialogTitle>
                    <AlertDialogDescription>
                      <li><strong>email:</strong>Should be valid.</li>
                      <li><strong>userName:</strong>No space and min 8, max 20 and no special character.</li>
                      <li><strong>password:</strong>Minimum 8 and max 30 char.</li>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <Link className="mt-5" href={"/account/forget-password"}>Forget Password?</Link>
          </form>
        </div>
        <div className="border flex justify-center items-center w-full m-5 py-7 ">
          <span className="">Don't have an account</span><Link href="/account/signup" className="text-blue-700 font-bold">&nbsp;Sign up</Link>
        </div>
      </div>
    </div>
  );
}
