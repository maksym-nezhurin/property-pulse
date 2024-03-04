'use client'
import Link from 'next/link';
import {useRouter, useParams, useSearchParams, usePathname} from "next/navigation";

export default function PropertiesIdPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = useParams();
  const name = searchParams.get('name');
  const pathname = usePathname();

  return (
    <div className="">
      <p>
        {name}
        {pathname}
      </p>
      <button onClick={() => router.push('/')} className={'bg-blue-50 p-2'}>Home</button>
      <h1 className="text-3xl">Property ID {id} Page</h1>
      <Link href={'/'}>Home</Link>
    </div>
  );
}
