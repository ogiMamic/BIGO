import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="w-full max-w-md p-8">
        <SignUp
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
