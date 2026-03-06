import { dbReports } from './db';

// Spam Filter Configuration
const MAX_REPORTS_PER_DAY = 3;
const BLOCK_DURATION_MINUTES = 10;

export const spamFilter = {
  checkCanReport: (userId) => {
    if (!userId) return { allowed: false, error: 'Usuário não autenticado.' };

    const now = new Date();
    const userReports = dbReports.getAll().filter(r => r.user_id === userId);
    
    // Sort by most recent
    userReports.sort((a, b) => new Date(b.data) - new Date(a.data));

    // Check last 10 minutes block
    if (userReports.length > 0) {
      const lastReportDate = new Date(userReports[0].data);
      const diffMinutes = (now - lastReportDate) / (1000 * 60);
      if (diffMinutes < BLOCK_DURATION_MINUTES) {
        return { 
          allowed: false, 
          error: `Por favor, aguarde ${Math.ceil(BLOCK_DURATION_MINUTES - diffMinutes)} minutos até registrar outra denúncia para evitar spam.` 
        };
      }
    }

    // Check daily limit (last 24h)
    const last24hReports = userReports.filter(r => {
      const reportDate = new Date(r.data);
      const diffHours = (now - reportDate) / (1000 * 60 * 60);
      return diffHours <= 24;
    });

    if (last24hReports.length >= MAX_REPORTS_PER_DAY) {
      return { 
        allowed: false, 
        error: `Você atingiu o limite de ${MAX_REPORTS_PER_DAY} denúncias diárias. Tente novamente amanhã.` 
      };
    }

    return { allowed: true };
  }
};
