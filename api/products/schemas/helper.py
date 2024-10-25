from typing import Annotated
from bson import ObjectId
from pydantic import BeforeValidator


def validate_object_id(value: str | ObjectId) -> str:
    """
    Validates if a string is a valid MongoDB ObjectId using ObjectId.is_valid().
    Returns the string representation of the ObjectId if valid.
    """
    if isinstance(value, ObjectId):
        return str(value)

    if not isinstance(value, str):
        raise ValueError("Invalid ObjectId format: value must be string or ObjectId")

    if not ObjectId.is_valid(value):
        raise ValueError("Invalid ObjectId format")

    return value


PyObjectId = Annotated[str, BeforeValidator(validate_object_id)]
