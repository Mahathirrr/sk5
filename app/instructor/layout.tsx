import { InstructorLayout } from "@/components/layout/instructor-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <InstructorLayout>{children}</InstructorLayout>;
}
