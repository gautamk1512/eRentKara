from rest_framework.throttling import SimpleRateThrottle


class AuthenticationRateThrottle(SimpleRateThrottle):
    scope = 'authentication'
    rate = '30/min'

    def get_cache_key(self, request, view):
        return self.cache_format % {'scope': self.scope, 'ident': self.get_ident(request)}
