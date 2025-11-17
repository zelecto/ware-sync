import { Breadcrumbs } from "./Breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { type BreadcrumbItem } from "@/types";

interface AppSidebarHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
}

export function AppSidebarHeader({ breadcrumbs = [] }: AppSidebarHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b-2 border-gray-100">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
    </header>
  );
}
