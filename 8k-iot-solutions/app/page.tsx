import HomeContent from '@/components/Home';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: "Home - 8K IoT Solutions",
  },
};

export default function Home() {
  return <HomeContent />;
}