import { Database } from '../../lib/database.types';
import { supabase } from '../../lib/supabase';
import {
  Briefcase,
  GraduationCap,
  BookOpen,
  Trophy,
  FolderGit2,
  Award,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useState } from 'react';

type Achievement = Database['public']['Tables']['achievements']['Row'];

interface AchievementCardProps {
  achievement: Achievement;
  onUpdate: () => void;
}

const typeIcons = {
  internship: Briefcase,
  education: GraduationCap,
  course: BookOpen,
  hackathon: Trophy,
  project: FolderGit2,
  certification: Award,
};

const typeColors = {
  internship: 'bg-blue-50 text-blue-600 border-blue-200',
  education: 'bg-green-50 text-green-600 border-green-200',
  course: 'bg-orange-50 text-orange-600 border-orange-200',
  hackathon: 'bg-purple-50 text-purple-600 border-purple-200',
  project: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  certification: 'bg-amber-50 text-amber-600 border-amber-200',
};

export function AchievementCard({ achievement, onUpdate }: AchievementCardProps) {
  const [deleting, setDeleting] = useState(false);
  const Icon = typeIcons[achievement.type];

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;

    setDeleting(true);
    const { error } = await supabase
      .from('achievements')
      .delete()
      .eq('id', achievement.id);

    if (!error) {
      onUpdate();
    } else {
      setDeleting(false);
    }
  };

  const toggleVisibility = async () => {
    await supabase
      .from('achievements')
    onUpdate();
  };

  const formatDate = (date: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className={`bg-white rounded-xl border-2 p-6 transition-all hover:shadow-lg ${
      achievement.is_visible ? 'border-slate-200' : 'border-slate-200 opacity-60'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className={`p-3 rounded-xl border ${typeColors[achievement.type]}`}>
            <Icon className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{achievement.title}</h3>
                <p className="text-slate-700 font-medium">{achievement.organization}</p>
              </div>

              <div className="flex items-center gap-2">
                {achievement.verification_status === 'verified' ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    Unverified
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-3">
              {achievement.start_date && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(achievement.start_date)} - {achievement.end_date ? formatDate(achievement.end_date) : 'Present'}
                </span>
              )}
              {achievement.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {achievement.location}
                </span>
              )}
            </div>

            {achievement.description && (
              <p className="text-slate-600 mb-3 leading-relaxed">{achievement.description}</p>
            )}

            {achievement.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {achievement.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
        <button
          onClick={toggleVisibility}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
        >
          {achievement.is_visible ? (
            <>
              <Eye className="w-4 h-4" />
              Visible
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4" />
              Hidden
            </>
          )}
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
}
