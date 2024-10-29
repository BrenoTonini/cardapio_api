const { createClient } = require('@supabase/supabase-js');
const config = require('../config');
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

function setupSupabaseMonitor(io) {
  const channel = supabase
    .channel('db-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'content_assignments',
      },
      (payload) => {
        console.log('Mudança detectada em content_assignments:', payload);
        // Enviar notificação para todos os clientes conectados
        io.emit('content_assignment_change', payload); // Envia um evento específico
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'device',
      },
      (payload) => {
        console.log('Mudança detectada em device:', payload);
        // Enviar notificação para todos os clientes conectados
        io.emit('device_change', payload); // Envia um evento específico
      }
    )
    .subscribe();
}

module.exports = setupSupabaseMonitor;
