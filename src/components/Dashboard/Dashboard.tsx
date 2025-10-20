import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Database } from '../../lib/database.types';
import { AchievementCard } from './AchievementCard';
import { AddAchievementModal } from './AddAchievementModal';
import { IntegrationCard } from './IntegrationCard';
import { StatsCard } from './StatsCard';
import { Plus, TrendingUp, Award, Briefcase, BookOpen } from 'lucide-react';

type Achievement = Database['public']['Tables']['achievements']['Row'];
type IntegrationConnection = Database['public']['Tables']['integration_connections']['Row'];

export function Dashboard() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
      subscribeToChanges();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    const [achievementsRes, integrationsRes] = await Promise.all([
      supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('integration_connections')
        .select('*'),
    ]);

    if (achievementsRes.data) setAchievements(achievementsRes.data);
    if (integrationsRes.data) setIntegrations(integrationsRes.data);
    setLoading(false);
  };

  const subscribeToChanges = () => {
    if (!user) return;

    const channel = supabase
      .channel('achievements-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'achievements',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const stats = {
    total: achievements.length,
    verified: achievements.filter((a) => a.verification_status === 'verified').length,
    internships: achievements.filter((a) => a.type === 'internship').length,
    courses: achievements.filter((a) => a.type === 'course').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Track your achievements and integrations in real-time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Achievements"
          value={stats.total}
          icon={<Award className="w-5 h-5" />}
          color="blue"
        />
        <StatsCard
          title="Verified"
          value={stats.verified}
          icon={<TrendingUp className="w-5 h-5" />}
          color="green"
        />
        <StatsCard
          title="Internships"
          value={stats.internships}
          icon={<Briefcase className="w-5 h-5" />}
          color="orange"
        />
        <StatsCard
          title="Courses"
          value={stats.courses}
          icon={<BookOpen className="w-5 h-5" />}
          color="cyan"
        />
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Platform Integrations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <IntegrationCard
            platform="LinkedIn"
            connected={integrations.some((i) => i.platform === 'linkedin')}
            lastSync={integrations.find((i) => i.platform === 'linkedin')?.last_sync_at}
          />
          <IntegrationCard
            platform="GitHub"
            connected={integrations.some((i) => i.platform === 'github')}
            lastSync={integrations.find((i) => i.platform === 'github')?.last_sync_at}
          />
          <IntegrationCard
            platform="Coursera"
            connected={integrations.some((i) => i.platform === 'coursera')}
            lastSync={integrations.find((i) => i.platform === 'coursera')?.last_sync_at}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Recent Achievements</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Achievement
          </button>
        </div>

        {achievements.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No achievements yet</h3>
            <p className="text-slate-600 mb-6">Start adding your achievements or connect platforms to auto-sync</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add Your First Achievement
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} onUpdate={loadData} />
            ))}
          </div>
        )}
      </div>

      {showAddModal && <AddAchievementModal onClose={() => setShowAddModal(false)} onAdd={loadData} />}
    </div>
  );
}
