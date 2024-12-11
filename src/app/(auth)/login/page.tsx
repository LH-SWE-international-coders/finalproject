import { login } from "@/app/(auth)/login/actions";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="space-y-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center">Login</h1>
            <form className="space-y-4">
                {/* Email Field */}
                <label htmlFor="email" className="block text-sm font-medium">
                    Email:
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border rounded-md"
                />

                {/* Password Field */}
                <label htmlFor="password" className="block text-sm font-medium">
                    Password:
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 border rounded-md"
                />

                {/* Login Button */}
                <button
                    formAction={login}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Log in
                </button>
            </form>

            {/* Link to Register Page */}
            <p className="text-center">
                Dont have an account?{" "}
                <Link href="/register" className="text-blue-500 hover:underline">
                    Register
                </Link>
            </p>
        </div>
    );
}
