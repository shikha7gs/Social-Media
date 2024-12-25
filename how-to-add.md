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