from rest_framework import serializers
from .models import Category, Tag, Post, Comment

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ('slug',)

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'post', 'user', 'user_email', 'author_name', 'author_email', 'content', 'is_approved', 'created_at')
        read_only_fields = ('created_at',)

class PostSerializer(serializers.ModelSerializer):
    category_details = CategorySerializer(source='category', read_only=True)
    tags_details = TagSerializer(source='tags', many=True, read_only=True)
    author_name = serializers.CharField(source='author.email', read_only=True)
    
    tag_ids = serializers.PrimaryKeyRelatedField(
        source='tags', 
        queryset=Tag.objects.all(), 
        many=True, 
        write_only=True,
        required=False
    )

    class Meta:
        model = Post
        fields = (
            'id', 'title', 'slug', 'content', 'excerpt', 'author', 'author_name',
            'category', 'category_details', 'tags', 'tags_details', 'tag_ids',
            'featured_image_url', 'is_published', 'created_at', 'updated_at', 'published_at'
        )
        read_only_fields = ('slug', 'created_at', 'updated_at')
