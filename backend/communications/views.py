from rest_framework import viewsets, permissions
from .models import BroadcastGroup, Broadcast, NotificationLog, ContactMessage
from .serializers import BroadcastGroupSerializer, BroadcastSerializer, NotificationLogSerializer, ContactMessageSerializer

class IsAdminOrStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and (request.user.is_staff or request.user.is_superuser)

class BroadcastGroupViewSet(viewsets.ModelViewSet):
    queryset = BroadcastGroup.objects.all()
    serializer_class = BroadcastGroupSerializer
    permission_classes = [IsAdminOrStaff]

class BroadcastViewSet(viewsets.ModelViewSet):
    queryset = Broadcast.objects.all()
    serializer_class = BroadcastSerializer
    permission_classes = [IsAdminOrStaff]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class NotificationLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = NotificationLog.objects.all()
    serializer_class = NotificationLogSerializer
    permission_classes = [IsAdminOrStaff]

class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [IsAdminOrStaff()]
