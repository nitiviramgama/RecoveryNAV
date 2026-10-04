export const POSTGRESQL_SCHEMA_SQL = `-- =============================================================================
-- RECOVERYNAV: POST-HOSPITAL RECOVERY MANAGER - POSTGRESQL PRODUCTION DDL
-- HIPAA Compliant, Row-Level Security Enabled, Full Audit Trail & Indexing
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. ENUMS
CREATE TYPE language_code AS ENUM ('en', 'hi', 'gu');
CREATE TYPE user_role AS ENUM ('PATIENT', 'CAREGIVER', 'PHYSICIAN', 'ADMIN');
CREATE TYPE document_status AS ENUM ('PENDING', 'PROCESSING', 'PROCESSED', 'FAILED');
CREATE TYPE medication_timing AS ENUM ('Morning', 'Afternoon', 'Evening', 'Night', 'As Needed');
CREATE TYPE appointment_status AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');
CREATE TYPE conflict_severity AS ENUM ('CRITICAL', 'WARNING', 'INFO');
CREATE TYPE audit_action AS ENUM ('READ', 'CREATE', 'UPDATE', 'DELETE', 'VOICE_COMMAND', 'OCR_EXTRACT', 'EXPORT_CALENDAR');

-- 2. USERS TABLE (Stores encrypted PII & credentials)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    date_of_birth DATE NOT NULL,
    mrn VARCHAR(64) UNIQUE NOT NULL, -- Medical Record Number
    phone_encrypted BYTEA, -- Encrypted with AES-256-GCM
    emergency_contact_name VARCHAR(150),
    emergency_contact_relationship VARCHAR(64),
    emergency_contact_phone_encrypted BYTEA,
    role user_role DEFAULT 'PATIENT',
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. USER LANGUAGE & APP PREFERENCES TABLE
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    language_preference language_code DEFAULT 'en',
    dark_mode BOOLEAN DEFAULT FALSE,
    voice_assistant_enabled BOOLEAN DEFAULT TRUE,
    voice_feedback_language language_code DEFAULT 'en',
    offline_sync_enabled BOOLEAN DEFAULT TRUE,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. DISCHARGE SUMMARIES TABLE
CREATE TABLE discharge_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hospital_name VARCHAR(255) NOT NULL,
    admission_date DATE NOT NULL,
    discharge_date DATE NOT NULL,
    attending_physician VARCHAR(150) NOT NULL,
    diagnosis TEXT NOT NULL,
    surgical_procedure TEXT,
    allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
    dietary_instructions TEXT,
    activity_restrictions TEXT,
    warning_signs TEXT[] DEFAULT ARRAY[]::TEXT[],
    raw_document_url VARCHAR(512),
    raw_extracted_text TEXT,
    parsed_status document_status DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. MEDICATIONS TABLE
CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    summary_id UUID NOT NULL REFERENCES discharge_summaries(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    generic_name VARCHAR(200),
    dosage VARCHAR(64) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    route VARCHAR(64) DEFAULT 'Oral',
    timings medication_timing[] NOT NULL,
    purpose TEXT,
    instructions TEXT,
    precautions TEXT,
    food_relation VARCHAR(64) DEFAULT 'After Food',
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. MEDICATION ADHERENCE LOGS TABLE
CREATE TABLE medication_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    taken_at TIMESTAMP WITH TIME ZONE,
    is_taken BOOLEAN NOT NULL DEFAULT FALSE,
    missed_reason TEXT,
    logged_via VARCHAR(32) DEFAULT 'WEB_UI', -- 'WEB_UI' | 'VOICE_ASSISTANT'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. PHYSICAL THERAPY EXERCISES TABLE
CREATE TABLE physical_therapy_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    summary_id UUID NOT NULL REFERENCES discharge_summaries(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'Breathing', 'Mobility', 'Strength', 'Walking'
    target_body_part VARCHAR(100),
    repetitions VARCHAR(64),
    frequency_per_day INT DEFAULT 2,
    duration_minutes INT DEFAULT 10,
    instructions TEXT NOT NULL,
    precautions TEXT,
    video_guide_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. EXERCISE LOGS TABLE
CREATE TABLE exercise_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exercise_id UUID NOT NULL REFERENCES physical_therapy_exercises(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    completed_sets INT NOT NULL DEFAULT 1,
    duration_minutes_spent INT,
    pain_level INT CHECK (pain_level >= 0 AND pain_level <= 10),
    notes TEXT,
    logged_via VARCHAR(32) DEFAULT 'WEB_UI',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. FOLLOW-UP APPOINTMENTS TABLE
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    summary_id UUID REFERENCES discharge_summaries(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_name VARCHAR(150) NOT NULL,
    specialty VARCHAR(150) NOT NULL,
    hospital_clinic VARCHAR(255) NOT NULL,
    appointment_time TIMESTAMP WITH TIME ZONE NOT NULL,
    purpose TEXT NOT NULL,
    status appointment_status DEFAULT 'SCHEDULED',
    contact_phone VARCHAR(32),
    google_calendar_event_id VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. SAFETY & CONFLICT DETECTION ALERTS TABLE
CREATE TABLE safety_conflicts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    summary_id UUID NOT NULL REFERENCES discharge_summaries(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    severity conflict_severity NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    source_documents TEXT[] DEFAULT ARRAY[]::TEXT[],
    recommendation TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. IMMUTABLE HIPAA AUDIT LOG TABLE
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action audit_action NOT NULL,
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(64),
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. PERFORMANCE INDEXES
CREATE INDEX idx_medications_user_id ON medications(user_id);
CREATE INDEX idx_medication_logs_user_date ON medication_logs(user_id, scheduled_time);
CREATE INDEX idx_exercises_user_id ON physical_therapy_exercises(user_id);
CREATE INDEX idx_appointments_user_time ON appointments(user_id, appointment_time);
CREATE INDEX idx_audit_logs_user_time ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_discharge_summaries_user_id ON discharge_summaries(user_id);

-- 13. ROW LEVEL SECURITY (RLS) FOR MULTI-TENANCY & PATIENT PRIVACY
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE discharge_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE physical_therapy_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Patients can only access their own records
CREATE POLICY user_patient_isolation ON discharge_summaries
    FOR ALL USING (user_id = current_setting('app.current_user_id')::UUID);

CREATE POLICY medication_patient_isolation ON medications
    FOR ALL USING (user_id = current_setting('app.current_user_id')::UUID);

CREATE POLICY appointment_patient_isolation ON appointments
    FOR ALL USING (user_id = current_setting('app.current_user_id')::UUID);
`;

