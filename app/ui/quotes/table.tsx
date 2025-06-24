import Image from 'next/image';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { filteredQuotes } from '@/app/lib/data';

export default async function QuotesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const quotes = await filteredQuotes(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div>
            {quotes?.map((quote) => (
              <div
                key={quote.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={quote.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${quote.name}'s profile picture`}
                      />
                      <p>{quote.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{quote.email}</p>
                  </div>
                  <InvoiceStatus status={quote.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(quote.amount)}
                    </p>
                    <p>{formatDateToLocal(quote.date)}</p>
                  </div>
                  {/* <div className="flex justify-end gap-2">
                    <UpdateInvoice id={quote.id} />
                    <DeleteInvoice id={quote.id} />
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
