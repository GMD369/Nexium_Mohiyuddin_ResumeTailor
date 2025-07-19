// app/resume/page.tsx
import ProtectedRoute from "@/components/ProtectedRoute"
import ResumeForm from "@/components/ResumeForm"

export default function ResumePage() {
  return (
    <ProtectedRoute>
      <ResumeForm />
    </ProtectedRoute>
  )
}
