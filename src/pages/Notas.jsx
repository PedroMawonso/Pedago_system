import React from 'react';
import { ClipboardList } from 'lucide-react';

function Notas() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notas</h1>
        <p className="text-sm text-gray-500 mt-1">Registo e gestão de avaliações</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
        <ClipboardList size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">Módulo em desenvolvimento</p>
        <p className="text-gray-400 text-sm mt-1">Esta funcionalidade estará disponível na Fase 3 do sistema</p>
      </div>
    </div>
  );
}

export default Notas;
