in next.cpnfig.mjs channge tge origin instead o localhoat

<DropdownMenuItem onClick={() => { navigator.clipboard.writeText(`localhost:3000/post/${item.uid}`) }}>Save Link<Link2Icon /></DropdownMenuItem>

 <Link href={"/user/profile/new"} className="absolute right-5 top-2 border  rounded-lg h-7 w-7 text-center">+</Link>

   <Link href={`http://localhost:3000/profile/${data?.userName}` || " "} className="text-sm text-gray-500 mb-4 italic">By {data?.userName || " "}</Link>


   getCategoryFunc