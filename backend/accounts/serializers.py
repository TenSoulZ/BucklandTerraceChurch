from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Role, UserRole, FamilyUnit, MemberProfile, Attendance

User = get_user_model()

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

class UserRoleSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)

    class Meta:
        model = UserRole
        fields = ('role', 'assigned_at')

class FamilyUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyUnit
        fields = '__all__'

class MemberProfileSerializer(serializers.ModelSerializer):
    family_name = serializers.CharField(source='family.name', read_only=True)

    class Meta:
        model = MemberProfile
        fields = ('id', 'phone', 'address', 'date_of_birth', 'family', 'family_name', 'created_at', 'updated_at')

class UserSerializer(serializers.ModelSerializer):
    profile = MemberProfileSerializer(read_only=True)
    roles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'profile', 'roles', 'is_active', 'date_joined')
        read_only_fields = ('id', 'email', 'date_joined')

    def get_roles(self, obj):
        return [role.name for role in obj.roles.all()]

class AttendanceSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Attendance
        fields = ('id', 'user', 'user_email', 'date', 'service_type', 'notes')
