"use client";
import { useState } from "react";
import { asignarOperadorAUnidad } from "./actions";

interface Props {
    unidades: any[];
    operadores: any[];
    onSuccess: () => void;
}

export default function AsignarOperadorForm({ unidades, operadores, onSuccess }: Props) {
    const [unidadId, setUnidadId] = useState("");
    const [operadorId, setOperadorId] = useState("");
    const [loading, setLoading] = useState(false);

    //Usamos React.FormEvent<HTMLFormElement> para mayor precisión
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        
        const res = await asignarOperadorAUnidad(Number(unidadId), Number(operadorId));
        
        if (res.success) {
            onSuccess();
        } else {
            alert(res.error);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                    Seleccionar Unidad
                </label>
                <select 
                    required
                    value={unidadId}
                    onChange={(e) => setUnidadId(e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="">-- Selecciona una Urvan --</option>
                    {unidades.map(u => (
                        <option key={u.id} value={u.id}>Unidad #{u.numero} - {u.placa}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                    Seleccionar Operador
                </label>
                <select 
                    required
                    value={operadorId}
                    onChange={(e) => setOperadorId(e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="">-- Selecciona un Operador --</option>
                    {operadores.map(op => (
                        <option key={op.id} value={op.id}>{op.nombre}</option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50"
            >
                {loading ? "Asignando..." : "Confirmar Asignación"}
            </button>
        </form>
    );
}