import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md p-8">
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-white shadow-xl",
            },
          }}
        />
      </div>
    </div>
  )
}
