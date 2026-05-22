"use client";

import { PlusCircle, Route, Pencil, Trash2 } from "lucide-react";

interface Ruta {
    id: number;
    origen: string;
    destino: string;
    precio: number;
}

interface RutasTableProps {
    rutas: Ruta[];
    onEdit: (ruta: Ruta) => void;
    onDelete: (id: number) => void;
    onRegister: () => void;
}

export default function RutasTable({ rutas, onEdit, onDelete, onRegister }: RutasTableProps) {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-100">Listado de Rutas</h2>
                <button
                    onClick={onRegister}
                    className="bg-green-600 hover:bg-green-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-green-600/20"
                >
                    <PlusCircle size={16} /> Nueva Ruta
                </button>
            </div>

            <div className="overflow-x-auto border border-slate-700/50 rounded-xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-slate-500 text-[10px] uppercase tracking-widest bg-slate-900/50">
                            <th className="p-4 border-b border-slate-700">Ruta de Viaje</th>
                            <th className="p-4 border-b border-slate-700">Precio Base</th>
                            <th className="p-4 border-b border-slate-700 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                        {rutas.length > 0 ? (
                            rutas.map((ruta) => (
                                <tr key={ruta.id} className="hover:bg-blue-500/5 transition-colors group">
                                    <td className="p-4 font-medium text-slate-200">
                                        <div className="flex items-center gap-3">
                                            <Route size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                                            <span>
                                                {ruta.origen} ➔ {ruta.destino}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-green-400 font-mono">
                                        ${ruta.precio.toFixed(2)}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => onEdit(ruta)}
                                                title="Editar ruta"
                                                className="text-slate-400 hover:text-blue-400 transition-colors"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(ruta.id)}
                                                title="Eliminar"
                                                className="text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="p-12 text-center text-slate-500 font-light italic text-sm">
                                    No hay rutas registradas para esta empresa. Comienza agregando tu primer trayecto.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}