import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dbReports } from '../services/db';
import Map from '../components/Map';
import SEO from '../components/SEO';
import { MapPin, Calendar, Droplets, Share2, Facebook } from 'lucide-react';

export default function ReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const found = dbReports.findById(id);
    setReport(found);
  }, [id]);

  if (!report) {
    return <div className="page-container mt-4"><h2 className="text-center">Denúncia não encontrada</h2></div>;
  }

  const shareText = `Alerta de água em Ponta Grossa. Veja esta denúncia registrada por moradores no bairro ${report.bairro}.`;
  const reportUrl = window.location.href;

  const handleShareWhatsApp = () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + reportUrl)}`, '_blank');
  const handleShareFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(reportUrl)}`, '_blank');
  const handleCopyLink = () => { navigator.clipboard.writeText(reportUrl); alert('Link copiado!'); };

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <SEO 
        title={`Denúncia de Água em ${report.bairro}`} 
        description={`Morador relatou água ${report.cor_agua} no bairro ${report.bairro}. Confira no Alerta Água PG.`} 
        url={reportUrl}
      />
      
      <div className="card shadow-md">
        {report.foto_url && (
          <img src={report.foto_url} alt="Água" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px 8px 0 0', marginBottom: '1.5rem', display: 'block', marginLeft: '-1.5rem', marginTop: '-1.5rem', paddingRight: '3rem' }} />
        )}

        <div className="report-header" style={{ marginBottom: '1.5rem' }}>
          <span className="report-badge" data-color={report.cor_agua}>
            Cor: {report.cor_agua}
          </span>
          <span className="report-badge" style={{ background: '#e2e8f0' }}>
            Cheiro: {report.cheiro}
          </span>
        </div>

        <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin color="var(--primary-color)" /> {report.bairro}
          {report.vila && <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}> - {report.vila}</span>}
        </h1>

        <p className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Calendar size={18} /> {new Date(report.data).toLocaleString('pt-BR')}
        </p>

        {report.descricao && (
          <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px', marginBottom: '2rem' }}>
            <p style={{ margin: 0, fontStyle: 'italic' }}>"{report.descricao}"</p>
          </div>
        )}

        <h3 style={{ marginBottom: '1rem' }}>Localização Aproximada</h3>
        <div style={{ marginBottom: '2rem' }}>
          <Map reports={[report]} height="250px" />
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Compartilhe para alertar os vizinhos</h3>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleShareWhatsApp} style={{ background: '#25D366' }}>
              <Share2 size={18}/> WhatsApp
            </button>
            <button className="btn btn-primary" onClick={handleShareFacebook} style={{ background: '#1877F2' }}>
              <Facebook size={18}/> Facebook
            </button>
            <button className="btn btn-secondary" onClick={handleCopyLink}>
              Copiar Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
