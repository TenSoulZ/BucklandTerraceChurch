from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
from .models import ImageAsset
from .serializers import ImageAssetSerializer
from imagekitio import ImageKit

imagekit = ImageKit(
    public_key=settings.IMAGEKIT_PUBLIC_KEY,
    private_key=settings.IMAGEKIT_PRIVATE_KEY,
    url_endpoint=settings.IMAGEKIT_URL_ENDPOINT
)

class IsAdminOrStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and (request.user.is_staff or request.user.is_superuser)

class ImageAssetViewSet(viewsets.ModelViewSet):
    queryset = ImageAsset.objects.all()
    serializer_class = ImageAssetSerializer
    permission_classes = [IsAdminOrStaff]

    @action(detail=False, methods=['POST'])
    def upload(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            upload_result = imagekit.upload_file(
                file=file_obj,
                file_name=file_obj.name,
            )
            
            asset = ImageAsset.objects.create(
                file_id=upload_result.file_id,
                url=upload_result.url,
                thumbnail_url=upload_result.thumbnail_url or '',
                name=upload_result.name,
                size=upload_result.size,
                uploaded_by=request.user
            )
            
            serializer = self.get_serializer(asset)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def perform_destroy(self, instance):
        try:
            imagekit.delete_file(instance.file_id)
        except Exception as e:
            pass # Or handle deletion error
        instance.delete()
