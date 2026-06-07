from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status

from .models import Resume, Education, Experience, Project, Skill, Certification
from .serializers import (
    ResumeSerializer, ResumeWriteSerializer,
    EducationSerializer, ExperienceSerializer,
    ProjectSerializer, SkillSerializer, CertificationSerializer,
)


# ── RESUME ────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def resume_list_create(request):
    """
    GET  /api/resume/         – list all resumes
    POST /api/resume/         – create a new resume
    """
    if request.method == 'GET':
        resumes = Resume.objects.all().order_by('-updated_at')
        serializer = ResumeSerializer(resumes, many=True, context={'request': request})
        return Response(serializer.data)

    serializer = ResumeWriteSerializer(data=request.data)
    if serializer.is_valid():
        resume = serializer.save()
        out = ResumeSerializer(resume, context={'request': request})
        return Response(out.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def resume_detail(request, pk):
    """
    GET    /api/resume/<pk>/  – retrieve with all nested data
    PUT    /api/resume/<pk>/  – full update
    PATCH  /api/resume/<pk>/  – partial update
    DELETE /api/resume/<pk>/  – delete
    """
    try:
        resume = Resume.objects.get(pk=pk)
    except Resume.DoesNotExist:
        return Response({'error': 'Resume not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ResumeSerializer(resume, context={'request': request})
        return Response(serializer.data)

    if request.method in ('PUT', 'PATCH'):
        partial = request.method == 'PATCH'
        serializer = ResumeWriteSerializer(resume, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            out = ResumeSerializer(resume, context={'request': request})
            return Response(out.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    resume.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# ── EXPERIENCE ────────────────────────────────────────────────

@api_view(['POST'])
def experience_create(request):
    serializer = ExperienceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
def experience_detail(request, pk):
    try:
        exp = Experience.objects.get(pk=pk)
    except Experience.DoesNotExist:
        return Response({'error': 'Not found.'}, status=404)

    if request.method == 'PUT':
        serializer = ExperienceSerializer(exp, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    exp.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# ── EDUCATION ─────────────────────────────────────────────────

@api_view(['POST'])
def education_create(request):
    serializer = EducationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
def education_detail(request, pk):
    try:
        edu = Education.objects.get(pk=pk)
    except Education.DoesNotExist:
        return Response({'error': 'Not found.'}, status=404)

    if request.method == 'PUT':
        serializer = EducationSerializer(edu, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    edu.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# ── PROJECT ───────────────────────────────────────────────────

@api_view(['POST'])
def project_create(request):
    serializer = ProjectSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
def project_detail(request, pk):
    try:
        proj = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return Response({'error': 'Not found.'}, status=404)

    if request.method == 'PUT':
        serializer = ProjectSerializer(proj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    proj.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# ── SKILL ─────────────────────────────────────────────────────

@api_view(['POST'])
def skill_create(request):
    # Support bulk create: pass a list
    many = isinstance(request.data, list)
    serializer = SkillSerializer(data=request.data, many=many)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def skill_delete(request, pk):
    try:
        skill = Skill.objects.get(pk=pk)
    except Skill.DoesNotExist:
        return Response({'error': 'Not found.'}, status=404)
    skill.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# ── CERTIFICATION ─────────────────────────────────────────────

@api_view(['POST'])
def certification_create(request):
    serializer = CertificationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
def certification_detail(request, pk):
    try:
        cert = Certification.objects.get(pk=pk)
    except Certification.DoesNotExist:
        return Response({'error': 'Not found.'}, status=404)

    if request.method == 'PUT':
        serializer = CertificationSerializer(cert, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    cert.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
