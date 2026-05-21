"use client";
import { useState } from "react";
import { MapPin, DollarSign } from "lucide-react";
import { crearRuta, actualizarRuta } from "./actions";

interface Ruta {
    id?: number;
    origen: string;
    destino: string;
    precio: number;
}

export default function NuevaRutaForm({ empresaId, onSuccess, initialData }: { empresaId: number, onSuccess: () => void, initialData?: Ruta }) {
    const [loading, setLoading] = useState(false);
    const isEditing = !!initialData?.id;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        
        const data = {
            origen: formData.get("origen") as string,
            destino: formData.get("destino") as string,
            precio: parseFloat(formData.get("precio") as string),
            empresaId: empresaId
        };

        let res;
        if (isEditing && initialData.id) {
            res = await actualizarRuta(initialData.id, data);
        } else {
            res = await crearRuta(data);
        }

        if (res.success) onSuccess();
        else alert(res.error);
        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-slate-300">
            <div>
                <label className="block text-xs font-bold uppercase mb-1">Origen</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-slate-500" size={18} />
                    <input name="origen" required defaultValue={initialData?.origen} className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2" placeholder="Ej. La Soledad Salinas" />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold uppercase mb-1">Destino</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-slate-500" size={18} />
                    <input name="destino" required defaultValue={initialData?.destino} className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2" placeholder="Ej. Oaxaca de Juárez" />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold uppercase mb-1">Precio por Asiento</label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-3 text-slate-500" size={18} />
                    <input name="precio" type="number" step="0.01" required defaultValue={initialData?.precio} className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2" placeholder="0.00" />
                </div>
            </div>
            <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all">
                {loading ? "Guardando..." : isEditing ? "Actualizar Ruta" : "Registrar Ruta"}
            </button>
        </form>
    );
}