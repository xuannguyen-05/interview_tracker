const TEXT_FIELDS = ["company_name", "position", "apply_date", "job_url", "notes", "delete_resume",]

export function buildApplicationFormData(payload) {
  const formData = new FormData()

  for (const field of TEXT_FIELDS) {
    if (payload[field] !== undefined && payload[field] !== null && payload[field] !== "") {
      formData.append(field, payload[field])
    }
  }

  if (payload.resume instanceof File) {
    formData.append("resume", payload.resume)
  }

  return formData
}

export const RESUME_MAX_SIZE = 5 * 1024 * 1024

export function validateResumeFile(file) {
  if (!file) return null

  if (file.type !== "application/pdf") {
    return "Only PDF files are allowed."
  }

  if (file.size > RESUME_MAX_SIZE) {
    return "File size must not exceed 5MB."
  }

  return null
}
