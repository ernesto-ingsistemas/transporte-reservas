"use client";

import { registrarUnidad, actualizarUnidad } from "./actions";
import { useState } from "react";

interface Operador {
  id: number;
  nombre: string;
}

interface Unidad {
  id: number;
  numero: string;
  placa: string;
  tipo: string;
  capacidad: number;
  operadorId?: number | null;
}

export default function NuevaUnidadForm({
  onSuccess,
  operadores,
  initialData
}: {
  onSuccess: () => void;
  operadores: Operador[];
  initialData?: Unidad;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await actualizarUnidad(initialData.id, formData);
      } else {
        await registrarUnidad(formData);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Error inesperado");
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-xs">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Número Económico</label>
          <input 
            name="numero" 
            type="text" 
            defaultValue={initialData?.numero}
            className="w-full p-2.5 rounded bg-[#0f172a] border border-slate-600 text-white focus:border-blue-500 outline-none" 
            placeholder="Ej. #04"
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-300">Placa / Matrícula</label>
          <input 
            name="placa" 
            type="text" 
            defaultValue={initialData?.placa}
            className="w-full p-2.5 rounded bg-[#0f172a] border border-slate-600 text-white focus:border-blue-500 outline-none" 
            placeholder="AAA-283-T"
            required 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-300">Tipo de Vehículo</label>
        <input 
          name="tipo" 
          type="text" 
          defaultValue={initialData?.tipo}
          className="w-full p-2.5 rounded bg-[#0f172a] border border-slate-600 text-white focus:border-blue-500 outline-none" 
          placeholder="Ej. Urvan"
          required 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-300">Capacidad (Asientos)</label>
        <input 
          name="capacidad" 
          type="number" 
          defaultValue={initialData?.capacidad}
          className="w-full p-2.5 rounded bg-[#0f172a] border border-slate-600 text-white focus:border-blue-500 outline-none" 
          placeholder="Ej. 15"
          required 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-slate-300">Asignar Operador (Opcional)</label>
        <select
          name="operadorId"
          defaultValue={initialData?.operadorId || ""}
          className="w-full p-2.5 rounded bg-[#0f172a] border border-slate-600 text-white focus:border-blue-500 outline-none"
        >
          <option value="">Sin asignar</option>
          {operadores.map((op) => (
            <option key={op.id} value={op.id}>
              {op.nombre}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full mt-4 font-bold py-3 rounded-md transition-all shadow-lg disabled:opacity-50 ${
          isEditing ? "bg-amber-600 hover:bg-amber-500" : "bg-blue-600 hover:bg-blue-500"
        }`}
      >
        {loading 
          ? "Guardando..." 
          : (isEditing ? "Actualizar Unidad" : "Guardar Unidad")
        }
      </button>
    </form>
  );
}