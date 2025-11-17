import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { type BreadcrumbItem as BreadcrumbItemType } from "@/types";

interface BreadcrumbsProps {
  breadcrumbs: BreadcrumbItemType[];
}

export function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
  if (breadcrumbs.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <div key={index} className="contents">
              <BreadcrumbItem className={index > 0 ? "hidden md:block" : ""}>
                {item.href && !isLast ? (
                  <BreadcrumbLink asChild>
                    <Link to={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
