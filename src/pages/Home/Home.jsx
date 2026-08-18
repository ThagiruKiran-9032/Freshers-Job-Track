import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../components/common/Container';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Search, MapPin, Upload, Sparkles, ArrowRight, Code, BarChart2, Cpu, Layout as LayoutIcon, CheckCircle2, ShieldCheck, Compass, Target, Send, Zap } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const [homeKeyword, setHomeKeyword] = useState('');
  const [homeLocation, setHomeLocation] = useState('');

  const handleHomeSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (homeKeyword.trim()) params.set('search', homeKeyword.trim());
    if (homeLocation.trim()) params.set('location', homeLocation.trim());
    params.set('level', 'Entry Level');
    navigate(`/jobs?${params.toString()}`);
  };

  const categories = [
    { name: 'Software Engineering', icon: Code, count: 'Entry Level Roles', bg: '#e0e7ff', color: '#4f46e5', query: 'Software Engineering' },
    { name: 'Data Science & Analytics', icon: BarChart2, count: 'Junior Analyst Roles', bg: '#e0f2fe', color: '#0284c7', query: 'Data Science & Analytics' },
    { name: 'UX & Design', icon: LayoutIcon, count: 'Frontend & UI Roles', bg: '#fce7f3', color: '#db2777', query: 'UX & Design' },
    { name: 'IT & System Admin', icon: ShieldCheck, count: 'QA & Tech Support', bg: '#d1fae5', color: '#059669', query: 'IT & System Admin' },
    { name: 'AI & Machine Learning', icon: Cpu, count: 'Trainee Positions', bg: '#f3e8ff', color: '#7c3aed', query: 'AI & Machine Learning' },
    { name: 'QA & Testing', icon: Compass, count: 'Quality & Test Roles', bg: '#fef3c7', color: '#d97706', query: 'QA & Testing' }
  ];

  const steps = [
    { number: '01', title: 'Discover', desc: 'Browse entry-level opportunities tailored specifically for fresh engineering & CS graduates.', icon: Compass },
    { number: '02', title: 'Match', desc: 'Automatic resume skill extraction compares your background against real job requirements.', icon: Target },
    { number: '03', title: 'Apply', desc: 'Directly apply to verified employer application links with confidence.', icon: Send }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        padding: 'var(--spacing-2xl) 0',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--gradient-hero)',
        position: 'relative'
      }}>
        <Container style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', marginBottom: 'var(--spacing-md)' }}>
            <Badge variant="primary" icon={Sparkles} style={{ background: 'var(--badge-purple-bg)', color: 'var(--badge-purple-text)', border: '1px solid #e9d5ff', padding: '6px 14px', fontSize: 'var(--font-size-xs)' }}>
              Dedicated Fresher Career Intelligence
            </Badge>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, var(--font-size-3xl))',
            maxWidth: '820px',
            margin: '0 auto var(--spacing-md)',
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
            fontWeight: 800,
            color: 'var(--color-text)'
          }}>
            Find work that fits your future. <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Zero Experience Needed.</span>
          </h1>

          <p style={{
            color: 'var(--color-text-muted)',
            fontSize: 'var(--font-size-md)',
            maxWidth: '640px',
            margin: '0 auto var(--spacing-xl)',
            lineHeight: 1.6,
            fontWeight: 500
          }}>
            JobTrack connects fresh graduates and 0–1 year candidates with verified entry-level software, data, and technology opportunities.
          </p>

          {/* Feature highlights bar */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-lg)', flexWrap: 'wrap', marginBottom: 'var(--spacing-xl)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--badge-green-bg)', padding: '4px 12px', borderRadius: 'var(--radius-full)' }}>
              <Zap size={14} /> 100% Fresher Verified
            </span>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--badge-blue-text)', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--badge-blue-bg)', padding: '4px 12px', borderRadius: 'var(--radius-full)' }}>
              🎯 0-2 Yrs Experience Only
            </span>
            <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--badge-purple-text)', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--badge-purple-bg)', padding: '4px 12px', borderRadius: 'var(--radius-full)' }}>
              🚀 Auto Resume Matcher
            </span>
          </div>

          {/* Unified Home Search Bar */}
          <form onSubmit={handleHomeSearch} style={{ maxWidth: '680px', margin: '0 auto var(--spacing-xl)' }}>
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-sm)',
              backgroundColor: '#ffffff',
              padding: 'var(--spacing-sm)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border-focus)',
              boxShadow: 'var(--shadow-md)',
              flexWrap: 'wrap'
            }}>
              <div style={{ flex: 1, minWidth: '180px', display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px' }}>
                <Search size={18} style={{ color: 'var(--color-primary)' }} />
                <input
                  type="text"
                  placeholder="Job title, skill, or role (e.g. React)..."
                  value={homeKeyword}
                  onChange={(e) => setHomeKeyword(e.target.value)}
                  style={{ width: '100%', border: 'none', backgroundColor: 'transparent', padding: '8px 0', fontSize: 'var(--font-size-sm)' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: '160px', display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px', borderLeft: '1px solid var(--color-border)' }}>
                <MapPin size={18} style={{ color: 'var(--color-info)' }} />
                <input
                  type="text"
                  placeholder="Location (e.g. New York, Remote)..."
                  value={homeLocation}
                  onChange={(e) => setHomeLocation(e.target.value)}
                  style={{ width: '100%', border: 'none', backgroundColor: 'transparent', padding: '8px 0', fontSize: 'var(--font-size-sm)' }}
                />
              </div>
              <Button type="submit" variant="primary" icon={Search} style={{ background: 'var(--gradient-primary)', border: 'none', borderRadius: 'var(--radius-lg)' }}>
                Find Opportunities
              </Button>
            </div>
          </form>

          {/* Quick Action CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
            <Button variant="primary" size="lg" icon={ArrowRight} style={{ background: 'var(--gradient-primary)', border: 'none', boxShadow: 'var(--shadow-glow)' }} onClick={() => navigate('/jobs?level=Entry%20Level')}>
              Explore Jobs
            </Button>
            <Button variant="secondary" size="lg" icon={Upload} style={{ backgroundColor: '#ffffff', borderColor: 'var(--color-border-hover)', boxShadow: 'var(--shadow-sm)' }} onClick={() => navigate('/resume')}>
              Upload Resume
            </Button>
          </div>
        </Container>
      </div>

      <Container>
        {/* Opportunity Categories Section */}
        <div style={{ padding: 'var(--spacing-2xl) 0' }}>
          <SectionHeader
            title="Explore Opportunity Categories"
            subtitle="Targeted entry-level roles across modern tech stacks"
            badgeText="Fresher Friendly"
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'var(--spacing-lg)'
          }}>
            {categories.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <Card
                  key={idx}
                  hover
                  onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.query)}&level=Entry%20Level`)}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: cat.bg,
                    color: cat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <IconComp size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginBottom: '2px' }}>{cat.name}</h3>
                    <p style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--font-size-xs)', fontWeight: 500 }}>{cat.count}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Resume Workflow Visual Section */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <Card style={{ padding: 'var(--spacing-2xl) var(--spacing-xl)', backgroundColor: 'var(--color-surface)', border: '1px solid #c7d2fe', boxShadow: 'var(--shadow-md)' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--spacing-xl)',
              alignItems: 'center'
            }}>
              <div>
                <Badge variant="info" style={{ marginBottom: 'var(--spacing-md)', background: 'var(--badge-blue-bg)', color: 'var(--badge-blue-text)' }}>Resume Matching Engine</Badge>
                <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-md)', lineHeight: 1.3, fontWeight: 800 }}>
                  Let your resume introduce you to the right roles.
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6, marginBottom: 'var(--spacing-lg)' }}>
                  JobTrack analyzes your skills, projects, and educational background to present verified opportunities where your candidate profile stands out.
                </p>
                <Button variant="primary" icon={Upload} style={{ background: 'var(--gradient-primary)', border: 'none' }} onClick={() => navigate('/resume')}>
                  Build Profile from Resume
                </Button>
              </div>

              {/* Visual Workflow Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {[
                  { step: '1. Upload your resume', detail: 'Parse your PDF or DOCX resume automatically.' },
                  { step: '2. Build your profile', detail: 'Extract skills, education, and candidate preferences.' },
                  { step: '3. Discover better-fit roles', detail: 'Review matched fresher opportunities with clear details.' }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'var(--color-surface-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)'
                  }}>
                    <CheckCircle2 size={20} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700 }}>{item.step}</h4>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', marginTop: '2px' }}>{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* How JobTrack Works */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <SectionHeader
            title="How JobTrack Works"
            subtitle="Simple three-step approach to starting your tech career"
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--spacing-lg)'
          }}>
            {steps.map((st, idx) => {
              return (
                <Card key={idx} hover style={{ position: 'relative' }}>
                  <div style={{
                    fontSize: 'var(--font-size-2xl)',
                    fontWeight: 800,
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: 'var(--spacing-sm)',
                    fontFamily: 'var(--font-heading)'
                  }}>
                    {st.number}
                  </div>
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--spacing-xs)' }}>{st.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', lineHeight: 1.5 }}>
                    {st.desc}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Final CTA Banner */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <Card style={{
            textAlign: 'center',
            padding: 'var(--spacing-2xl)',
            background: 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)',
            border: '1px solid #c7d2fe'
          }}>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--spacing-sm)' }}>
              Ready to start your fresher career journey?
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', fontWeight: 500, maxWidth: '520px', margin: '0 auto var(--spacing-lg)' }}>
              Explore entry-level engineering roles or upload your resume to build your candidate profile.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
              <Button variant="primary" icon={ArrowRight} style={{ background: 'var(--gradient-primary)', border: 'none' }} onClick={() => navigate('/jobs?level=Entry%20Level')}>
                Browse All Jobs
              </Button>
              <Button variant="secondary" icon={Upload} style={{ backgroundColor: '#ffffff' }} onClick={() => navigate('/resume')}>
                Upload Resume
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
};
