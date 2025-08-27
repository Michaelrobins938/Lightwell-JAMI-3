import { Layout } from '../components/layout/Layout';
import Button from '../components/Button';
import Link from 'next/link';

export default function Custom500() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <h1 className="text-6xl font-bold text-gradient mb-4">500</h1>
        <p className="text-2xl mb-8">Oops! Something went wrong on our end</p>
        <Link href="/">
          <Button>Go back home</Button>
        </Link>
      </div>
    </Layout>
  );
}