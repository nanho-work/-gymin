import re


def normalize_phone_digits(value: str | None) -> str | None:
    if value is None:
        return None

    digits = re.sub(r"\D", "", value)
    return digits or None
