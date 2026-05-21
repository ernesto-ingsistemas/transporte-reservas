"use client";

import { registrarOperador, actualizarOperador } from "./actions"; // Importamos la nueva acción
import { useState } from "react";

interface Operador {
    id: number;
    nombre: string;
    telefono: string | null;
}

export default function NuevoOperadorForm({ 
    empresaId, 
    onSuccess, 
    initialData 
}: { 
    empresaId: number, 
    onSuccess: () => void, 
    initialData?: Operador 
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Determinamos si es edición
    const isEditing = !!initialData;

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        // Lógica condicional según si hay initialData
        const result = isEditing 
            ? await actualizarOperador(initialData.id, formData)
            : await registrarOperador(formData);

        if (result.success) {
            onSuccess();
        } else {
            setError(result.error || "Ocurrió un error inesperado");
            setLoading(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-xs font-medium animate-in fade-in zoom-in duration-200">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Nombre Completo</label>
                <input
                    name="nombre"
                    required
                    defaultValue={initialData?.nombre ?? ""}
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Ej. Juan Pérez"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Teléfono (10 dígitos)</label>
                <input
                    name="telefono"
                    type="text"
                    required
                    defaultValue={initialData?.telefono ?? ""}
                    maxLength={10}
                    pattern="\d{10}"
                    title="Debe contener exactamente 10 números"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Ej. 9511234567"
                    onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) e.preventDefault();
                    }}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2 ${
                    isEditing ? "bg-amber-600 hover:bg-amber-500" : "bg-blue-600 hover:bg-blue-500"
                }`}
            >
                {loading ? (
                    <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Procesando...
                    </>
                ) : (
                    isEditing ? "Actualizar Operador" : "Guardar Operador"
                )}
            </button>
        </form>
    );
}