"use client";

import { PlusCircle, Pencil, Trash2 } from "lucide-react";

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

interface Operador {
    id: number;
    nombre: string;
    telefono: string | null;
}

interface OperadoresTableProps {
    operadores: Operador[];
    unidades: Unidad[];
    onEdit: (operador: Operador) => void;
    onDelete: (id: number) => void;
    onRegister: () => void;
}

export default function OperadoresTable({ operadores, unidades, onEdit, onDelete, onRegister }: OperadoresTableProps) {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-100">Listado de Operadores</h2>
                <button
                    onClick={onRegister}
                    className="bg-green-600 hover:bg-green-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-lg"
                >
                    <PlusCircle size={16} /> Nuevo Operador
                </button>
            </div>

            <div className="overflow-x-auto border border-slate-700/50 rounded-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-slate-500 text-[10px] uppercase tracking-widest bg-slate-900/50">
                            <th className="p-4 border-b border-slate-700">Nombre</th>
                            <th className="p-4 border-b border-slate-700">Teléfono</th>
                            <th className="p-4 border-b border-slate-700">Estatus</th>
                            <th className="p-4 border-b border-slate-700 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                        {operadores.map((op) => {
                            const estaAsignado = unidades.some((u) => u.operadorId === op.id);
                            return (
                                <tr key={op.id} className="hover:bg-green-500/5 transition-colors">
                                    <td className="p-4 font-medium text-slate-200">{op.nombre}</td>
                                    <td className="p-4 text-slate-400">{op.telefono || "N/A"}</td>
                                    <td className="p-4">
                                        {estaAsignado ? (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider">
                                                Ocupado
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-wider">
                                                Libre
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => onEdit(op)}
                                                className="text-slate-400 hover:text-blue-400 transition-colors"
                                                title="Editar"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(op.id)}
                                                className="text-slate-400 hover:text-red-500 transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}