// src/components/Modal.tsx
"use client";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* =======================================================
        AQUÍ ESTÁ EL CAMBIO CLAVE PARA ACLARAR EL FONDO
        1. Bajamos la opacidad del tinte oscuro de 80 a 60 (/60).
        2. Bajamos el desenfoque de 'md' a 'sm' (blur-sm).
        =======================================================
      */}
            <div
                className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Contenedor del formulario (Se mantiene oscuro para resaltar) */}
            <div className="relative z-10 w-full max-w-md bg-[#1e293b] border border-slate-700/95 rounded-xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">

                {/* Cabecera */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-blue-400">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors text-2xl"
                    >
                        &times;
                    </button>
                </div>

                {/* Formulario */}
                {children}
            </div>
        </div>
    );
}