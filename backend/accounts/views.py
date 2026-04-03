from rest_framework import viewsets, permissions
from django.contrib.auth import get_user_model
from .models import Role, UserRole, FamilyUnit, MemberProfile, Attendance
from .serializers import (
    RoleSerializer, UserRoleSerializer, FamilyUnitSerializer,
    MemberProfileSerializer, UserSerializer, AttendanceSerializer
)

User = get_user_model()

class IsAdminOrStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and (request.user.is_staff or request.user.is_superuser)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrStaff]

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAdminOrStaff]

class UserRoleViewSet(viewsets.ModelViewSet):
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer
    permission_classes = [IsAdminOrStaff]

class FamilyUnitViewSet(viewsets.ModelViewSet):
    queryset = FamilyUnit.objects.all()
    serializer_class = FamilyUnitSerializer
    permission_classes = [IsAdminOrStaff]

class MemberProfileViewSet(viewsets.ModelViewSet):
    queryset = MemberProfile.objects.all()
    serializer_class = MemberProfileSerializer
    permission_classes = [IsAdminOrStaff]

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAdminOrStaff]
