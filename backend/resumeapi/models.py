from django.db import models


class Resume(models.Model):
    full_name   = models.CharField(max_length=100)
    email       = models.EmailField()
    phone       = models.CharField(max_length=20)
    address     = models.TextField(blank=True)
    linkedin    = models.URLField(blank=True)
    github      = models.URLField(blank=True)
    portfolio   = models.URLField(blank=True)
    summary     = models.TextField(blank=True)
    photo       = models.ImageField(upload_to='photos/', blank=True, null=True)
    # chosen template: classic | modern | minimal
    template    = models.CharField(max_length=20, default='classic')
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name


class Experience(models.Model):
    resume      = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='experiences')
    job_title   = models.CharField(max_length=150)
    company     = models.CharField(max_length=150)
    location    = models.CharField(max_length=100, blank=True)
    start_date  = models.CharField(max_length=20)   # e.g. "Jan 2023"
    end_date    = models.CharField(max_length=20, blank=True)  # blank = Present
    description = models.TextField(blank=True)
    order       = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.job_title} @ {self.company}"


class Education(models.Model):
    resume  = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='educations')
    degree  = models.CharField(max_length=150)
    college = models.CharField(max_length=200)
    year    = models.CharField(max_length=20)    # e.g. "2021 – 2024"
    cgpa    = models.CharField(max_length=20, blank=True)
    order   = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.degree} – {self.college}"


class Project(models.Model):
    resume       = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='projects')
    title        = models.CharField(max_length=200)
    description  = models.TextField()
    technologies = models.CharField(max_length=300)
    link         = models.URLField(blank=True)
    order        = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class Skill(models.Model):
    CATEGORY_CHOICES = [
        ('technical', 'Technical'),
        ('soft',      'Soft Skills'),
        ('language',  'Language'),
        ('tool',      'Tools & Platforms'),
    ]
    resume   = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='skills')
    name     = models.CharField(max_length=80)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='technical')

    def __str__(self):
        return self.name


class Certification(models.Model):
    resume    = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='certifications')
    title     = models.CharField(max_length=200)
    issuer    = models.CharField(max_length=150)
    year      = models.CharField(max_length=10)
    link      = models.URLField(blank=True)
    order     = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title
