from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/refresh/', views.refresh_token, name='refresh-token'),

    # Resume
    path('resume/',            views.resume_list_create, name='resume-list-create'),
    path('resume/<int:pk>/',   views.resume_detail,      name='resume-detail'),

    # Experience
    path('experience/',            views.experience_create, name='experience-create'),
    path('experience/<int:pk>/',   views.experience_detail, name='experience-detail'),

    # Education
    path('education/',            views.education_create, name='education-create'),
    path('education/<int:pk>/',   views.education_detail, name='education-detail'),

    # Project
    path('project/',            views.project_create, name='project-create'),
    path('project/<int:pk>/',   views.project_detail, name='project-detail'),

    # Skill
    path('skill/',            views.skill_create, name='skill-create'),
    path('skill/<int:pk>/',   views.skill_delete, name='skill-delete'),

    # Certification
    path('certification/',            views.certification_create, name='certification-create'),
    path('certification/<int:pk>/',   views.certification_detail, name='certification-detail'),
]
