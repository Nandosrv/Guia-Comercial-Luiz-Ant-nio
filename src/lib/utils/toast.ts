import { writable } from 'svelte/store';

// Definindo o tipo para os itens de toast
interface ToastItem {
  id: number;
  message: string;
  type: string;
  duration: number;
}

// Criando o store para toast notifications
export const toastStore = writable<ToastItem[]>([]);

/**
 * Exibe uma notificação toast
 * @param message A mensagem a ser exibida
 * @param type O tipo da notificação (success, error, info, warning)
 * @param duration Duração em ms da notificação
 */
export function showToast(message: string, type = 'info', duration = 3000) {
  const id = Date.now();
  const toast: ToastItem = { id, message, type, duration };
  
  toastStore.update((all: ToastItem[]) => [...all, toast]);
  
  setTimeout(() => {
    toastStore.update((all: ToastItem[]) => all.filter((t: ToastItem) => t.id !== id));
  }, duration);
}

/**
 * Exibe uma notificação de sucesso
 * @param message A mensagem a ser exibida
 * @param duration Duração em ms da notificação
 */
export function showSuccess(message: string, duration = 3000) {
  showToast(message, 'success', duration);
}

/**
 * Exibe uma notificação de erro
 * @param message A mensagem a ser exibida
 * @param duration Duração em ms da notificação
 */
export function showError(message: string, duration = 3000) {
  showToast(message, 'error', duration);
}

/**
 * Exibe uma notificação de aviso
 * @param message A mensagem a ser exibida
 * @param duration Duração em ms da notificação
 */
export function showWarning(message: string, duration = 3000) {
  showToast(message, 'warning', duration);
}

/**
 * Exibe uma notificação informativa
 * @param message A mensagem a ser exibida
 * @param duration Duração em ms da notificação
 */
export function showInfo(message: string, duration = 3000) {
  showToast(message, 'info', duration);
} 