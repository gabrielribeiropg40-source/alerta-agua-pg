import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function FAB() {
  return (
    <Link to="/denuncia/nova" className="fab" aria-label="Nova Denúncia">
      <Plus size={28} />
    </Link>
  );
}
