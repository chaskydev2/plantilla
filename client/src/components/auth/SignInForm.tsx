import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
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
      toastify.success("Inicio de sesión correctamente")
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
              Iniciar Sesión
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ¡Introduce tu email y contraseña para iniciar sesión!
            </p>
          </div>
          <div>
            <form onSubmit={handleSignIn}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Correo Electrónico <span className="text-error-500">*</span>
                  </Label>
                  <Input 
                    name="email"
                    type="email"
                    placeholder="Ingresa tu email" 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label>
                    Contraseña <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeClosedIcon className="dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link
                      to="/reset-password"
                      className="text-sm text-[#F5D238] hover:text-[#e0c02f]"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link
                      to="/formulario_solicitud"
                      className="text-sm text-[#F5D238] hover:text-[#e0c02f]"
                    >
                      ¿No estás registrado?
                    </Link>
                  </div>
                </div>
                <div>
                  <Button disabled={isLoading} className="w-full bg-[#F5D238] text-[#1A1B16] hover:bg-[#e0c02f]" size="sm" type="submit">
                    {isLoading ? (
                      <>
                        <span className="loading loading-spinner"></span>loading
                      </>
                    ) : (
                      <span>Iniciar Sesión</span>
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
