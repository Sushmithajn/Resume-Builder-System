import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Database } from '../../lib/database.types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Sparkles, Download } from 'lucide-react';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Achievement = Database['public']['Tables']['achievements']['Row'];

export function ResumePreview() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
      subscribeToChanges();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    const [profileRes, achievementsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_visible', true)
        .order('start_date', { ascending: false }),
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (achievementsRes.data) setAchievements(achievementsRes.data);
    setLoading(false);
  };

  const subscribeToChanges = () => {
    if (!user) return;

    const channel = supabase
      .channel('resume-changes')
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
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
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

  const groupedAchievements = {
    education: achievements.filter((a) => a.type === 'education'),
    internship: achievements.filter((a) => a.type === 'internship'),
    project: achievements.filter((a) => a.type === 'project'),
    course: achievements.filter((a) => a.type === 'course'),
    certification: achievements.filter((a) => a.type === 'certification'),
    hackathon: achievements.filter((a) => a.type === 'hackathon'),
  };

  const formatDate = (date: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Resume Preview</h1>
          <p className="text-slate-600">Live preview updates automatically as you add achievements</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md">
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{profile?.full_name || 'Your Name'}</h1>
          {profile?.headline && (
            <p className="text-xl text-slate-600 mb-4">{profile.headline}</p>
          )}

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Mail className="w-4 h-4" />
                {profile.email}
              </a>
            )}
            {profile?.phone && (
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {profile.phone}
              </span>
            )}
            {profile?.location && (
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {profile.location}
              </span>
            )}
            {profile?.portfolio_url && (
              <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Globe className="w-4 h-4" />
                Portfolio
              </a>
            )}
            {profile?.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            )}
            {profile?.github_url && (
              <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Github className="w-4 h-4" />
                GitHub
              </a>
            )}
          </div>
        </div>

        {profile?.ai_summary && (
          <div className="mb-8 pb-8 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-xl font-bold text-slate-900">Professional Summary</h2>
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-slate-700 leading-relaxed">{profile.ai_summary}</p>
          </div>
        )}

        {groupedAchievements.education.length > 0 && (
          <div className="mb-8 pb-8 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Education</h2>
            <div className="space-y-4">
              {groupedAchievements.education.map((achievement) => (
                <div key={achievement.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-slate-900">{achievement.title}</h3>
                    <span className="text-sm text-slate-600">
                      {formatDate(achievement.start_date)} - {achievement.end_date ? formatDate(achievement.end_date) : 'Present'}
                    </span>
                  </div>
                  <p className="text-slate-700 mb-1">{achievement.organization}</p>
                  {achievement.location && (
                    <p className="text-sm text-slate-600 mb-2">{achievement.location}</p>
                  )}
                  {achievement.description && (
                    <p className="text-slate-600 text-sm leading-relaxed">{achievement.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {groupedAchievements.internship.length > 0 && (
          <div className="mb-8 pb-8 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Experience</h2>
            <div className="space-y-4">
              {groupedAchievements.internship.map((achievement) => (
                <div key={achievement.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-slate-900">{achievement.title}</h3>
                    <span className="text-sm text-slate-600">
                      {formatDate(achievement.start_date)} - {achievement.end_date ? formatDate(achievement.end_date) : 'Present'}
                    </span>
                  </div>
                  <p className="text-slate-700 mb-1">{achievement.organization}</p>
                  {achievement.location && (
                    <p className="text-sm text-slate-600 mb-2">{achievement.location}</p>
                  )}
                  {achievement.description && (
                    <p className="text-slate-600 text-sm leading-relaxed mb-2">{achievement.description}</p>
                  )}
                  {achievement.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {achievement.skills.map((skill, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {groupedAchievements.project.length > 0 && (
          <div className="mb-8 pb-8 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Projects</h2>
            <div className="space-y-4">
              {groupedAchievements.project.map((achievement) => (
                <div key={achievement.id}>
                  <h3 className="font-semibold text-slate-900 mb-1">{achievement.title}</h3>
                  {achievement.description && (
                    <p className="text-slate-600 text-sm leading-relaxed mb-2">{achievement.description}</p>
                  )}
                  {achievement.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {achievement.skills.map((skill, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {(groupedAchievements.certification.length > 0 || groupedAchievements.course.length > 0) && (
          <div className="mb-8 pb-8 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Certifications & Courses</h2>
            <div className="space-y-3">
              {[...groupedAchievements.certification, ...groupedAchievements.course].map((achievement) => (
                <div key={achievement.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-slate-900">{achievement.title}</h3>
                      <p className="text-slate-700 text-sm">{achievement.organization}</p>
                    </div>
                    {achievement.end_date && (
                      <span className="text-sm text-slate-600">{formatDate(achievement.end_date)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {groupedAchievements.hackathon.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Hackathons & Competitions</h2>
            <div className="space-y-3">
              {groupedAchievements.hackathon.map((achievement) => (
                <div key={achievement.id}>
                  <h3 className="font-semibold text-slate-900">{achievement.title}</h3>
                  <p className="text-slate-700 text-sm mb-1">{achievement.organization}</p>
                  {achievement.description && (
                    <p className="text-slate-600 text-sm">{achievement.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
