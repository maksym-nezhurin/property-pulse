import Link from 'next/link';

export const metadata = {
  title: 'Add property',
  description: 'Main description'
}

export default function PropertiesAddPage() {
  return (
    <div className="">
      <h1 className="text-3xl">PropertiesAddPage</h1>
      <Link href={'/'}>Home</Link>
    </div>
  );
}
