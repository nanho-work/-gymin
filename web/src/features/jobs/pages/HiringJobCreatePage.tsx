"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { uploadImageToS3 } from "@/features/uploads/api/uploadImageToS3";
import { createUploadId, defaultImageAccept, validateImageFile } from "@/features/uploads/utils/imageFiles";
import { listMyCenters } from "@/shared/api/centersClient";
import { createJobPost } from "@/shared/api/jobsClient";
import type { CenterRead, JobPostCreate, JobPostRead } from "@/shared/api/serverTypes";
import { Container } from "@/shared/components/ui/Container";
import { PrimaryLink } from "@/shared/components/ui/PrimaryLink";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

type PendingImage = {
  id: string;
  file: File;
  previewUrl: string;
};

type JobFormState = {
  centerId: string;
  title: string;
  jobRole: string;
  employmentType: string;
  startDateText: string;
  workDays: string;
  workHours: string;
  restTime: string;
  basePay: string;
  insuranceType: string;
  incentive: string;
  settlementType: string;
  salesPressure: string;
  memberHandover: string;
  vacation: string;
  supportDetail: string;
  description: string;
};

const emptyForm: JobFormState = {
  centerId: "",
  title: "",
  jobRole: "pt_trainer",
  employmentType: "full_time",
  startDateText: "",
  workDays: "",
  workHours: "",
  restTime: "",
  basePay: "",
  insuranceType: "negotiable",
  incentive: "",
  settlementType: "",
  salesPressure: "none",
  memberHandover: "negotiable",
  vacation: "",
  supportDetail: "",
  description: ""
};

const jobRoleOptions = [
  { label: "PT 트레이너", value: "pt_trainer" },
  { label: "필라테스 강사", value: "pilates_instructor" },
  { label: "요가 강사", value: "yoga_instructor" },
  { label: "GX 강사", value: "gx_instructor" },
  { label: "재활/교정 트레이너", value: "rehab_trainer" },
  { label: "기타", value: "etc" }
];

const employmentTypeOptions = [
  { label: "정규직", value: "full_time" },
  { label: "파트타임", value: "part_time" },
  { label: "프리랜서", value: "freelance" },
  { label: "스케줄 근무", value: "schedule" },
  { label: "협의", value: "negotiable" }
];

const insuranceOptions = [
  { label: "가입", value: "included" },
  { label: "협의", value: "negotiable" },
  { label: "미가입", value: "not_included" },
  { label: "해당 없음", value: "not_applicable" }
];

const salesPressureOptions = [
  { label: "없음", value: "none" },
  { label: "낮음", value: "low" },
  { label: "있음", value: "high" },
  { label: "협의/면접 안내", value: "interview" }
];

const memberHandoverOptions = [
  { label: "있음", value: "provided" },
  { label: "없음", value: "none" },
  { label: "협의", value: "negotiable" },
  { label: "신규 배정", value: "new_members" }
];

