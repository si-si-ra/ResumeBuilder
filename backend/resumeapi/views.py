from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Resume, Education, Experience, Project, Skill, Certification
from .serializers import (
    ResumeSerializer, ResumeWriteSerializer,
    EducationSerializer, ExperienceSerializer,
    ProjectSerializer, SkillSerializer, CertificationSerializer,
)


# ── AUTHENTICATION ────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    POST /api/auth/register/ – Register a new user
    Expected: { "username": "...", "email": "...", "password": "..." }
    """
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response(
            {'error': 'Username, email, and password are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Username already exists.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'Email already exists.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(username=username, email=email, password=password)
    # Create an empty resume for the user
    Resume.objects.create(user=user, full_name='', email=email)

    refresh = RefreshToken.for_user(user)
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': {'id': user.id, 'username': user.username, 'email': user.email}
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    POST /api/auth/login/ – Login user
    Expected: { "username": "...", "password": "..." }
    """
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Username and password are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)
    if not user:
        return Response(
            {'error': 'Invalid credentials.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': {'id': user.id, 'username': user.username, 'email': user.email}
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    """
    POST /api/auth/refresh/ – Refresh access token
    Expected: { "refresh": "..." }
    """
    refresh = request.data.get('refresh')
    if not refresh:
        return Response(
            {'error': 'Refresh token is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        refresh_token = RefreshToken(refresh)
        return Response({
            'access': str(refresh_token.access_token)
        })
    except Exception as e:
        return Response(
            {'error': 'Invalid refresh token.'},
            status=status.HTTP_401_UNAUTHORIZED
        )


# ── RESUME ────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
@permission_classes([IsAuthenticated])
def resume_list_create(request):
    """
    GET  /api/resume/         – get authenticated user's resume
    POST /api/resume/         – create a new resume (if user doesn't have one)
    """
    if request.method == 'GET':
        try:
            resume = Resume.objects.get(user=request.user)
            serializer = ResumeSerializer(resume, context={'request': request})
            return Response(serializer.data)
        except Resume.DoesNotExist:
            return Response({
                'id': None,
                'user': request.user.id,
                'full_name': '',
                'email': '',
                'phone': '',
                'address': '',
                'linkedin': '',
                'github': '',
                'portfolio': '',
                'summary': '',
                'photo': None,
                'template': 'classic',
                'created_at': None,
                'updated_at': None,
                'experiences': [],
                'educations': [],
                'projects': [],
                'skills': [],
                'certifications': [],
            })

    # POST - Create only if user doesn't have one
    try:
        Resume.objects.get(user=request.user)
        return Response({'error': 'User already has a resume.'}, status=status.HTTP_400_BAD_REQUEST)
    except Resume.DoesNotExist:
        pass

    serializer = ResumeWriteSerializer(data=request.data)
    if serializer.is_valid():
        resume = serializer.save(user=request.user)
        out = ResumeSerializer(resume, context={'request': request})
        return Response(out.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
@permission_classes([IsAuthenticated])
def resume_detail(request, pk):
    """
    GET    /api/resume/<pk>/  – retrieve with all nested data
    PUT    /api/resume/<pk>/  – full update
    PATCH  /api/resume/<pk>/  – partial update
    DELETE /api/resume/<pk>/  – delete
    """
    try:
        resume = Resume.objects.get(pk=pk, user=request.user)
    except Resume.DoesNotExist:
        return Response({'error': 'Resume not found or unauthorized.'}, status=status.HTTP_404_NOT_FOUND)

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
