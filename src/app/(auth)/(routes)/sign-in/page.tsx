import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <SignIn
        fallbackRedirectUrl="/dashboard"
        signUpUrl="/sign-up"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-gray-800 text-white",
            headerTitle: "text-green-500",
            headerSubtitle: "text-gray-300",
            formButtonPrimary: "bg-green-500 hover:bg-green-600",
            formFieldLabel: "text-gray-300",
            formFieldInput: "bg-gray-700 text-white border-gray-600",
            footerActionLink: "text-green-500 hover:text-green-400",
          },
        }}
      />
    </div>
  )
}
