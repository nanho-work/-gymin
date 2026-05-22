"use client";

import { useEffect, useMemo, useState } from "react";

import { getJobPost, toDomainJobPost } from "@/shared/api/jobsClient";
import { getMediaDisplayUrl } from "@/shared/api/mediaClient";
import type { JobPostRead } from "@/shared/api/serverTypes";

export type JobDetailStatus = "loading" | "ready" | "missing" | "error";

export type JobContentImage = {
  id: string;
  url: string;
};

export function useJobDetail(jobId: string) {
  const [job, setJob] = useState<JobPostRead | null>(null);
  const [status, setStatus] = useState<JobDetailStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    getJobPost(jobId)
      .then((nextJob) => {
        if (!isMounted) {
          return;
        }

        setJob(nextJob);
        setStatus("ready");
      })
      .catch((error: Error) => {
        if (!isMounted) {
          return;
        }

        setErrorMessage(error.message);
        setStatus(error.message.includes("찾을 수 없습니다") ? "missing" : "error");
      });

    return () => {
      isMounted = false;
    };
  }, [jobId]);

  const domainJob = useMemo(() => (job ? toDomainJobPost(job) : null), [job]);
  const center = job?.center ?? null;
  const canApply = job?.status === "open";

  const centerImageUrl = useMemo(() => {
    const centerMedia = center?.media ?? [];
    const representativeImage =
      centerMedia.find((item) => item.purpose === "representative") ??
      centerMedia.find((item) => item.purpose === "gallery");
    return getMediaDisplayUrl(representativeImage);
  }, [center]);

  const contentImages = useMemo(
    () =>
      (job?.media ?? [])
        .filter((item) => item.purpose === "content")
        .map((item) => ({ id: item.id, url: getMediaDisplayUrl(item) }))
        .filter((item): item is JobContentImage => Boolean(item.url)),
    [job]
  );

  return {
    canApply,
    center,
    centerImageUrl,
    contentImages,
    domainJob,
    errorMessage,
    job,
    status
  };
}