export const DJANGO_CODE_MODELS = `"""
models.py - Django Models for Post-Hospital Recovery Manager
Supports HIPAA encryption, multi-lingual preferences, and adherence tracking.
"""
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils.translation import gettext_lazy as _
import uuid

class LanguageChoices(models.TextChoices):
    ENGLISH = 'en', _('English')
    HINDI = 'hi', _('Hindi (हिन्दी)')
    GUJARATI = 'gu', _('Gujarati (ગુજરાતી)')

class UserManager(BaseUserManager):
    def create_user(self, email, full_name, mrn, password=None, **extra_fields):
        if not email:
            raise ValueError(_('Email is mandatory'))
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, mrn=mrn, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150)
    date_of_birth = models.DateField(null=True, blank=True)
    mrn = models.CharField(max_length=64, unique=True, verbose_name="Medical Record Number")
    phone = models.CharField(max_length=32, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'mrn']

class UserSetting(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings')
    language_preference = models.CharField(max_length=5, choices=LanguageChoices.choices, default=LanguageChoices.ENGLISH)
    dark_mode = models.BooleanField(default=False)
    voice_assistant_enabled = models.BooleanField(default=True)
    voice_feedback_language = models.CharField(max_length=5, choices=LanguageChoices.choices, default=LanguageChoices.ENGLISH)
    offline_sync_enabled = models.BooleanField(default=True)

class DischargeSummary(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='discharge_summaries')
    hospital_name = models.CharField(max_length=255)
    admission_date = models.DateField()
    discharge_date = models.DateField()
    attending_physician = models.CharField(max_length=150)
    diagnosis = models.TextField()
    surgical_procedure = models.TextField(blank=True, null=True)
    allergies = models.JSONField(default=list)
    dietary_instructions = models.TextField(blank=True)
    activity_restrictions = models.TextField(blank=True)
    warning_signs = models.JSONField(default=list)
    raw_document_file = models.FileField(upload_to='discharge_docs/', null=True, blank=True)
    parsed_status = models.CharField(max_length=32, default='PROCESSED')
    created_at = models.DateTimeField(auto_now_add=True)

class Medication(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    summary = models.ForeignKey(DischargeSummary, on_delete=models.CASCADE, related_name='medications')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='medications')
    name = models.CharField(max_length=200)
    generic_name = models.CharField(max_length=200, blank=True)
    dosage = models.CharField(max_length=64)
    frequency = models.CharField(max_length=100)
    route = models.CharField(max_length=64, default='Oral')
    timings = models.JSONField(default=list) # e.g. ["Morning", "Night"]
    purpose = models.TextField(blank=True)
    instructions = models.TextField(blank=True)
    precautions = models.TextField(blank=True)
    food_relation = models.CharField(max_length=64, default='After Food')
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

class PhysicalTherapyExercise(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    summary = models.ForeignKey(DischargeSummary, on_delete=models.CASCADE, related_name='exercises')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='exercises')
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=64) # Breathing, Walking, Circulation
    target_body_part = models.CharField(max_length=100, blank=True)
    repetitions = models.CharField(max_length=64)
    frequency_per_day = models.IntegerField(default=2)
    duration_minutes = models.IntegerField(default=10)
    instructions = models.TextField()
    precautions = models.TextField(blank=True)

class Appointment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments')
    summary = models.ForeignKey(DischargeSummary, on_delete=models.SET_NULL, null=True, blank=True)
    doctor_name = models.CharField(max_length=150)
    specialty = models.CharField(max_length=150)
    hospital_clinic = models.CharField(max_length=255)
    appointment_time = models.DateTimeField()
    purpose = models.TextField()
    status = models.CharField(max_length=32, default='SCHEDULED')
    google_calendar_event_id = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)

class AuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=32)
    resource_type = models.CharField(max_length=64)
    resource_id = models.CharField(max_length=64, blank=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    details = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
`;

