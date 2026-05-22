"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react"; // Importamos iconos
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            alert("Correo o contraseña incorrectos");
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#1e293b] p-8 rounded-2xl border border-slate-700 shadow-2xl">
                {/* 2. Contenedor de la animación ajustado para tu diseño */}
                <div className="w-36 h-36 mx-auto mb-2 flex items-center justify-center">
                    <DotLottieReact
                        src="/bus.lottie" // Apunta directo al archivo en tu carpeta public
                        loop
                        autoplay
                    />
                </div>

                <h1 className="text-3xl font-bold text-blue-400 mb-2 text-center">Siti</h1>
                <p className="text-slate-400 text-center mb-8">Gestión de Transporte</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Correo</label>
                        <input
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="admin@empresa.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña</label>
                        <div className="relative">
                            <input
                                // El tipo cambia dinámicamente
                                type={showPassword ? "text" : "password"}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none pr-12"
                                placeholder="••••••••"
                                required
                            />
                            {/* Botón del ojito */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all active:scale-95">
                        Ingresar al Sistema
                    </button>
                </form>
            </div>
        </div>
    );
}