import Link from "next/link";

export default function Home() {
  return (
    <div>
      Home
      <Link href={"/account/login"}>Get started</Link>
    </div>
  );
}
