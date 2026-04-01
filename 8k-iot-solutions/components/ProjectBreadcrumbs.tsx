'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface ProjectBreadcrumbsProps {
  currentPage: string;
}

export default function ProjectBreadcrumbs({ currentPage }: ProjectBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-10 font-poppins">
      <ol className="flex items-center space-x-2 text-sm font-medium">
        <li>
          <Link 
            href="/" 
            className="text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            Home
          </Link>
        </li>
        <li className="flex items-center space-x-2">
          <ChevronRight className="w-3 h-3 text-zinc-300" />
          <Link 
            href="/#projects" 
            className="text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            Projects
          </Link>
        </li>
        <li className="flex items-center space-x-2">
          <ChevronRight className="w-3 h-3 text-zinc-300" />
          <span className="font-semibold text-zinc-900">
            {currentPage}
          </span>
        </li>
      </ol>
    </nav>
  );
}
