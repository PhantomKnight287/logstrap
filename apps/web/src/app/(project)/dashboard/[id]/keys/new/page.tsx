import { Metadata } from 'next';
import CreateNewApiKeyClient from './page.client';

export const metadata: Metadata = {
  title: 'Create New API Key',
  description: 'Create New API Key',
};

export default function CreateNewApiKey({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="h-full bg-background flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <CreateNewApiKeyClient id={params.id} />
        </div>
      </div>
    </main>
  );
}