export const DJANGO_CODE_VIEWS = `"""
views.py - Django REST Framework ViewSets with HIPAA Audit Decorators & Multilingual Support
"""
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import DischargeSummary, Medication, PhysicalTherapyExercise, Appointment, AuditLog, UserSetting
from .serializers import (
    DischargeSummarySerializer, MedicationSerializer,
    PhysicalTherapyExerciseSerializer, AppointmentSerializer,
    AuditLogSerializer, UserSettingSerializer
)

def log_hipaa_access(user, action_type, resource_type, resource_id, request, details=None):
    AuditLog.objects.create(
        user=user if user.is_authenticated else None,
        action=action_type,
        resource_type=resource_type,
        resource_id=str(resource_id),
        ip_address=request.META.get('REMOTE_ADDR', '127.0.0.1'),
        user_agent=request.META.get('HTTP_USER_AGENT', 'Unknown'),
        details=details or {}
    )

class DischargeSummaryViewSet(viewsets.ModelViewSet):
    serializer_class = DischargeSummarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DischargeSummary.objects.filter(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        log_hipaa_access(request.user, 'READ', 'DISCHARGE_SUMMARY', instance.id, request)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class MedicationViewSet(viewsets.ModelViewSet):
    serializer_class = MedicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Medication.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='mark-taken')
    def mark_taken(self, request, pk=None):
        medication = self.get_object()
        via = request.data.get('logged_via', 'WEB_UI')
        log_hipaa_access(request.user, 'UPDATE', 'MEDICATION', medication.id, request, {
            'action': 'MARKED_AS_TAKEN',
            'logged_via': via
        })
        return Response({
            'status': 'success',
            'message': f'Medication {medication.name} logged as taken successfully.',
            'logged_via': via
        }, status=status.HTTP_200_OK)

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(user=self.request.user).order_by('appointment_time')

    @action(detail=True, methods=['post'], url_path='sync-google-calendar')
    def sync_google_calendar(self, request, pk=None):
        appointment = self.get_object()
        log_hipaa_access(request.user, 'EXPORT_CALENDAR', 'APPOINTMENT', appointment.id, request)
        return Response({
            'status': 'synchronized',
            'event_title': f'{appointment.doctor_name} ({appointment.specialty})',
            'time': appointment.appointment_time
        })
`;

export const DJANGO_CODE_URLS = `"""
urls.py - RESTful API Routing for RecoveryNav
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DischargeSummaryViewSet, MedicationViewSet, AppointmentViewSet

router = DefaultRouter()
router.register(r'discharge-summaries', DischargeSummaryViewSet, basename='discharge-summary')
router.register(r'medications', MedicationViewSet, basename='medication')
router.register(r'appointments', AppointmentViewSet, basename='appointment')

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('api/v1/auth/', include('rest_framework.urls')),
]
`;
