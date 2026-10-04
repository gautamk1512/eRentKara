from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    """
    Standardized API Error Response Handler adhering to eRentKarar specification:
    Handles both DRF and Django Core exceptions cleanly.
    """
    from django.core.exceptions import ValidationError as DjangoValidationError
    from rest_framework.exceptions import ValidationError as DRFValidationError
    from django.db import IntegrityError

    if isinstance(exc, IntegrityError):
        msg = "A record with this information already exists."
        err_str = str(exc)
        if "phone_number" in err_str:
            msg = "An account with this phone number already exists."
        elif "email" in err_str:
            msg = "An account with this email address already exists."
        return Response(
            {
                "success": False,
                "error": {
                    "code": "INTEGRITY_ERROR",
                    "message": msg,
                    "details": {"non_field_errors": [msg]},
                },
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if isinstance(exc, DjangoValidationError):
        if hasattr(exc, "message_dict"):
            exc = DRFValidationError(detail=exc.message_dict)
        elif hasattr(exc, "messages"):
            exc = DRFValidationError(detail=exc.messages)
        else:
            exc = DRFValidationError(detail=str(exc))

    response = exception_handler(exc, context)

    if response is not None:
        custom_data = {
            "success": False,
            "error": {
                "code": exc.__class__.__name__.upper(),
                "message": str(exc),
                "details": response.data if isinstance(response.data, dict) else {"non_field_errors": response.data}
            }
        }
        response.data = custom_data
    else:
        # Unhandled 500 exceptions
        response = Response(
            {
                "success": False,
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "An unexpected server error occurred. Please contact support.",
                    "details": {}
                }
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response
