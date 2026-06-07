from django.contrib import admin
from .models import Resume, Education, Experience, Project, Skill, Certification


class EducationInline(admin.TabularInline):
    model = Education
    extra = 1


class ExperienceInline(admin.TabularInline):
    model = Experience
    extra = 1


class ProjectInline(admin.TabularInline):
    model = Project
    extra = 1


class SkillInline(admin.TabularInline):
    model = Skill
    extra = 3


class CertificationInline(admin.TabularInline):
    model = Certification
    extra = 1


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display  = ['full_name', 'email', 'phone', 'template', 'updated_at']
    list_filter   = ['template']
    search_fields = ['full_name', 'email']
    inlines       = [ExperienceInline, EducationInline, ProjectInline, SkillInline, CertificationInline]


admin.site.register(Education)
admin.site.register(Experience)
admin.site.register(Project)
admin.site.register(Skill)
admin.site.register(Certification)
