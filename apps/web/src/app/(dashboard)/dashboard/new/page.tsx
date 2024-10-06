import { Metadata } from 'next';

import CreateNewProjectClient from './page.client';

export const metadata: Metadata = {
  title: 'Create a new project',
  description: 'Create a new project',
};

export default async function CreateNewProject() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <CreateNewProjectClient />
      </div>
    </div>
  );
}
