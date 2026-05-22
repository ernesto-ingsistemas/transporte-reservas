"use client";

import { Bus, PlusCircle, UserPlus, Pencil, Trash2 } from "lucide-react";

interface Unidad {
    id: number;
    numero: string;
    placa: string;
    tipo: string;
    capacidad: number;
    usuario: { nombre: string } | null;
    operador: { nombre: string } | null;
    operadorId?: number | null;
}

interface UnidadesTableProps {
    unidades: Unidad[];
    onEdit: (unidad: Unidad) => void;
    onDelete: (id: number) => void;
    onAssign: () => void;
    onRegister: () => void;
}

export default function UnidadesTable({ unidades, onEdit, onDelete, onAssign, onRegister }: UnidadesTableProps) {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-100">Listado de Unidades</h2>

                <div className="flex gap-3">
                    <button
                        onClick={onAssign}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                    >
                        <UserPlus size={16} /> Asignar Operador
                    </button>

                    <button
                        onClick={onRegister}
                        className="bg-green-600 hover:bg-green-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-green-600/20"
                    >
                        <PlusCircle size={16} /> Registrar Unidad
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto border border-slate-700/50 rounded-xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-slate-500 text-[10px] uppercase tracking-widest bg-slate-900/50">
                            <th className="p-4 border-b border-slate-700">Num</th>
                            <th className="p-4 border-b border-slate-700">Vehículo</th>
                            <th className="p-4 border-b border-slate-700">Operador</th>
                            <th className="p-4 border-b border-slate-700 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                        {unidades.map((u) => (
                            <tr key={u.id} className="hover:bg-blue-500/5 transition-colors">
                                <td className="p-4 font-mono text-blue-400 text-sm">#{u.numero}</td>
                                <td className="p-4">
                                    <span className="font-bold text-slate-200 block">{u.placa}</span>
                                    <span className="text-[10px] text-slate-500 uppercase">{u.tipo}</span>
                                </td>
                                <td className="p-4 text-sm text-slate-300">
                                    {u.operador?.nombre || <span className="text-slate-600 italic">Sin asignar</span>}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => onEdit(u)}
                                            className="text-slate-400 hover:text-blue-400 transition-colors"
                                            title="Editar"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(u.id)}
                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}