/**
 * Configuração da API central para o projeto
 * Este arquivo centraliza as URLs da API para facilitar a mudança entre ambientes
 */

// Determina o ambiente atual
const isProduction = import.meta.env.PROD || 
                    window.location.hostname !== 'localhost' && 
                    window.location.hostname !== '127.0.0.1';

// URLs base da API conforme o ambiente
export const API_URL = isProduction 
                      ? 'https://api-backend-production-5b22.up.railway.app' 
                      : 'https://api-backend-production-5b22.up.railway.app';

// URLs base da aplicação conforme o ambiente
export const FRONTEND_URL = isProduction
                           ? 'https://encontreluizantonio.com.br'
                           : 'https://encontreluizantonio.com.br';

// URLs específicas para cada recurso
export const API_ENDPOINTS = {
  // Autenticação
  auth: {
    login: `${API_URL}/auth/login`,
    register: `${API_URL}/auth/register`,
    refresh: `${API_URL}/auth/refresh-token`,
  },
  
  // Painel
  painel: {
    meuComercio: (userId: string) => `${API_URL}/painel/meu-comercio/${userId}`,
    atualizarComercio: `${API_URL}/painel/meu-comercio/atualizar-comercio`,
    produtos: `${API_URL}/painel/produto/produtos`,
    produto: (id: string) => `${API_URL}/painel/produto/produtos/${id}`,
    promocoes: `${API_URL}/painel/promocao/promocoes`,
    promocao: (id: string) => `${API_URL}/painel/promocao/promocoes/${id}`,
    mensagens: `${API_URL}/painel/mensagens/mensagens`,
    mensagem: (id: string) => `${API_URL}/painel/mensagens/mensagens/${id}`,
    mensagensUsuario: (userId: string) => `${API_URL}/painel/mensagens/mensagens/${userId}`,
    planos: `${API_URL}/painel/planos`,
  },
  
  // Mercado Pago
  mercadoPago: {
    testConnection: `${API_URL}/mercadopago/test-connection`,
    payment: (id: string) => `${API_URL}/mercadopago/payment/${id}`,
    pix: `${API_URL}/mercadopago/pix`,
    webhook: `${API_URL}/mercadopago/webhook`,
    success: `${API_URL}/mercadopago/pagamento/sucesso`,
  },
  
  // Cadastro
  cadastro: {
    comercio: `${API_URL}/cadastrar-comercio`,
  },
  
  // Anúncios
  anuncios: {
    destaque: `${API_URL}/anunciosdestaque`,
  },
};

export default API_ENDPOINTS;