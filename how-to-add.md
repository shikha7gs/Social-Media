## rate-limit:
  - Add details in lib/rateLimit.js like name, points and duration.
  - In the api add this code- `const isAllowed = await rateLimit(req, "name you declared in ratelimit.js");
        if (!isAllowed) return NextResponse.json({ success: false, message: "Too many requests, your account will be unlocked after 5 minutes"});`
  - import rateLimit

## toast:
  - import- `import { useToast } from "@/hooks/use-toast"`
  - under page - `const { toast } = useToast()`
  - use - `toast({
      description: '✅ Otp sent successfully'
    })`

## Redirect for authenticate or non.
 - use - `useEffect(()=>{
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
        router.push("/user/profile")
      }
    })()
  },[])`


### Token:
 - In client before making request(fetch): `const {token,id} = await generateToken()`
 - In client in header of request add - 'Authorization': `Bearer ${token}` and in body add id
 - in server api- `const token = params.headers.get('authorization')?.split(' ')[1]
        if (!token || !id) return NextResponse.json({ success: false, message: "Token is required" })
        const validateToken =await validateJWT(token, id)
        if (!validateToken.valid) return NextResponse.json({ success: false, message: "Not valid token" })`