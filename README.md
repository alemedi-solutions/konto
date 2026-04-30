# App de Control de Gastos

Aplicación de control de gastos personal con diseño Revolut/fintech moderno.

## Stack
- **Next.js 15** (App Router)
- **React 19** + TypeScript
- **CSS Variables** (sin frameworks externos)

## Instalación

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura

```
app/
  layout.tsx       # Root layout + importación de globals.css
  page.tsx         # Página principal
  globals.css      # Todos los tokens de diseño y clases CSS
components/
  GastosApp.tsx    # Shell principal + router de pantallas
  Dashboard.tsx    # Pantalla de inicio con balance hero
  Transactions.tsx # Lista y filtros de movimientos
  Analytics.tsx    # Gráfico de barras + desglose por categoría
  Budgets.tsx      # Presupuestos por categoría con progress bars
  Categories.tsx   # Gestión de categorías (crear/editar/eliminar)
  Profile.tsx      # Perfil, tema, exportar CSV, reset
  AddSheet.tsx     # Sheet para añadir/editar transacciones
  Shared.tsx       # Componentes reutilizables (StatusBar, Card, etc.)
  TabBar.tsx       # Barra de navegación flotante (6 pestañas)
lib/
  store.tsx        # Context + estado global (React, sin localStorage)
  types.ts         # Tipos TypeScript
  data.ts          # Categorías por defecto, transacciones demo, paleta
  helpers.ts       # Utilidades de fecha, formato de importes, etc.
```

## Pantallas

| Pestaña | Pantalla | Descripción |
|---------|----------|-------------|
| 🏠 | Dashboard | Balance mensual, acciones rápidas, últimos movimientos |
| 📋 | Movimientos | Historial completo con búsqueda y filtros |
| ➕ | Añadir | Sheet para nuevo gasto/ingreso con keypad |
| 📊 | Analytics | Gráfico 6 meses + desglose por categoría |
| 🗂️ | Categorías | Gestión completa (crear, editar, eliminar) |
| 👤 | Perfil | Tema, gradiente, exportar CSV, restablecer |

## Extensiones sugeridas
- **Auth**: añadir NextAuth.js + base de datos (Supabase / Prisma + PostgreSQL)
- **Persistencia**: reemplazar el estado en memoria por llamadas a API Routes de Next.js
- **PWA**: añadir `next-pwa` para instalación en móvil
- **i18n**: usar `next-intl` si se necesita multiidioma
# konto
