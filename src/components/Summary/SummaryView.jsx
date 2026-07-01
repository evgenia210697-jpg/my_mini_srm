import Counters from './Counters';
import UpcomingDeadlines from './UpcomingDeadlines';
import OverallProgress from './OverallProgress';
import StatusDonut from './StatusDonut';
import WeeklyLoad from './WeeklyLoad';

export default function SummaryView({ tasks, onOpenTask }) {
  return (
    <div className="space-y-4">
      <Counters tasks={tasks} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <UpcomingDeadlines tasks={tasks} onOpenTask={onOpenTask} />
        <OverallProgress tasks={tasks} />
        <StatusDonut tasks={tasks} />
      </div>
      <WeeklyLoad tasks={tasks} />
    </div>
  );
}
