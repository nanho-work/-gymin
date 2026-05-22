from datetime import date


def calculate_age_from_birth_year(birth_year: int | None) -> int | None:
    if birth_year is None:
        return None

    return date.today().year - birth_year
