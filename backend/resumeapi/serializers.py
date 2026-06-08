from urllib.parse import urlparse

from rest_framework import serializers
from .models import Resume, Education, Experience, Project, Skill, Certification


def normalize_url(value):
    if not value:
        return value

    url = value.strip()
    parsed = urlparse(url)
    if not parsed.scheme:
        url = 'https://' + url
    return url


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
        extra_kwargs = {
            'user': {'read_only': True},
        }

    def validate_linkedin(self, value):
        return normalize_url(value)

    def validate_github(self, value):
        return normalize_url(value)

    def validate_portfolio(self, value):
        return normalize_url(value)

    def validate_photo(self, value):
        if value and len(value.name) > 250:
            value.name = value.name[-250:]
        return value
