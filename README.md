# Portfolio Franco — Setup Guide

Stack: **Next.js 14 · Three.js · PostgreSQL · Prisma · Railway**

---

## 1. Instalación local

```bash
cd "Porfolio Franco"
npm install
```

## 2. Variables de entorno

Copiá el archivo de ejemplo y completá los valores:

```bash
cp .env.example .env
```

Editá `.env`:

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/portfolio"
ADMIN_PASSWORD="tu-contraseña-secreta"
JWT_SECRET="clave-super-secreta-de-al-menos-32-caracteres"

# Opcional — para recibir emails del formulario de contacto
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu@gmail.com"
SMTP_PASS="tu-app-password"
CONTACT_EMAIL="tu@gmail.com"
```

## 3. Base de datos

```bash
# Crear las tablas
npm run db:push

# (Opcional) explorar la DB visualmente
npm run db:studio
```

## 4. Tu foto de perfil

Guardá tu foto en:
```
public/images/Franco.png
```
Recomendación: formato JPG, tamaño ~600×600px o mayor.

## 5. Personalizá tu contenido

- **Proyectos** → `components/sections/ProjectsSection.tsx` (array `projects`)
- **Experiencia** → `components/sections/ExperienceSection.tsx` (array `experiences`)
- **Sobre mí** → `components/sections/AboutSection.tsx` (textos y stats)
- **Links sociales** → `components/sections/ContactSection.tsx` (array `socials`)
- **CV** → reemplazá `public/cv.pdf` con tu CV

## 6. Dev local

```bash
npm run dev
# → http://localhost:3000
# → http://localhost:3000/admin  (panel de admin)
```

---

## Deploy en Railway

### Paso a paso:

1. **Subí el código a GitHub**
   ```bash
   git init
   git add .
   git commit -m "feat: portfolio inicial"
   git remote add origin https://github.com/TU_USER/portfolio.git
   git push -u origin main
   ```

2. **Creá un proyecto en [railway.app](https://railway.app)**
   - New Project → Deploy from GitHub repo
   - Seleccioná tu repositorio

3. **Agregá PostgreSQL**
   - En Railway → New → Database → Add PostgreSQL
   - Copiá el `DATABASE_URL` que te da Railway

4. **Variables de entorno en Railway**
   - Settings → Variables → Bulk Import
   ```
   DATABASE_URL=postgresql://...
   ADMIN_PASSWORD=tu-contraseña
   JWT_SECRET=tu-secreto
   NODE_ENV=production
   ```

5. **Deploy automático** — Railway detecta `railway.toml` y hace el build solo.

---

## Panel de administración

URL: `tudominio.railway.app/admin`

Funcionalidades:
- 📊 Gráfico de visitas de los últimos 30 días
- ⚡ Top interacciones (clicks en proyectos, social links, etc.)
- 📄 Páginas más visitadas
- 📧 Bandeja de mensajes del formulario de contacto
- ✅ Marcar mensajes como leídos / respondidos
# portfolio26
