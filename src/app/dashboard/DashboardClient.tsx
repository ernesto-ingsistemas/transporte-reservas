"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LogOut, PlusCircle, Bus, User,
    Route, MapPin, Trash2, Pencil, UserPlus
} from "lucide-react";
import Modal from "@/components/Modal";
import NuevaUnidadForm from "./nueva-unidad/NuevaUnidadForm";
import NuevoOperadorForm from "./nuevo-operador/NuevoOperadorForm";
import NuevaRutaForm from "./nueva-ruta/NuevaRutaForm";
import { asignarOperadorAUnidad } from "./nueva-unidad/actions";
import { eliminarUnidad } from "./nueva-unidad/actions";
import { eliminarOperador } from "./nuevo-operador/actions";
import { eliminarRuta } from "./nueva-ruta/actions";
import AsignarOperadorForm from "./nueva-unidad/asignarOperadorForm";

// 1. Interfaces
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

interface Ruta {
    id: number;
    origen: string;
    destino: string;
    precio: number;
}

interface Viaje {
    id: number;
    ruta: Ruta;
    unidad: Unidad;
    operador: Operador | null;
    fecha: string;
    hora: string;
}

export default function DashboardClient({
    nombreEmpresa,
    totalUnidades,
    unidades,
    totalOperadores,
    operadores,
    empresaId,
    totalRutas,
    rutas,
    totalViajes,
    viajes
}: {
    nombreEmpresa: string,
    totalUnidades: number,
    unidades: Unidad[],
    totalOperadores: number,
    operadores: Operador[],
    empresaId: number,
    totalRutas: number,
    rutas: Ruta[]
    totalViajes: number,
    viajes: Viaje[]
}) {
    const [activeTab, setActiveTab] = useState<'unidades' | 'rutas' | 'operadores'>('unidades');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssigning, setIsAssigning] = useState(false);

    // Estado para manejar qué elemento se está editando (null = nuevo registro)
    const [editingItem, setEditingItem] = useState<Unidad | Operador | Ruta | null>(null);

    const router = useRouter();

    // Resetear estados al cerrar el modal o tener éxito
    const handleSuccess = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        router.refresh();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setIsAssigning(false);
    };

    const handleEdit = (item: Unidad | Operador | Ruta) => {
        setEditingItem(item);
        setIsAssigning(false);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const nombres = {
            unidades: "esta unidad",
            operadores: "este operador",
            rutas: "esta ruta"
        };

        if (confirm(`¿Estás seguro de que deseas eliminar ${nombres[activeTab]}?`)) {
            let result;

            // Ejecutamos la acción según la pestaña activa
            if (activeTab === 'unidades') {
                result = await eliminarUnidad(id);
            } else if (activeTab === 'operadores') {
                result = await eliminarOperador(id);
            } else if (activeTab === 'rutas') {
                result = await eliminarRuta(id);
            }

            if (result?.success) {
                router.refresh(); // Actualiza la tabla y los contadores de las tarjetas
            } else {
                alert(result?.error || "No se pudo eliminar el registro.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-8 relative">
            {/* Cabecera */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-blue-400 mb-2">
                        {nombreEmpresa} | Panel de Control
                    </h1>
                    <p className="text-slate-400 font-light">Gestión integral de flota y personal operativo.</p>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-lg border border-red-500/50 transition-all text-sm font-medium"
                >
                    <LogOut size={16} /> Cerrar Sesión
                </button>
            </div>

            {/* Tarjetas de Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

                {/* Unidades */}
                <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-lg transition-transform hover:scale-[1.02]">
                    <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Bus size={18} className="text-blue-400" /> Unidades Registradas
                    </h3>
                    <p className="text-4xl font-bold text-white">{totalUnidades}</p>
                </div>

                {/* Operadores */}
                <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-lg transition-transform hover:scale-[1.02]">
                    <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                        <User size={18} className="text-emerald-400" /> Total Operadores
                    </h3>
                    <p className="text-4xl font-bold text-white">{totalOperadores}</p>
                </div>

                {/* Rutas - AQUÍ QUITAMOS EL OPACITY-60 */}
                <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-lg transition-transform hover:scale-[1.02]">
                    <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Route size={18} className="text-purple-400" /> Rutas Activas
                    </h3>
                    <p className="text-4xl font-bold text-white">{totalRutas}</p>
                </div>

                {/* Viajes - AQUÍ QUITAMOS EL OPACITY-60 */}
                <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700 shadow-lg transition-transform hover:scale-[1.02]">
                    <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                        <MapPin size={18} className="text-orange-400" /> Próximos Viajes
                    </h3>
                    <p className="text-4xl font-bold text-white">{totalViajes || 0}</p>
                </div>
            </div>

            {/* Contenedor de Navegación y Tablas */}
            <div className="bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
                <div className="flex border-b border-slate-700 bg-slate-800/40 p-2 gap-2">
                    <button
                        onClick={() => setActiveTab('unidades')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'unidades' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700'}`}
                    >
                        <Bus size={16} /> Unidades
                    </button>
                    <button
                        onClick={() => setActiveTab('operadores')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'operadores' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700'}`}
                    >
                        <User size={16} /> Operadores
                    </button>
                    <button
                        onClick={() => setActiveTab('rutas')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'rutas' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700'}`}
                    >
                        <Route size={16} /> Rutas
                    </button>
                </div>

                <div className="p-8">
                    {/* VISTA: UNIDADES */}
                    {activeTab === 'unidades' && (
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-slate-100">Listado de Unidades</h2>

                                <div className="flex gap-3"> {/* Contenedor para los dos botones */}
                                    <button
                                        onClick={() => { setIsAssigning(true); setIsModalOpen(true); }}
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                                    >
                                        <UserPlus size={16} /> Asignar Operador
                                    </button>

                                    <button
                                        onClick={() => { setEditingItem(null); setIsAssigning(false); setIsModalOpen(true); }}
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
                                                            onClick={() => handleEdit(u)}
                                                            className="text-slate-400 hover:text-blue-400 transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(u.id)}
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
                    )}

                    {/* VISTA: OPERADORES */}
                    {activeTab === 'operadores' && (
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-slate-100">Listado de Operadores</h2>
                                <button
                                    onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
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
                                                                onClick={() => handleEdit(op)}
                                                                className="text-slate-400 hover:text-blue-400 transition-colors"
                                                                title="Editar"
                                                            >
                                                                <Pencil size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(op.id)}
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
                    )}

                    {/* VISTA: RUTAS - Replicando el diseño de 'Operadores' */}
                    {activeTab === 'rutas' && (
                        <div>
                            {/* Encabezado con el mismo patrón: Título y Botón Verde */}
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-slate-100">Listado de Rutas</h2>
                                <button
                                    onClick={() => {
                                        setEditingItem(null); // Asegura que sea un registro nuevo
                                        setIsModalOpen(true);
                                    }}
                                    className="bg-green-600 hover:bg-green-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-green-600/20"
                                >
                                    <PlusCircle size={16} /> Nueva Ruta
                                </button>
                            </div>

                            {/* Tabla con la misma estructura y estilos */}
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
                                                                onClick={() => handleEdit(ruta)}
                                                                title="Editar ruta"
                                                                className="text-slate-400 hover:text-blue-400 transition-colors"
                                                            >
                                                                <Pencil size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(ruta.id)}
                                                                className="text-slate-400 hover:text-red-500 transition-colors"
                                                                title="Eliminar"
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
                    )}

                </div>
            </div>

            {/* 3. MODAL DINÁMICO ACTUALIZADO */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={
                    isAssigning
                        ? "Asignar Operador a Unidad"
                        : editingItem
                            ? `Editar ${activeTab === 'unidades' ? 'Unidad' : activeTab === 'operadores' ? 'Operador' : 'Ruta'}`
                            : (activeTab === 'unidades' ? "Registrar Unidad" : activeTab === 'operadores' ? "Registrar Operador" : "Registrar Ruta")
                }
            >
                {/* LÓGICA PARA MOSTRAR FORMULARIO DE ASIGNACIÓN */}
                {isAssigning ? (
                    <AsignarOperadorForm
                        // 1. Filtramos las unidades: Solo pasan las que tienen operador null
                        unidades={unidades.filter(u => u.operador === null)}

                        // 2. Filtramos los operadores: Solo pasan los que no aparecen en ninguna unidad
                        operadores={operadores.filter(op =>
                            !unidades.some(u => u.operadorId === op.id)
                        )}

                        onSuccess={handleSuccess}
                    />
                ) : (
                    <>
                        {activeTab === 'unidades' && (
                            <NuevaUnidadForm
                                onSuccess={handleSuccess}
                                operadores={operadores}
                                initialData={editingItem as Unidad}
                            />
                        )}

                        {activeTab === 'operadores' && (
                            <NuevoOperadorForm
                                empresaId={empresaId}
                                onSuccess={handleSuccess}
                                initialData={editingItem as Operador}
                            />
                        )}

                        {activeTab === 'rutas' && (
                            <NuevaRutaForm
                                empresaId={empresaId}
                                onSuccess={handleSuccess}
                                initialData={editingItem as Ruta}
                            />
                        )}
                    </>
                )}
            </Modal>
        </div>
    );
}