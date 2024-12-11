import { signup } from "@/app/(auth)/login/actions";

export default function RegisterPage() {
    return (
        <div className="space-y-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center">Register</h1>
            <form className="space-y-4">
                {/* Name Field */}
                <label htmlFor="name" className="block text-sm font-medium">
                    Name:
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 border rounded-md"
                />

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

                {/* Signup Button */}
                <button
                    formAction={signup}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    Sign up
                </button>
            </form>
        </div>
    );
}
