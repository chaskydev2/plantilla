import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeClosedIcon, EyeIcon, Mail, Lock, Loader2 } from "lucide-react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';
import { login } from '@/core/reducer/auth.reducer';
import { toastify } from "@/core/utils/toastify";

export default function SignInForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async(e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const resultAction = await dispatch(login({
      email: formData.email,
      password: formData.password
    }));

    setIsLoading(false);

    if (login.fulfilled.match(resultAction)) {
      toastify.success("Signed in successfully")
      navigate('/admin');
    } else {
      toastify.error(resultAction.payload as string);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={handleSignIn} aria-label="Sign in form">
              <div className="space-y-6">
                {/* Email */}
                <div>
                  <Label>
                    Email Address <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail className="size-4" />
                    </span>
                    <Input 
                      name="email"
                      type="email"
                      placeholder="Enter your email" 
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-9"
                      aria-label="Email Address"
                      autoComplete="email"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">Use the email you registered with.</p>
                </div>

                {/* Password */}
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock className="size-4" />
                    </span>
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-9 pr-10"
                      aria-label="Password"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 right-3 top-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeIcon className="size-5" />
                      ) : (
                        <EyeClosedIcon className="size-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">Minimum 8 characters.</p>
                </div>

                {/* Links */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link
                      to="/reset-password"
                      className="text-sm text-[#F5D238] hover:text-[#e0c02f]"
                    >
                      Forgot your password?
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link
                      to="/formulario_solicitud"
                      className="text-sm text-[#F5D238] hover:text-[#e0c02f]"
                    >
                      Not registered?
                    </Link>
                  </div>
                </div>

                {/* Submit */}
                <div>
                  <Button disabled={isLoading} className="w-full bg-[#F5D238] text-[#1A1B16] hover:bg-[#e0c02f] shadow-sm hover:shadow-md" size="sm" type="submit">
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        Signing in…
                      </span>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
