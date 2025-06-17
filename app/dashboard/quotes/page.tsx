import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import { Metadata } from 'next';
import { Suspense } from 'react';
import Pagination from '@/app/ui/invoices/pagination';
import QuotesTable from '@/app/ui/quotes/table';
import { fetchQuotesPages } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'Quotes' 
};

export default async function Page(props: { searchParams?: Promise<{ query?: string; page?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchQuotesPages(query);

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} text-2xl`}>Quotes</h1>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search quotes..." />        
     </div>
    <Suspense key={query + currentPage}>
       <QuotesTable query={query} currentPage={currentPage} />
    </Suspense>
    <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
    </div>
    </div>
  );
}