export function HiringJobCreatePage() {
  useDocumentTitle("구인글 등록");
  const [centers, setCenters] = useState<CenterRead[]>([]);
  const [form, setForm] = useState<JobFormState>(emptyForm);
  const [contentImages, setContentImages] = useState<PendingImage[]>([]);
  const [createdJob, setCreatedJob] = useState<JobPostRead | null>(null);
  const [loadStatus, setLoadStatus] = useState<"loading" | "ready" | "error">("loading");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [notice, setNotice] = useState("");
  const contentImagesRef = useRef<PendingImage[]>([]);

  useEffect(() => {
    let isMounted = true;

    listMyCenters({ page: 1, size: 100 })
      .then((page) => {
        if (!isMounted) {
          return;
        }

        setCenters(page.items);
        setForm((current) => ({
          ...current,
          centerId: current.centerId || page.items[0]?.id || ""
        }));
        setLoadStatus("ready");
      })
      .catch((error: Error) => {
        if (!isMounted) {
          return;
        }

        setNotice(error.message);
        setLoadStatus("error");
      });

    return () => {
      isMounted = false;
      contentImagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, []);

  useEffect(() => {
    contentImagesRef.current = contentImages;
  }, [contentImages]);

  const selectedCenter = centers.find((center) => center.id === form.centerId) ?? null;
  const requiredChecks = [
    { label: "등록 센터", ready: Boolean(form.centerId) },
    { label: "공고 제목", ready: Boolean(form.title.trim()) },
    { label: "모집 직무", ready: Boolean(form.jobRole) },
    { label: "근무 형태", ready: Boolean(form.employmentType) }
  ];
  const canSave = requiredChecks.every((check) => check.ready);

  const handleFieldChange =
    (field: keyof JobFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setSaveStatus("idle");
    };

  const handleContentImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    const validImages: PendingImage[] = [];
    for (const file of files) {
      const validationError = validateImageFile(file, 8);
      if (validationError) {
        setNotice(validationError);
        continue;
      }

      validImages.push({
        id: createUploadId(),
        file,
        previewUrl: URL.createObjectURL(file)
      });
    }

    if (validImages.length > 0) {
      setContentImages((current) => [...current, ...validImages].slice(0, 5));
      setSaveStatus("idle");
      setNotice("본문 이미지가 선택되었습니다. 저장 버튼을 누르면 업로드됩니다.");
    }
  };

  const removeContentImage = (imageId: string) => {
    setContentImages((current) => {
      const target = current.find((image) => image.id === imageId);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return current.filter((image) => image.id !== imageId);
    });
    setSaveStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSave) {
      setNotice("등록 센터, 공고 제목, 모집 직무, 근무 형태를 입력해 주세요.");
      return;
    }

    setSaveStatus("saving");
    setNotice("");

    let savedJob: JobPostRead | null = null;
    try {
      const nextJob = createdJob ?? (await createJobPost(toJobPayload(form)));
      savedJob = nextJob;
      setCreatedJob(nextJob);

      await Promise.all(
        contentImages.map((image, index) =>
          uploadImageToS3({
            entityId: nextJob.id,
            entityType: "job_post",
            file: image.file,
            purpose: "content",
            sortOrder: index
          })
        )
      );

      contentImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
      setContentImages([]);
      setSaveStatus("saved");
      setNotice("구인글이 등록되었습니다.");
    } catch (error) {
      setSaveStatus("error");
      const message = error instanceof Error ? error.message : "구인글 등록에 실패했습니다.";
      setNotice(savedJob ? `구인글은 등록되었지만 이미지 업로드에 실패했습니다. ${message}` : message);
    }
  };

  if (loadStatus === "loading") {
    return (
      <Container className="py-12">
        <section className="border-y border-line py-10">
          <h1 className="text-3xl font-black tracking-tight text-ink">구인글 등록 화면을 불러오는 중입니다</h1>
        </section>
      </Container>
    );
  }

  if (loadStatus === "error") {
    return (
      <Container className="py-12">
        <section className="border-y border-line py-10">
          <h1 className="text-3xl font-black tracking-tight text-ink">구인글 등록 화면을 불러오지 못했습니다</h1>
          <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-muted">{notice}</p>
        </section>
      </Container>
    );
  }

  if (centers.length === 0) {
    return (
      <Container className="py-12">
        <section className="border-y border-line py-10">
          <h1 className="text-3xl font-black tracking-tight text-ink">먼저 센터를 등록해 주세요</h1>
          <p className="mt-3 max-w-2xl leading-7 text-muted">
            구인글은 사업자가 등록한 센터를 기준으로 노출됩니다. 센터를 저장한 뒤 구인글을 등록할 수 있습니다.
          </p>
          <div className="mt-6">
            <PrimaryLink to="/gyms/new">센터 등록하기</PrimaryLink>
          </div>
        </section>
      </Container>
    );
  }

  return (
    <Container className="grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <form className="space-y-8" onSubmit={handleSubmit}>
        <FormActions createdJob={createdJob} notice={notice} saveStatus={saveStatus} />

        <SectionTitle title="구인 기본 정보" />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="공고 제목" onChange={handleFieldChange("title")} placeholder="예: 오픈 멤버 PT 트레이너 구인" value={form.title} />
          <CenterSelect centers={centers} onChange={handleFieldChange("centerId")} value={form.centerId} />
          <SelectField label="모집 직무" onChange={handleFieldChange("jobRole")} options={jobRoleOptions} value={form.jobRole} />
          <SelectField label="근무 형태" onChange={handleFieldChange("employmentType")} options={employmentTypeOptions} value={form.employmentType} />
        </div>
        <section className="border-y border-line py-4">
          <p className="text-sm font-black text-ink">구인글에 자동 노출되는 센터 정보</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            {selectedCenter
              ? `${selectedCenter.name} · ${selectedCenter.sido} ${selectedCenter.sigungu} · ${formatIndustry(selectedCenter.industry)}`
              : "센터를 선택하면 지역과 센터 정보가 구인글에 연결됩니다."}
          </p>
        </section>

        <SectionTitle title="근무 시간" />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="근무 시작일" onChange={handleFieldChange("startDateText")} placeholder="예: 2026년 6월 1일부터 / 협의 가능" value={form.startDateText} />
          <TextField label="근무 요일" onChange={handleFieldChange("workDays")} placeholder="예: 주 5일 스케줄 근무, 월수금, 주말 파트" value={form.workDays} />
          <TextField label="근무 시간" onChange={handleFieldChange("workHours")} placeholder="예: 12:00 ~ 21:00, 면접 시 협의 가능" value={form.workHours} />
          <TextField label="휴게 시간" onChange={handleFieldChange("restTime")} placeholder="예: 일 2시간 제공, 수업 사이 자유 휴게" value={form.restTime} />
        </div>

        <SectionTitle title="급여/정산" />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="기본급" onChange={handleFieldChange("basePay")} placeholder="예: 200만 원, 기본급 없음, 협의" value={form.basePay} />
          <SelectField label="4대보험" onChange={handleFieldChange("insuranceType")} options={insuranceOptions} value={form.insuranceType} />
          <TextField label="수업료/인센티브" onChange={handleFieldChange("incentive")} placeholder="예: 의무 수업 50개 이후 재등록 60%, 워크인 50%" value={form.incentive} />
          <TextField label="정산 방식" onChange={handleFieldChange("settlementType")} placeholder="예: 매월 10일 정산, 고정 요율" value={form.settlementType} />
        </div>

        <SectionTitle title="근무 메리트" />
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField label="매출 압박/구간제" onChange={handleFieldChange("salesPressure")} options={salesPressureOptions} value={form.salesPressure} />
          <SelectField label="회원 인계" onChange={handleFieldChange("memberHandover")} options={memberHandoverOptions} value={form.memberHandover} />
          <TextField label="휴가/월차" onChange={handleFieldChange("vacation")} placeholder="예: 월차 1일, 1년 이상 연차 15일" value={form.vacation} />
          <TextField label="추가 지원" onChange={handleFieldChange("supportDetail")} placeholder="예: 기존 회원 20명 인계, 교육 지원, 운동 가능" value={form.supportDetail} />
        </div>

        <SectionTitle title="트레이너에게 보여줄 내용" />
        <TextField
          label="상세 설명"
          onChange={handleFieldChange("description")}
          placeholder="센터 분위기, 회원층, 수업 방식, 함께 일할 선생님에게 전하고 싶은 내용을 자유롭게 적어주세요."
          textarea
          value={form.description}
        />

        <SectionTitle title="본문 이미지" />
        <p className="text-sm leading-6 text-muted">공고 본문 중간에 넣을 공간 사진, 근무 환경 이미지 등을 선택 등록합니다.</p>
        <div className="grid gap-3 md:grid-cols-3">
          {contentImages.map((image) => (
            <PendingImageCard image={image} key={image.id} onRemove={removeContentImage} />
          ))}
          <label className="grid min-h-40 cursor-pointer place-items-center border border-dashed border-line bg-white p-4 text-center transition hover:border-green">
            <span className="text-sm font-black text-ink">사진 선택</span>
            <span className="mt-2 block text-xs font-bold text-muted">최대 5장 선택 가능</span>
            <input accept={defaultImageAccept} className="sr-only" multiple onChange={handleContentImagesChange} type="file" />
          </label>
        </div>

        <FormActions createdJob={createdJob} notice="" placement="bottom" saveStatus={saveStatus} />
      </form>

      <div className="space-y-8 border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
        <aside className="border-t border-line pt-5">
          <h2 className="text-xl font-black text-ink">등록 조건</h2>
          <p className="mt-4 text-sm leading-6 text-muted">구인글은 내 센터를 선택한 뒤 저장합니다. 저장 후 지원자 목록에서 확인할 수 있습니다.</p>
          <div className="mt-5 space-y-2">
            {requiredChecks.map((item) => (
              <div className="flex items-center justify-between border-b border-line py-2" key={item.label}>
                <span className="text-sm font-bold text-muted">{item.label}</span>
                <span className={`text-xs font-black ${item.ready ? "text-forest" : "text-amber-800"}`}>
                  {item.ready ? "완료" : "필요"}
                </span>
              </div>
            ))}
          </div>
        </aside>
        <aside className="border-t border-line pt-5 text-sm leading-6 text-muted">
          <h2 className="text-xl font-black text-ink">작성 흐름</h2>
          <ol className="mt-4 space-y-3 text-sm font-bold text-muted">
            <li>1. 센터 선택</li>
            <li>2. 채용 조건 작성</li>
            <li>3. 구인글 저장</li>
            <li>4. 지원자 프로필 확인</li>
          </ol>
        </aside>
      </div>
    </Container>
  );
}

