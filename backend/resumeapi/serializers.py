from rest_framework import serializers
from .models import Resume, Education, Experience, Project, Skill, Certification


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = '__all__'


class ResumeSerializer(serializers.ModelSerializer):
    educations     = EducationSerializer(many=True, read_only=True)
    experiences    = ExperienceSerializer(many=True, read_only=True)
    projects       = ProjectSerializer(many=True, read_only=True)
    skills         = SkillSerializer(many=True, read_only=True)
    certifications = CertificationSerializer(many=True, read_only=True)

    class Meta:
        model = Resume
        fields = '__all__'


class ResumeWriteSerializer(serializers.ModelSerializer):
    """Used for create/update — no nested reads needed."""
    class Meta:
        model = Resume
        fields = '__all__'
