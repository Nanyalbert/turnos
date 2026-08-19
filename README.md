# Black Turnos v1

Primera base funcional para la Central de Turnos de Black Óptica.

## Incluye
- Agenda interna semanal/mensual.
- Filtro por profesional y estado.
- Alta de profesionales.
- Configuración semanal de disponibilidad.
- Alta manual de turnos.
- Reserva pública estilo Calendly: el paciente sólo ve días/horarios libres.
- Prevención básica de doble reserva en modo local.
- Esquema SQL inicial para Supabase.

## Modo actual
La demo usa `localStorage`, por lo que `index.html` y `booking.html` comparten datos cuando se abren desde el mismo dominio. Esto permite validar todo el flujo sin modificar todavía la base productiva.

## Próximo paso recomendado
1. Crear las tablas en Supabase con `supabase/schema.sql`.
2. Reemplazar `js/store.js` por un adaptador Supabase.
3. Crear una RPC/Edge Function pública que devuelva sólo slots disponibles.
4. Conectar la creación de turno al automatizador de WhatsApp.
5. Integrar `index.html` como módulo `/turnos/` de Black Enterprise y `booking.html` como página pública.

## Privacidad
La página pública nunca debe consultar las tablas `patients` ni `appointments` directamente. Debe recibir únicamente una lista de horarios disponibles desde backend.
