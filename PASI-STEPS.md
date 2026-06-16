# Local Development & Contribution Guide

This guide documents the local setup, git workflow, and pull request procedures for this repository.

---

## 1. Local Services Setup (Colima & Supabase)

If you are using **Colima** on macOS as your Docker daemon, follow these steps to start local services without hitting the socket mounting permission error (`operation not supported`).

### Starting the Docker Daemon (Colima)

1. Since Colima is initialized with `virtiofs`, you need to symlink the socket on your macOS host:
   ```bash
   sudo ln -sf ~/.colima/default/docker.sock /var/run/docker.sock
   ```
2. Point the `DOCKER_HOST` environment variable to the symlink:
   ```bash
   export DOCKER_HOST="unix:///var/run/docker.sock"
   ```
   _Tip: To make this persistent, append it to your shell profile:_
   ```bash
   echo 'export DOCKER_HOST="unix:///var/run/docker.sock"' >> ~/.zshrc
   ```

### Starting the Supabase Backend

Once Colima is running:

1. Start the local database and auth containers:
   ```bash
   npx supabase start
   ```
2. Once successful, copy the **`anon key`** and **`service_role key`** from the console output and update your `.env.local` file:
   ```env
   VITE_SUPABASE_ANON_KEY="<your_anon_key>"
   SUPABASE_SERVICE_ROLE_KEY="<your_service_role_key>"
   ```

---

## 2. Local Tunnels Configuration

Because mesh generation features rely on external providers hitting callbacks or fetching files from your local environment, you need two active tunnels:

1. **App Dev Server Tunnel (Port 3000)**:
   - Run ngrok forwarding to `3000`:
     ```bash
     ngrok http 3000
     ```
   - Update your `.env.local`:
     ```env
     WEBHOOK_BASE_URL="https://your-ngrok-url.ngrok-free.dev"
     ```

2. **Supabase Local Storage Tunnel (Port 54321)**:
   - Run a cloudflared tunnel forwarding to `54321`:
     ```bash
     cloudflared tunnel --url http://localhost:54321
     ```
   - Copy the generated `.trycloudflare.com` URL and update your `.env.local`:
     ```env
     NGROK_URL="https://your-temporary-domain.trycloudflare.com"
     ```

---

## 3. Git Fork Workflow

Your workspace is configured with two remotes:

- **`origin`**: Your personal GitHub repository (used for saving/backing up your changes).
- **`upstream`**: The original project repository (used for fetching updates).

To verify this configuration:

```bash
git remote -v
```

---

## 4. Submitting a Pull Request (PR)

> [!WARNING]
> Do not commit or submit PRs for your local-only config tweaks (like disabling Supabase email verification in `supabase/config.toml` or custom developer API keys in `.env.local`).

To contribute clean features or bug fixes back to the main project, use this workflow:

### Step 1: Create a Clean Branch

Ensure you start from the latest version of the original repository:

```bash
# 1. Fetch latest updates from the main project
git fetch upstream

# 2. Create and switch to a new feature branch based on upstream's master
git checkout -b feature/my-cool-feature upstream/master
```

### Step 2: Make & Commit Changes

Make your changes, stage them, and commit:

```bash
# 1. Stage the files you changed
git add src/path/to/file.ts

# 2. Commit your work
git commit -m "feat: describe your contribution here"
```

### Step 3: Push to your personal fork (`origin`)

Push your clean feature branch to your own GitHub repository:

```bash
git push -u origin feature/my-cool-feature
```

### Step 4: Open the PR on GitHub

1. Go to your fork's GitHub repository page in your browser (e.g., `https://github.com/YOUR_GITHUB_USERNAME/CADAM`).
2. Click the yellow **"Compare & pull request"** banner.
3. Review the code diff, fill out the description, and click **"Create pull request"** to send it to the upstream repository.

