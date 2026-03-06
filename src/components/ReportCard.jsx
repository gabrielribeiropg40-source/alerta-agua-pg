import React from 'react';
import { Share2, MapPin, Calendar, Activity, AlertTriangle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReportCard({ report }) {
  const shareText = `Moradores estÃ£o registrando problemas de qualidade da Ã¡gua em Ponta Grossa. Veja esta denÃºncia!`;
  const reportUrl = `${window.location.origin}/denuncia/${report.id}`;

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + reportUrl)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reportUrl);
    alert('Link copiado!');
  };

  return (
    <div className="card report-card">
      <div className="report-header">
        {report.tipo === 'falta_agua' ? (
          <span className="report-badge" style={{ backgroundColor: '#ea580c', color: 'white' }}>
            <AlertCircle size={14} /> Falta de Ãgua
          </span>
        ) : (
          <span className="report-badge" data-color={report.cor_agua}>
            <Activity size={14} /> Cor: {report.cor_agua || 'NÃ£o informada'}
          </span>
        )}
        <span className="report-date">
          <Calendar size={14} /> {new Date(report.data).toLocaleDateString('pt-BR')}
        </span>
      </div>
      
      <div className="report-body">
        <h3 className="report-location">
          <MapPin size={18} className="text-primary" />
          {report.bairro} {report.vila ? `- ${report.vila}` : ''}
        </h3>
        
        <p className="report-desc">{report.descricao?.substring(0, 100)}{report.descricao?.length > 100 ? '...' : ''}</p>
        
        {report.foto_url && (
          <div className="report-image">
            <img src={report.foto_url} alt={`Ãgua em ${report.bairro}`} loading="lazy" />
          </div>
        )}
      </div>

      <div className="report-footer">
        <Link to={`/denuncia/${report.id}`} className="btn btn-primary" style={{ flex: 1 }}>
          Ver Detalhes
        </Link>
        <button className="btn btn-secondary share-btn" onClick={handleShareWhatsApp} aria-label="Compartilhar no WhatsApp">
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
}

