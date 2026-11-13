# 💖 Akash & Nitisha (Nitu) - Free Hosting Guide

Your website is already committed to a local Git repository on the `main` branch. 

Here are the two simplest ways to get your free live link to send to Nitu:

---

## 🌟 Option A: GitHub Pages (Free forever, clean link)

### Step 1: Create an empty repository on GitHub
1. Open [https://github.com/new](https://github.com/new)
2. Enter repository name: **`for-nitu`** (or any name you like)
3. Set it to **Public**
4. Leave all checkboxes (**README**, **.gitignore**, **license**) **UNCHECKED**
5. Click **"Create repository"**

### Step 2: Push your code
Open PowerShell in this folder (`c:\Users\ap775\OneDrive\Desktop\nitisha`) and run:
```powershell
git remote add origin https://github.com/Akashsinghiiitb/for-nitu.git
git push -u origin main
```
*(Or simply run `./push_to_github.ps1`)*

### Step 3: Turn on GitHub Pages
1. Go to your repository settings: `https://github.com/Akashsinghiiitb/for-nitu/settings/pages`
2. Under **"Build and deployment"** ➔ **Branch**, choose **`main`** and folder **`/(root)`**
3. Click **Save**

Within 1 minute, your site will be live at:
👉 **`https://akashsinghiiitb.github.io/for-nitu/`**

---

## ⚡ Option B: Vercel (1-Click Deploy)

Once you push to GitHub:
1. Go to [https://vercel.com/new](https://vercel.com/new) and log in with your GitHub account (`Akashsinghiiitb`).
2. You will see **`for-nitu`** in the list — click **"Import"**.
3. Leave all settings as default and click **"Deploy"**.
4. In 20 seconds, Vercel gives you a live link like:
   👉 **`https://for-nitu.vercel.app`**
