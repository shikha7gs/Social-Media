
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"



export default function Login() {
  return (
    <div className="flex justify-center min-h-screen items-center">
      <div className="flex w-90 flex-col justify-center items-center">
        <div className="flex w-full flex-col border items-center justify-center p-8 ">
          <h1 className="pb-10 pt-3 px-10 font-serif text-3xl font-bold">Social Media</h1>
          <form className="flex flex-col items-center justify-center gap-3">
            <Input type="text" placeholder="Email" />
            <Input type="password" placeholder="Password" />
            <Button variant="outline">Log In</Button>
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
