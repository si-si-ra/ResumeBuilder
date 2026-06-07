# Day 8 – Resume Builder App | Django REST + React

Part of Sisira's **100 Projects in 100 Days** portfolio challenge.

## Features

- ✅ Django REST API with function-based views
- ✅ Personal Info, Experience, Education, Projects, Skills, Certifications
- ✅ Live split-screen preview (updates as you type)
- ✅ 3 resume templates: **Classic**, **Modern** (sidebar), **Minimal**
- ✅ PDF export via `html2pdf.js`
- ✅ Profile photo upload (stored in Django media)
- ✅ Skill categories (Technical / Tools / Soft / Language)
- ✅ Quick-add skill suggestions
- ✅ Dark mode
- ✅ Django Admin with inline editing
- ✅ Full CRUD on all sections

---

## Project Structure

```
resume-builder/
├── backend/
│   ├── resumeproject/        # settings, urls, wsgi
│   ├── resumeapi/            # models, views (FBV), serializers, admin
│   ├── requirements.txt
│   └── manage.py
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── forms/        # PersonalInfoForm, ExperienceForm, ...
    │   │   ├── templates/    # ClassicTemplate, ModernTemplate, MinimalTemplate
    │   │   ├── Sidebar.jsx
    │   │   ├── FormPanel.jsx
    │   │   └── PreviewPanel.jsx
    │   ├── styles/
    │   ├── App.jsx
    │   ├── ResumeContext.jsx  # global state
    │   ├── api.js            # axios instance
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/resume/` | List / Create resume |
| GET/PUT/PATCH/DELETE | `/api/resume/<id>/` | Resume detail |
| POST | `/api/experience/` | Add experience |
| PUT/DELETE | `/api/experience/<id>/` | Edit / Delete experience |
| POST | `/api/education/` | Add education |
| PUT/DELETE | `/api/education/<id>/` | Edit / Delete |
| POST | `/api/project/` | Add project |
| PUT/DELETE | `/api/project/<id>/` | Edit / Delete |
| POST | `/api/skill/` | Add skill |
| DELETE | `/api/skill/<id>/` | Delete skill |
| POST | `/api/certification/` | Add certification |
| PUT/DELETE | `/api/certification/<id>/` | Edit / Delete |

---

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API root: `http://127.0.0.1:8000/api/`
Admin:    `http://127.0.0.1:8000/admin/`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:5173`

---

## How to Use

1. Start Django backend and React frontend.
2. Fill in **Personal Info** → click **Create Resume**.
3. Navigate through sections (Experience, Education, Projects, Skills, Certifications).
4. Switch templates in the **Templates** tab — preview updates instantly.
5. Click **Download PDF** to export.

---

## Resume Point

> Built a full-stack Resume Builder using Django REST Framework and React featuring live preview, PDF export, photo upload, multiple templates, and CRUD operations across personal info, experience, education, projects, skills, and certifications sections.

## GitHub Title

`Day 8 - Resume Builder App | Django REST + React`
