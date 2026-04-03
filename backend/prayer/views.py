from rest_framework import viewsets, permissions
from .models import PrayerRequest, PrayerResponse
from .serializers import PrayerRequestSerializer, PrayerResponseSerializer

from rest_framework import filters

class PrayerRequestViewSet(viewsets.ModelViewSet):
    queryset = PrayerRequest.objects.all()
    serializer_class = PrayerRequestSerializer
    filter_backends = [filters.OrderingFilter]
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action in ['create', 'list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.is_staff or self.request.user.is_superuser:
            return PrayerRequest.objects.all()
        return PrayerRequest.objects.filter(is_public=True)

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()

class PrayerResponseViewSet(viewsets.ModelViewSet):
    queryset = PrayerResponse.objects.all()
    serializer_class = PrayerResponseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
