"use client";

import { useActionState } from "react";
import { registrarAdmin } from "./actions";
import { ShieldCheck, Mail, Lock, Building2, ArrowRight } from "lucide-react";

export default function NuevoUsuarioForm({ empresas }: { empresas: any[] }) {
    // Manejamos la respuesta de la Server Action
    const [state, formAction, isPending] = useActionState(registrarAdmin, null);

    // 1. SI EL REGISTRO FUE EXITOSO: Mostramos la tarjeta de credenciales
    if (state?.success) {
        return (
            <div className="bg-[#1e293b] p-8 rounded-2xl border-2 border-green-500/50 shadow-2xl w-full max-w-md text-center animate-in fade-in zoom-in duration-300">
                <div className="flex justify-center mb-4">
                    <div className="bg-green-500/20 p-4 rounded-full">
                        <ShieldCheck className="text-green-400" size={48} />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">¡Registro Exitoso!</h2>
                <p className="text-slate-400 text-sm mb-6">
                    Por seguridad, esta es la única vez que verás la contraseña. Por favor, anótala.
                </p>

                <div className="bg-[#0f172a] p-5 rounded-xl border border-slate-700 space-y-4 text-left mb-8 shadow-inner">
                    <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Correo de Acceso</span>
                        <div className="flex items-center gap-2 text-blue-400">
                            <Mail size={16} />
                            <p className="font-mono font-medium">{state.datos?.email}</p>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Contraseña Temporal</span>
                        <div className="flex items-center gap-2 text-yellow-400">
                            <Lock size={16} />
                            <p className="font-mono text-xl font-bold tracking-tight">{state.datos?.password}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => window.location.href = '/login'}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                >
                    Ir al Login de Seguridad <ArrowRight size={18} />
                </button>
            </div>
        );
    }

    // 2. FORMULARIO INICIAL
    return (
        <form action={formAction} className="bg-[#1e293b] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
            <h1 className="text-2xl font-bold mb-2 text-center text-blue-400">Paso 2: Administrador</h1>
            <p className="text-slate-400 text-sm mb-8 text-center">Configura las credenciales maestras para la empresa</p>

            {/* Alerta de Error */}
            {state?.error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    {state.error}
                </div>
            )}

            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium mb-1.5 text-slate-300">Nombre completo</label>
                    <div className="relative">
                        <input
                            name="nombre"
                            type="text"
                            placeholder="Ej. Ernesto Alonso Martínez"
                            className="w-full p-3 rounded-xl bg-[#0f172a] border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all placeholder:text-slate-600"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5 text-slate-300">Correo Institucional</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="admin@empresa.com"
                        className="w-full p-3 rounded-xl bg-[#0f172a] border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all placeholder:text-slate-600"
                        required
                    />
                </div>

                <div>
                    <label className="flex text-sm font-medium mb-1.5 text-slate-300 items-center gap-2">
                        <Building2 size={14} className="text-slate-500" /> Asignar Empresa
                    </label>
                    <select
                        name="empresaId"
                        className="w-full p-3 rounded-xl bg-[#0f172a] border border-slate-700 focus:border-blue-500 outline-none text-white cursor-pointer appearance-none transition-all"
                        required
                        defaultValue=""
                    >
                        <option value="" disabled>Selecciona la empresa correspondiente...</option>
                        {empresas.map((empresa) => (
                            <option key={empresa.id} value={empresa.id}>
                                {empresa.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full mt-10 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/30 active:scale-95"
            >
                {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Procesando...
                    </span>
                ) : "Generar Acceso Administrativo"}
            </button>
        </form>
    );
}