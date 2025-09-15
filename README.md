
# 🎯 IdeaBoard

<img height="150" alt="image" src="https://github.com/user-attachments/assets/e6093de3-cad5-4deb-8562-470aff21913f" />
<img height="150" alt="image" src="https://github.com/user-attachments/assets/c1e5e87b-cd1d-4b42-b667-2a336e102d49" />


[![Node.js](https://img.shields.io/badge/Node.js-22+-green?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?logo=postgresql)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/NekeritStudio/Idea_Board.git)

> Backend para gestionar ideas, comentarios y votos construido con **Express**, **Drizzle ORM** y **PostgreSQL**.

---

## 📦 Requisitos

- Node.js ≥ 22  
- npm  
- PostgreSQL ≥ 14  
- Git (opcional)

---

## ⚡ Instalación

<details>
<summary>1️⃣ Clonar repositorio</summary>

```bash
git clone https://github.com/NekeritStudio/Idea_Board.git
cd Idea_Board
````

</details>

<details>
<summary>2️⃣ Instalar dependencias</summary>

```bash
npm install
```

</details>

<details>
<summary>3️⃣ Configurar variables de entorno</summary>

Crea un archivo `.env` basado en `.env.example`:

```env
DATABASE_URL=postgresql://root:password@localhost:3308/ideaboard
PORT=5000
```

> Ajusta `root`, `password` y `3308` según tu configuración.

</details>

---

## 🗄 Configuración de la base de datos

<details>
<summary>Crear base de datos y usuario</summary>

```sql
CREATE DATABASE ideaboard;
CREATE USER root WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE ideaboard TO root;
```

</details>

<details>
<summary>Crear tablas</summary>

```sql
CREATE TABLE ideas (
    id SERIAL PRIMARY KEY,
    author VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    idea_id INTEGER REFERENCES ideas(id) ON DELETE CASCADE NOT NULL,
    author VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    idea_id INTEGER REFERENCES ideas(id) ON DELETE CASCADE NOT NULL,
    username VARCHAR(100) NOT NULL,
    vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('up', 'down')),
    UNIQUE(idea_id, username)
);
```

</details>

<details>
<summary>Importar datos (opcional)</summary>

```bash
pg_dump -U root -p 3308 ideaboard > ideaboard.sql
psql -U root -p 3308 ideaboard < ideaboard.sql
```

</details>

---

## 🚀 Ejecutar la aplicación

```bash
npm run dev
```

> El servidor se ejecutará en `http://localhost:5000`.

### 🌐 Endpoints principales

<details>
<summary>Ver endpoints</summary>

| Emoji | Método | Endpoint                | Descripción                     |
| ----- | ------ | ----------------------- | ------------------------------- |
| 💡    | GET    | `/api/ideas`            | Obtener todas las ideas         |
| ✏️    | POST   | `/api/ideas`            | Crear una nueva idea            |
| 👍👎  | POST   | `/api/vote`             | Votar una idea                  |
| 💬    | GET    | `/api/comments/:ideaId` | Obtener comentarios de una idea |
| 📝    | POST   | `/api/comments`         | Crear un comentario             |
| 📊    | GET    | `/api/statistics`       | Obtener estadísticas            |

</details>

---

## 🔧 Notas

* Ajusta el `.env` si trabajas en otro equipo.
* Recomendado actualizar Browserslist:

```bash
npx update-browserslist-db@latest
```

### Variables de entorno importantes

* `DATABASE_URL`: URL de conexión a PostgreSQL
* `PORT`: puerto donde correrá el servidor (por defecto `5000`)

---

## 📁 Estructura del proyecto

```
/server
  ├─ db.ts          # Configuración de la base de datos
  ├─ storage.ts     # Acceso a ideas, votos, comentarios
  ├─ routes.ts      # Endpoints de la API
  └─ index.ts       # Entrada principal del servidor
/shared
  └─ schema.ts      # Esquemas Zod y Drizzle ORM
.env
package.json
```

---

## ✅ Resumen

1. Clona o copia el proyecto
2. Instala dependencias (`npm install`)
3. Configura `.env` con tu `DATABASE_URL`
4. Crea las tablas en PostgreSQL
5. Ejecuta `npm run dev`

---

## 📄 Licencia

MIT License © 2025

---

## 🤝 Contribuir

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

# 👥 Contribuidores
¡Gracias a todos los que colaboran en este proyecto! Puedes añadir tu nombre aquí:
* [Kennet Rodriguez](https://github.com/Kennetrl)
* [Hugo](https://github.com/hugooae)
* [Alberto](https://github.com/alberto2005-coder)
```
