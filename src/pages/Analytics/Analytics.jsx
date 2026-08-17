import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { BarChart3, TrendingUp, Award, Video, CheckCircle2, Target } from 'lucide-react';
import { useApplications, APPLICATION_STAGES } from '../../context/ApplicationContext';
import { useInterviews } from '../../context/InterviewContext';
import { Card } from '../../components/common/Card';

export const Analytics = () => {
  const { applications } = useApplications();
  const { interviews } = useInterviews();

  const totalApps = applications.length;
  const interviewApps = applications.filter(a => a.status === 'Interview' || a.status === 'Offer').length;
  const offerApps = applications.filter(a => a.status === 'Offer').length;

  const interviewRate = totalApps > 0 ? Math.round((interviewApps / totalApps) * 100) : 0;
  const offerRate = totalApps > 0 ? Math.round((offerApps / totalApps) * 100) : 0;

  // Pie Chart Data
  const pieData = APPLICATION_STAGES.map(stage => ({
    name: stage.label,
    value: applications.filter(a => a.status === stage.id).length,
    color: stage.color
  })).filter(item => item.value > 0);

  // Bar Chart Data (Monthly trends)
  const barData = [
    { month: 'May', applications: 4, interviews: 1 },
    { month: 'Jun', applications: 7, interviews: 2 },
    { month: 'Jul', applications: 12, interviews: 3 },
    { month: 'Aug', applications: totalApps, interviews: interviewApps }
  ];

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Application Analytics 📈</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Insights into your job application funnel, interview conversion rates, and monthly progress.
        </p>
      </div>

      {/* Top Key Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <Card glass>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL APPLICATIONS</span>
            <Target size={20} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{totalApps}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>Active Pipeline</span>
        </Card>

        <Card glass>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>INTERVIEW CONVERSION</span>
            <Video size={20} style={{ color: 'var(--color-warning)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--color-warning)' }}>
            {interviewRate}%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{interviewApps} Applications Reached Interview</span>
        </Card>

        <Card glass>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>OFFER RATE</span>
            <Award size={20} style={{ color: 'var(--color-success)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--color-success)' }}>
            {offerRate}%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>{offerApps} Official Offers</span>
        </Card>

        <Card glass>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>INTERVIEWS SCHEDULED</span>
            <TrendingUp size={20} style={{ color: 'var(--color-info)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{interviews.length}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Total Scheduled Rounds</span>
        </Card>
      </div>

      {/* Recharts Diagrams Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {/* Status Distribution Pie Chart */}
        <Card>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Pipeline Status Distribution</h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly Activity Bar Chart */}
        <Card>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Monthly Job Application Growth</h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="month" stroke="var(--text-subtle)" />
                <YAxis stroke="var(--text-subtle)" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)' }}
                />
                <Bar dataKey="applications" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Applications" />
                <Bar dataKey="interviews" fill="var(--color-warning)" radius={[4, 4, 0, 0]} name="Interviews" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
