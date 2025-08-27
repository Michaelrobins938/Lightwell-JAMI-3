import StatsCard from './StatsCard';
import { User, Activity } from 'lucide-react';

export default function StatsRow() {
  return (
    <section className="relative z-20 max-w-screen-xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8 justify-center -mt-24">
      <StatsCard
        icon={<Activity className="w-8 h-8 text-sky-500" />}
        value="5,000+"
        label="Successful Treatments"
      />
      <StatsCard
        icon={<User className="w-8 h-8 text-indigo-500" />}
        value="300+"
        label="Expert Doctors"
      />
    </section>
  );
} 