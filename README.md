# Master Resume Portfolio

A modern, professional portfolio and resume management system built with Next.js and Directus CMS. Create and manage your professional resume, portfolio projects, and career accomplishments with a beautiful, customizable frontend.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Docker and Docker Compose

### 1. Backend Setup (Directus CMS)

```bash
cd backend
cp .env.example .env

# Generate secure keys for KEY and SECRET in .env
# You can use: openssl rand -hex 32

docker compose up -d
```

Wait for containers to start (first run takes a few minutes). Directus will be at `http://localhost:8055`

### 2. Load Schema & Sample Data

```bash
cd ..  # Return to project root
npx directus-template-cli@latest apply --directusUrl http://localhost:8055 --userEmail admin@example.com --userPassword d1r3ctu5 --templateLocation ./backend/template -p
```

This loads the complete schema plus sample data featuring "Roger Rabbit" as a demo profile.

### 3. Generate an API Token

1. Log into Directus at `http://localhost:8055/admin` (admin@example.com / d1r3ctu5)
2. Go to `http://localhost:8055/admin/users` and select the Admin user
3. Scroll to **Token**, generate a token, and click the checkmark to save
4. Copy the token for the frontend setup

### 4. Frontend Setup

```bash
cd frontend
pnpm install
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
DIRECTUS_TOKEN=your_token_from_step_3
NEXT_PUBLIC_USE_STATIC=false
ANTHROPIC_API_KEY=your_anthropic_key  # Optional: for AI features
```

Start the development server:
```bash
pnpm dev
```

Frontend will be at `http://localhost:3000`

---

## 📦 Template Details

The template includes:
- **Schema**: All collections, fields, and relations
- **Sample Data**: Identity, companies, positions, accomplishments, skills, technologies, projects, education, and certifications

### Re-extracting the Template (after making schema changes)

If you've modified the schema and want to update the template:

```bash
npx directus-template-cli@latest extract --directusUrl http://localhost:8055 --userEmail admin@example.com --userPassword d1r3ctu5 --templateLocation ./backend/template --templateName master-resume -p
```

---

## 🧹 Starting Fresh (Your Own Resume)

To remove all sample data and start with your own information:

### Option 1: Nuke Everything (Recommended for fresh start)

This removes all data, images, and Docker artifacts:

**Windows (PowerShell):**
```powershell
cd backend
.\nuke.ps1
```

**Windows (Command Prompt):**
```cmd
cd backend
nuke.bat
```

Then restart and add your own data:

```powershell
docker compose up --build -d
```

Once running, add your data through:
- **Directus Admin UI** at `http://localhost:8055/admin`
- **Add Content chatbot** in the frontend's Interview section

### Option 2: Clear Data via Directus Admin

1. Log into Directus at `http://localhost:8055/admin`
2. Go to each collection and delete items
3. Add your own data through the Directus UI or the "Add Content" chatbot

### Option 3: Start Empty and Add Your Own Data

1. Run the nuke script to clear everything:
   ```powershell
   cd backend
   .\nuke.ps1
   ```

