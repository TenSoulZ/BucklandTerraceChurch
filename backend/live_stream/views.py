from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import LiveStream, StreamChat
from .serializers import LiveStreamSerializer, StreamChatSerializer

class LiveStreamViewSet(viewsets.ModelViewSet):
    queryset = LiveStream.objects.all()
    serializer_class = LiveStreamSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['get'])
    def current(self, request):
        stream = LiveStream.objects.filter(is_live=True).first()
        if stream:
            serializer = self.get_serializer(stream)
            return Response(serializer.data)
        return Response({"detail": "No active live stream."}, status=status.HTTP_404_NOT_FOUND)

class StreamChatViewSet(viewsets.ModelViewSet):
    queryset = StreamChat.objects.all()
    serializer_class = StreamChatSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticatedOrReadOnly()]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()
