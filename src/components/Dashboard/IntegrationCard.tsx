import { Link as LinkIcon, CheckCircle2, Clock } from 'lucide-react';

interface IntegrationCardProps {
  platform: string;
  connected: boolean;
  lastSync?: string | null;
}

export function IntegrationCard({ platform, connected, lastSync }: IntegrationCardProps) {
  const formatLastSync = (date?: string | null) => {
    if (!date) return 'Never';
    const syncDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - syncDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
            <LinkIcon className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{platform}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              {connected ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs text-green-600">Connected</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-500">Not connected</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {connected ? (
        <div className="space-y-2">
          <div className="text-xs text-slate-500">Last sync: {formatLastSync(lastSync)}</div>
          <button className="w-full px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
            Sync Now
          </button>
        </div>
      ) : (
        <button className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
          Connect
        </button>
      )}
    </div>
  );
}