2. Start fresh (don't run restore.ps1):
   ```powershell
   docker compose up --build -d
   ```

3. Add your own data through:
   - The Directus admin UI at `http://localhost:8055/admin`
   - The "Add Content" chatbot in the frontend
   - Direct API calls

---

## 🤖 AI Features

The portfolio includes AI-powered features when you provide an Anthropic API key:

### Interview Practice Chat
Practice answering interview questions about your resume. The AI acts as you, answering questions based on your actual data.

### Add Content Chat
Quickly add new items to your resume by just describing them:
- "Add Python" → Adds Python as a technology
- "I know React and TypeScript" → Adds both technologies
- "AWS certified" → Adds as a certification
- "I led a team that increased revenue by 25%" → Adds as an accomplishment

### Claude Code MCP Integration

The Directus MCP server allows Claude Code to directly query and manage your resume content. This enables AI-powered content management through natural language.

#### Setup Instructions:

1. **Enable the MCP Server in Directus:**
   - Log into Directus at `http://localhost:8055/admin`
   - Go to **Settings** (gear icon in the sidebar)
   - Select **AI**
   - Toggle **MCP Server** to enabled

2. **Create the MCP configuration file:**
   ```bash
   cp .mcp.json.example .mcp.json
   ```

3. **Edit `.mcp.json` with your Directus token** (the token you generated in "Generate an API Token" step above):
   ```json
   {
     "mcpServers": {
       "directus": {
         "url": "http://localhost:8055/mcp",
         "type": "http",
         "headers": {
           "Authorization": "Bearer YOUR_DIRECTUS_TOKEN"
         }
       }
     }
   }
   ```

4. **Restart Claude Code** to load the MCP server configuration. The server will automatically connect when Claude Code starts.

5. **Verify the connection** by asking Claude Code to:
   - "List all my accomplishments"
   - "Add a new skill: Python"
   - "Show my work experience"
   - "Update my bio"

#### Troubleshooting MCP Connection:

- **Server not showing up:** Ensure `.mcp.json` is in the project root and restart Claude Code
- **MCP not enabled:** Enable the MCP Server in Directus at Settings → AI
- **Authentication errors:** Verify your token is correct and has admin permissions
- **Connection refused:** Ensure Directus is running (`docker compose up -d` in backend folder)
- **Production deployment:** Update the URL to your production URL (e.g., `https://your-app.railway.app/mcp`)

**Important:** The `.mcp.json` file contains sensitive credentials and is excluded from git. Never commit this file to version control.

---

## 🛠️ Available Scripts

### Frontend (`/frontend`)

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript checks
```

### Backend (`/backend`)

```bash
docker compose up -d       # Start Directus and database
docker compose down        # Stop containers
docker compose logs -f     # View logs
docker compose up --build  # Rebuild and start (after Dockerfile changes)

# Data scripts (Windows)
.\backups\restore.ps1     # Load/restore sample data from SQL backup
.\reset.ps1               # Reset database (clears all data)
.\nuke.ps1                # Remove everything including Docker images
```

---

## 📁 Project Structure

```
master-resume/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   └── lib/             # Utilities and data fetching
│   └── public/              # Static assets
├── backend/                  # Directus CMS backend
│   ├── template/            # Directus template (schema + sample data)
│   ├── backups/             # SQL backup files
│   ├── uploads/             # Uploaded files (images, etc.)
│   ├── reset.ps1            # Reset database script
│   └── nuke.ps1             # Full cleanup script
├── .mcp.json.example        # Claude Code MCP configuration template
└── README.md
```

---

## 🎨 Features

- **Dynamic Theme System**: Colors controlled via Directus CMS
- **Professional Design**: Navy/Blue/Emerald/Amber color scheme
- **Responsive Layout**: Mobile-first design approach
- **Type Safety**: Full TypeScript integration
- **Performance Optimized**: Built with Next.js 15
- **AI-Powered**: Interview practice and content builder chatbots
- **Template CLI**: Easy schema and data import/export

---

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check container logs
docker compose logs -f directus

# Ensure ports aren't in use
# Directus: 8055, PostgreSQL: 5433, Redis: 6379
```

### Database connection issues
```bash
# Check if database is healthy
docker compose ps

# Wait for database to be ready (first start can take a minute)
docker compose logs -f database
```

### Frontend can't connect to Directus
1. Ensure Directus is running: `http://localhost:8055`
2. Check your `.env.local` has the correct `DIRECTUS_TOKEN`
3. Verify CORS is enabled in Directus (it is by default)

### Reset everything if stuck
```powershell
cd backend
.\nuke.ps1
docker compose up --build -d
```

---

## 📝 License

MIT License - Feel free to use this for your own portfolio!