function FormActions({
  createdJob,
  notice,
  placement = "top",
  saveStatus
}: {
  createdJob: JobPostRead | null;
  notice: string;
  placement?: "top" | "bottom";
  saveStatus: "idle" | "saving" | "saved" | "error";
}) {
  return (
    <section className={placement === "top" ? "border-b border-line pb-5" : "border-t border-line pt-6"}>
      <div className="flex flex-wrap justify-end gap-2">
        {createdJob ? (
          <PrimaryLink to={`/owner/jobs/${createdJob.id}/applicants`} variant="light">
            지원자 목록
          </PrimaryLink>
        ) : null}
        <PrimaryLink to="/jobs/hiring" variant="light">
          구인글 목록
        </PrimaryLink>
        {saveStatus === "saved" ? null : (
          <button
            className="rounded-md bg-ink px-5 py-3 text-sm font-black text-white transition hover:bg-forest disabled:opacity-60"
            disabled={saveStatus === "saving"}
            type="submit"
          >
            {saveStatus === "saving" ? "저장 중" : "저장"}
          </button>
        )}
      </div>
      {notice ? <p className="mt-3 border-l-2 border-green pl-3 text-sm font-bold text-muted">{notice}</p> : null}
    </section>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="border-b border-line pb-3 text-xl font-black text-ink">{title}</h2>;
}

function TextField({
  label,
  onChange,
  placeholder,
  textarea = false,
  value
}: {
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  textarea?: boolean;
  value: string;
}) {
  const className = "mt-2 w-full border border-line bg-white px-3 text-sm outline-none transition focus:border-green";

  return (
    <label className="block">
      <span className="text-sm font-black text-ink">{label}</span>
      {textarea ? (
        <textarea className={`${className} min-h-44 py-3`} onChange={onChange} placeholder={placeholder} value={value} />
      ) : (
        <input className={`${className} h-11`} onChange={onChange} placeholder={placeholder} type="text" value={value} />
      )}
    </label>
  );
}

function SelectField({
  label,
  onChange,
  options,
  value
}: {
  label: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-ink">{label}</span>
      <select className="mt-2 h-11 w-full border border-line bg-white px-3 text-sm outline-none transition focus:border-green" onChange={onChange} value={value}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CenterSelect({
  centers,
  onChange,
  value
}: {
  centers: CenterRead[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  value: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-ink">등록 센터</span>
      <select className="mt-2 h-11 w-full border border-line bg-white px-3 text-sm outline-none transition focus:border-green" onChange={onChange} value={value}>
        {centers.map((center) => (
          <option key={center.id} value={center.id}>
            {center.name} · {center.sido} {center.sigungu}
          </option>
        ))}
      </select>
    </label>
  );
}

function PendingImageCard({ image, onRemove }: { image: PendingImage; onRemove: (imageId: string) => void }) {
  return (
    <div className="relative min-h-40 overflow-hidden border border-line bg-paper">
      <img alt="선택한 구인글 이미지" className="h-40 w-full object-cover" src={image.previewUrl} />
      <button
        className="absolute right-2 top-2 rounded-md bg-ink/85 px-2 py-1 text-xs font-black text-white"
        onClick={() => onRemove(image.id)}
        type="button"
      >
        취소
      </button>
    </div>
  );
}

function toJobPayload(form: JobFormState): JobPostCreate {
  return {
    center_id: form.centerId,
    title: form.title.trim(),
    job_role: form.jobRole,
    employment_type: form.employmentType,
    start_date_text: trimOptional(form.startDateText),
    work_days: trimOptional(form.workDays),
    work_hours: trimOptional(form.workHours),
    rest_time: trimOptional(form.restTime),
    base_pay: trimOptional(form.basePay),
    insurance_type: trimOptional(form.insuranceType),
    incentive: trimOptional(form.incentive),
    settlement_type: trimOptional(form.settlementType),
    sales_pressure: trimOptional(form.salesPressure),
    member_handover: trimOptional(form.memberHandover),
    vacation: trimOptional(form.vacation),
    support_detail: trimOptional(form.supportDetail),
    description: trimOptional(form.description)
  };
}

function trimOptional(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function formatIndustry(industry: string) {
  const labels: Record<string, string> = {
    health_pt: "헬스/PT",
    pilates: "필라테스",
    yoga: "요가",
    crossfit: "크로스핏",
    rehab: "재활/교정",
    mixed: "복합 센터",
    etc: "기타"
  };
  return labels[industry] ?? industry;
}
