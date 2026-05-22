"use strict";
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LogOut,
  Bus,
  User,
  Route,
  MapPin
} from "lucide-react";

import Modal from "@/components/Modal";
import NuevaUnidadForm from "./nueva-unidad/NuevaUnidadForm";
import NuevoOperadorForm from "./nuevo-operador/NuevoOperadorForm"; 
import NuevaRutaForm from "./nueva-ruta/NuevaRutaForm";

// 1. imports desde tu carpeta componentsDashboard
import UnidadesTable from "./componentsDashboard/UnidadesTable";
import OperadoresTables from "./componentsDashboard/OperadoresTables";
import RutasTables from "./componentsDashboard/RutasTables";

import { eliminarUnidad } from "./nueva-unidad/actions";
import { eliminarOperador } from "./nuevo-operador/actions";
import { eliminarRuta } from "./nueva-ruta/actions";
import AsignarOperadorForm from "./nueva-unidad/asignarOperadorForm";

// Interfaces
interface Unidad {
  id: number;
  numero: string;
  placa: string;
  tipo: string;
  capacidad: number;
  usuario: { nombre: string } | null;
  operador: { nombre: string } | null;
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

export default function DashboardClient({
  nombreEmpresa,
  totalUnidades,
  unidades,
  totalOperadores,
  operadores,
  empresaId,
  totalRutas,
  rutas,
}: {
  nombreEmpresa: string;
  totalUnidades: number;
  unidades: Unidad[];
  totalOperadores: number;
  operadores: Operador[];
  empresaId: number;
  totalRutas: number;
  rutas: Ruta[];
}) {
  const router = useRouter();
  
  // Pestaña activa: "unidades", "operadores", "rutas"
  const [activeTab, setActiveTab] = useState<"unidades" | "operadores" | "rutas">("unidades");

  // Estados para modales y edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [editingItem, setEditingItem] = useState<Unidad | Operador | Ruta | null>(null);

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setIsAssigning(false);
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
      rutas: "esta ruta",
    };

    if (confirm(`¿Estás seguro de que deseas eliminar ${nombres[activeTab]}?`)) {
      try {
        if (activeTab === "unidades") await eliminarUnidad(id);
        if (activeTab === "operadores") await eliminarOperador(id);
        if (activeTab === "rutas") await eliminarRuta(id);
        router.refresh();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1329] text-white p-8">
      {/* --- HEADER --- */}
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-500">Manos Unidas | Panel de Control</h1>
          <p className="text-gray-400 text-sm mt-1">Gestión integral de flota y personal operativo.</p>
        </div>
        <button 
          onClick={() => signOut()}
          className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors text-sm"
        >
          <LogOut size={16} />
          Cerrar Sesión
        </button>
      </header>

      {/* --- TARJETAS DE ESTADÍSTICAS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1c2541] p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold tracking-wider uppercase">
            <Bus size={16} /> Unidades Registradas
          </div>
          <p className="text-4xl font-bold mt-2">{totalUnidades}</p>
        </div>
        <div className="bg-[#1c2541] p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold tracking-wider uppercase">
            <User size={16} /> Total Operadores
          </div>
          <p className="text-4xl font-bold mt-2">{totalOperadores}</p>
        </div>
        <div className="bg-[#1c2541] p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold tracking-wider uppercase">
            <Route size={16} /> Rutas Activas
          </div>
          <p className="text-4xl font-bold mt-2">{totalRutas}</p>
        </div>
        <div className="bg-[#1c2541] p-6 rounded-xl border border-gray-800">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold tracking-wider uppercase">
            <MapPin size={16} /> Próximos Viajes
          </div>
          <p className="text-4xl font-bold mt-2">0</p>
        </div>
      </div>

      {/* --- CONTENEDOR PRINCIPAL DE PESTAÑAS Y TABLAS --- */}
      <div className="bg-[#1c2541]/50 rounded-xl border border-gray-800 p-6">
        {/* Selector de Pestañas */}
        <div className="flex gap-2 mb-6 border-b border-gray-800 pb-4">
          <button
            onClick={() => setActiveTab("unidades")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "unidades" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Bus size={16} /> Unidades
          </button>
          <button
            onClick={() => setActiveTab("operadores")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "operadores" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <User size={16} /> Operadores
          </button>
          <button
            onClick={() => setActiveTab("rutas")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "rutas" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Route size={16} /> Rutas
          </button>
        </div>

        {/* Renderizado Condicional de las Tablas Modularizadas */}
        {activeTab === "unidades" && (
          <UnidadesTable 
            unidades={unidades} 
            onEdit={(unidad) => handleEdit(unidad)} 
            onDelete={handleDelete}
            onAssign={() => {
              setIsAssigning(true);
              setIsModalOpen(true);
            }}
            onRegister={() => {
              setEditingItem(null);
              setIsAssigning(false);
              setIsModalOpen(true);
            }}
          />
        )}

        {activeTab === "operadores" && (
          <OperadoresTables 
            operadores={operadores} 
            unidades={unidades}
            onEdit={(operador) => handleEdit(operador)} 
            onDelete={handleDelete}
            onRegister={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
          />
        )}

        {activeTab === "rutas" && (
          <RutasTables 
            rutas={rutas} 
            onEdit={(ruta) => handleEdit(ruta)} 
            onDelete={handleDelete}
            onRegister={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
          />
        )}
      </div>

      {/* --- MODAL DINÁMICO --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={
          activeTab === "unidades" 
            ? (isAssigning ? "Asignar Operador" : editingItem ? "Editar Unidad" : "Registrar Nueva Unidad")
            : activeTab === "operadores"
            ? (editingItem ? "Editar Operador" : "Registrar Nuevo Operador")
            : (editingItem ? "Editar Ruta" : "Registrar Nueva Ruta")
        }
      >
        {activeTab === "unidades" && isAssigning && (
          <AsignarOperadorForm 
            onSuccess={handleSuccess} 
            operadores={operadores} 
            unidades={unidades} 
          />
        )}
        {activeTab === "unidades" && !isAssigning && (
          <NuevaUnidadForm 
            onSuccess={handleSuccess} 
            operadores={operadores}
            initialData={editingItem as Unidad} 
          />
        )}
        {activeTab === "operadores" && (
          <NuevoOperadorForm 
            empresaId={empresaId}
            onSuccess={handleSuccess} 
            initialData={editingItem as Operador} 
          />
        )}
        {activeTab === "rutas" && (
          <NuevaRutaForm 
            empresaId={empresaId}
            onSuccess={handleSuccess} 
            initialData={editingItem as Ruta} 
          />
        )}
      </Modal>
    </div>
  );
}