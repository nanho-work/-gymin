"use client";

import { useEffect, useMemo, useState } from "react";

import { listJobPosts, toDomainJobPost } from "@/shared/api/jobsClient";
import type { JobPostRead } from "@/shared/api/serverTypes";
import type { Page } from "@/shared/api/types";

const JOB_LIST_PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

export type JobSearchListState = "loading" | "connected" | "error";

export function useJobSearchList() {
  const [query, setQueryState] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPageState] = useState(1);
  const [pageData, setPageData] = useState<Page<JobPostRead> | null>(null);
  const [dataState, setDataState] = useState<JobSearchListState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUrlReady, setIsUrlReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextQuery = params.get("q") ?? "";
    const nextPage = Number(params.get("page"));

    setQueryState(nextQuery);
    setDebouncedQuery(nextQuery.trim());
    setPageState(Number.isInteger(nextPage) && nextPage > 0 ? nextPage : 1);
    setIsUrlReady(true);
  }, []);

  useEffect(() => {
    if (!isUrlReady) {
      return;
    }

    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [isUrlReady, query]);

  useEffect(() => {
    if (!isUrlReady) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const normalizedQuery = query.trim();

    if (normalizedQuery) {
      params.set("q", normalizedQuery);
    } else {
      params.delete("q");
    }

    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }

    const search = params.toString();
    const nextUrl = `${window.location.pathname}${search ? `?${search}` : ""}`;
    window.history.replaceState(null, "", nextUrl);
  }, [isUrlReady, page, query]);

  useEffect(() => {
    if (!isUrlReady) {
      return;
    }

    let isMounted = true;

    setDataState("loading");
    listJobPosts({
      page,
      size: JOB_LIST_PAGE_SIZE,
      q: debouncedQuery || undefined
    })
      .then((nextPage) => {
        if (!isMounted) {
          return;
        }

        setPageData(nextPage);
        setErrorMessage("");
        setDataState("connected");
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setPageData(null);
        setErrorMessage("구인글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
        setDataState("error");
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, isUrlReady, page]);

  const posts = useMemo(() => (pageData?.items ?? []).map(toDomainJobPost), [pageData]);

  const setQuery = (value: string) => {
    setQueryState(value);
    setPageState(1);
  };

  const setPage = (value: number) => {
    setPageState(value);
  };

  return {
    dataState,
    errorMessage,
    pageData,
    posts,
    query,
    setPage,
    setQuery
  };
}
