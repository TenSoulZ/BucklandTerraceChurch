from rest_framework import viewsets, permissions, filters
from .models import SermonSeries, SermonTag, Sermon
from .serializers import SermonSeriesSerializer, SermonTagSerializer, SermonSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and (request.user.is_staff or request.user.is_superuser)

class SermonSeriesViewSet(viewsets.ModelViewSet):
    queryset = SermonSeries.objects.all()
    serializer_class = SermonSeriesSerializer
    permission_classes = [IsAdminOrReadOnly]

class SermonTagViewSet(viewsets.ModelViewSet):
    queryset = SermonTag.objects.all()
    serializer_class = SermonTagSerializer
    permission_classes = [IsAdminOrReadOnly]

class SermonViewSet(viewsets.ModelViewSet):
    queryset = Sermon.objects.all()
    serializer_class = SermonSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'preacher', 'description']
    ordering_fields = ['date_preached', 'created_at']
    ordering = ['-date_preached']

    def get_queryset(self):
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Sermon.objects.all()
        return Sermon.objects.filter(is_published=True)
