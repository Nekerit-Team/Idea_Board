# 💡 Idea Board - Fullstack JavaScript

Una plataforma moderna para compartir ideas, votar y comentar construida con React, Express.js y PostgreSQL.

## 🚀 Características

- ✨ Crear y compartir ideas con la comunidad
- 👍👎 Sistema de votación en tiempo real
- 💬 Comentarios en cada idea
- 📊 Estadísticas actualizadas automáticamente
- 🎨 Diseño moderno con glass morphism y gradientes
- 📱 Interfaz completamente responsive
- 🔄 Actualizaciones en tiempo real cada 30 segundos

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos y diseño
- **Shadcn/UI** - Componentes de interfaz
- **TanStack Query** - Gestión de estado servidor
- **Wouter** - Enrutamiento
- **Lucide React** - Iconografía

### Backend
- **Express.js** - Servidor web
- **TypeScript** - Tipado estático
- **Drizzle ORM** - Base de datos ORM
- **PostgreSQL** - Base de datos
- **Zod** - Validación de esquemas

## 📋 Requisitos

- **Node.js 20** o superior
- **PostgreSQL** (se configura automáticamente en Replit)
- Navegador web moderno

## ⚙️ Configuración en Replit

### 1. Base de Datos

La aplicación utiliza PostgreSQL. En Replit, la base de datos se configura automáticamente con las siguientes variables de entorno:

```bash
DATABASE_URL=postgresql://username:password@host:port/database
PGHOST=your-host
PGUSER=your-username  
PGPASSWORD=your-password
PGDATABASE=your-database
PGPORT=your-port
```

### 2. Esquema de Base de Datos

El esquema se define en `shared/schema.ts` y incluye tres tablas principales:

#### Tabla: ideas
```sql
CREATE TABLE ideas (
    id SERIAL PRIMARY KEY,
    author VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

#### Tabla: votes  
```sql
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    idea_id INTEGER REFERENCES ideas(id) ON DELETE CASCADE NOT NULL,
    username VARCHAR(100) NOT NULL,
    vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('up', 'down')),
    UNIQUE(idea_id, username)
);
```

#### Tabla: comments
```sql
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    idea_id INTEGER REFERENCES ideas(id) ON DELETE CASCADE NOT NULL,
    author VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

### 3. Configuración Automática de la Base de Datos

Si necesitas recrear las tablas, puedes ejecutar:

```bash
# Sincronizar el esquema con la base de datos
npm run db:push
```

O si hay conflictos:

```bash
# Forzar sincronización (¡cuidado: puede eliminar datos!)
npm run db:push --force
```

## 🏃‍♂️ Instalación y Ejecución

### En Replit (Recomendado)

1. **Clona este repositorio** en tu Replit
2. **Las dependencias se instalan automáticamente**
3. **La base de datos se configura automáticamente**
4. **Ejecuta el proyecto:**
   ```bash
   npm run dev
   ```
5. **Accede a la aplicación** en la URL que proporciona Replit

### Instalación Local

1. **Clona el repositorio:**
   ```bash
   git clone <tu-repositorio>
   cd idea-board
   ```

2. **Instala dependencias:**
   ```bash
   npm install
   ```

3. **Configura variables de entorno:**
   Crea un archivo `.env` con:
   ```bash
   DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/ideaboard
   PGHOST=localhost
   PGUSER=tu-usuario
   PGPASSWORD=tu-contraseña
   PGDATABASE=ideaboard
   PGPORT=5432
   SESSION_SECRET=tu-clave-secreta-muy-segura
   ```

4. **Configura la base de datos:**
   ```bash
   # Crea la base de datos PostgreSQL
   createdb ideaboard
   
   # Sincroniza el esquema
   npm run db:push
   ```

5. **Ejecuta el proyecto:**
   ```bash
   npm run dev
   ```

6. **Accede a:** `http://localhost:5000`

## 📁 Estructura del Proyecto

```
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   │   ├── ui/        # Componentes de Shadcn/UI
│   │   │   ├── idea-card.tsx
│   │   │   ├── idea-form.tsx
│   │   │   └── statistics.tsx
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── lib/           # Utilidades y configuración
│   │   └── hooks/         # Custom hooks
│   └── index.html
├── server/                # Backend Express
│   ├── index.ts          # Servidor principal
│   ├── routes.ts         # Rutas de la API
│   ├── storage.ts        # Capa de acceso a datos
│   └── db.ts            # Configuración de base de datos
├── shared/               # Código compartido
│   └── schema.ts        # Esquema de base de datos y tipos
└── package.json
```

## 🔧 API Endpoints

### Ideas
- `GET /api/ideas` - Obtener todas las ideas con estadísticas
- `POST /api/ideas` - Crear nueva idea
  ```json
  {
    "author": "string",
    "title": "string", 
    "content": "string"
  }
  ```

### Votos
- `POST /api/vote` - Votar en una idea
  ```json
  {
    "ideaId": number,
    "username": "string",
    "voteType": "up" | "down"
  }
  ```

### Comentarios
- `GET /api/comments/:ideaId` - Obtener comentarios de una idea
- `POST /api/comments` - Añadir comentario
  ```json
  {
    "ideaId": number,
    "author": "string",
    "text": "string"
  }
  ```

### Estadísticas
- `GET /api/statistics` - Obtener estadísticas generales
  ```json
  {
    "totalIdeas": number,
    "totalComments": number,
    "totalVotes": number
  }
  ```

## 🐛 Solución de Problemas

### Error de Conexión a Base de Datos

1. **Verifica las variables de entorno:**
   ```bash
   # En Replit, ve a "Secrets" y verifica que existan:
   DATABASE_URL
   PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT
   ```

2. **Reinicia la aplicación:**
   ```bash
   # Detén y vuelve a ejecutar
   npm run dev
   ```

### Error 502 Bad Gateway

1. **Verifica que el servidor esté escuchando en el puerto correcto:**
   - El servidor debe estar en puerto 5000
   - Debe estar vinculado a `0.0.0.0:5000`

2. **Reinicia el Repl** si el problema persiste

### Error de TypeScript

1. **Ejecuta el comando de verificación:**
   ```bash
   npx tsc --noEmit
   ```

2. **Los errores más comunes están en:**
   - `server/storage.ts` - Tipos de base de datos
   - `shared/schema.ts` - Definiciones de esquema

### Base de Datos Vacía

1. **Verifica que las tablas existan:**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

2. **Si no existen, ejecuta:**
   ```bash
   npm run db:push
   ```

## 🚀 Despliegue en Producción

### En Replit Deployments

1. **Ve a la pestaña "Deployments"**
2. **Selecciona "Autoscale Deployment"**
3. **Configura:**
   - Comando: `npm run dev`
   - Puerto: `5000`
   - Variables de entorno: Se copian automáticamente
4. **Publica la aplicación**

### Variables de Entorno para Producción

Asegúrate de que estén configuradas:
- `DATABASE_URL` - URL completa de PostgreSQL
- `SESSION_SECRET` - Clave secreta para sesiones
- `NODE_ENV=production` - Modo de producción


## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

**¡Disfruta compartiendo tus ideas! 💡✨**

### 👥 Contribuidores
¡Gracias a todos los que colaboran en este proyecto! Puedes añadir tu nombre aquí:
- [Kennet Rodriguez](https://github.com/Kennetrl)
- [Alberto](https://github.com/alberto2005-coder)
