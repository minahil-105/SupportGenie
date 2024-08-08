import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="">
      <SignIn path="/sign-in" />
    </div>
  )
}