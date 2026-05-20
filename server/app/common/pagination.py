from math import ceil
from typing import Annotated, Generic, TypeVar

from fastapi import Query
from pydantic import BaseModel, Field
from sqlalchemy import Select, func, select
from sqlalchemy.orm import Session


T = TypeVar("T")


class PaginationParams(BaseModel):
    page: int = Field(default=1, ge=1)
    size: int = Field(default=20, ge=1, le=100)

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.size


class Page(BaseModel, Generic[T]):
    items: list[T]
    page: int
    size: int
    total: int
    total_pages: int
    has_next: bool
    has_prev: bool


def get_pagination_params(
    page: Annotated[int, Query(ge=1)] = 1,
    size: Annotated[int, Query(ge=1, le=100)] = 20
) -> PaginationParams:
    return PaginationParams(page=page, size=size)


def count_statement(db: Session, statement: Select) -> int:
    count_statement = select(func.count()).select_from(statement.order_by(None).subquery())
    return db.scalar(count_statement) or 0


def paginate_statement(db: Session, statement: Select, params: PaginationParams) -> tuple[list, int]:
    total = count_statement(db, statement)
    items = list(db.scalars(statement.offset(params.offset).limit(params.size)).all())
    return items, total


def build_page(items: list[T], total: int, params: PaginationParams) -> Page[T]:
    total_pages = ceil(total / params.size) if total else 0
    return Page(
        items=items,
        page=params.page,
        size=params.size,
        total=total,
        total_pages=total_pages,
        has_next=params.page < total_pages,
        has_prev=params.page > 1
    )
