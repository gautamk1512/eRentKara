from django.db import models
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied


def is_admin(user):
    return bool(user.is_authenticated and (user.is_staff or user.is_superuser))


def organization_for(obj):
    if obj is None:
        return None
    if obj._meta.label_lower == 'organizations.organization':
        return obj
    for field in ('organization', 'property', 'tenancy', 'room', 'floor', 'building', 'invoice', 'lead'):
        if getattr(obj, field + '_id', None):
            return organization_for(getattr(obj, field))
    return None


def can_manage_organization(user, organization):
    return is_admin(user) or (user.is_authenticated and organization is not None and
        organization.members.filter(user=user, is_active=True).exists())


class ScopedModelSerializer(serializers.ModelSerializer):
    """Protect writes as well as list/detail queries across organization-owned models."""
    def validate(self, attrs):
        attrs = super().validate(attrs)
        request = self.context.get('request')
        if request is None:
            return attrs
        user = request.user
        if not user.is_authenticated:
            raise PermissionDenied('Sign in before modifying records.')
        if is_admin(user):
            return attrs
        administrative = {'organization', 'organizationmember', 'property', 'building', 'floor', 'room', 'bed', 'propertyimage', 'tenancy', 'invoice', 'electricityreading', 'payment', 'messplan', 'messmenu', 'lead', 'visit', 'staff'}
        if user.role == 'TENANT' and self.Meta.model._meta.model_name in administrative:
            raise PermissionDenied('Only property operators can modify this record.')
        scoped = []
        for field, value in attrs.items():
            for obj in value if isinstance(value, (list, tuple)) else [value]:
                if not isinstance(obj, models.Model):
                    continue
                org = organization_for(obj)
                if org is None:
                    continue
                own_tenancy = obj._meta.model_name == 'tenancy' and getattr(obj, 'tenant_id', None) == user.pk
                if not can_manage_organization(user, org) and not own_tenancy:
                    raise PermissionDenied('This record belongs to another organization.')
                scoped.append(org.pk)
        if self.instance:
            org = organization_for(self.instance)
            if org is not None:
                scoped.append(org.pk)
        if len(set(scoped)) > 1:
            raise serializers.ValidationError('Related records must belong to the same organization.')
        if self.Meta.model._meta.model_name == 'kyc':
            target = attrs.get('user', getattr(self.instance, 'user', None))
            tenancy = attrs.get('tenancy', getattr(self.instance, 'tenancy', None))
            if target and target != user and not (tenancy and tenancy.tenant_id == target.pk and can_manage_organization(user, tenancy.property.organization)):
                raise PermissionDenied('You cannot modify another user’s identity record.')
        return attrs
