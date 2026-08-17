import React, { useState } from 'react';
import { BookOpen, CheckCircle, ArrowRight, Code, Sparkles, HelpCircle, FileText } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ResumeManager } from '../Resumes/ResumeManager';

export const Resources = () => {
  const [activeTab, setActiveTab] = useState('roadmaps'); // 'roadmaps', 'resumes', 'questions'

  const frontendSteps = [
    { title: '1. HTML5 & Semantic Web', desc: 'Master document structure, accessibility standards, form validations, and ARIA attributes.' },
    { title: '2. CSS3 & Flexbox/Grid', desc: 'Learn responsive layout math, custom CSS properties (variables), transitions, and glassmorphism styling.' },
    { title: '3. Modern JavaScript (ES6+)', desc: 'DOM manipulation, promises, async/await, closures, array methods (map, filter, reduce), and modules.' },
    { title: '4. React.js Core Concepts', desc: 'Components, props, state, hooks (useState, useEffect, useMemo, useCallback, useRef), and Context API.' },
    { title: '5. Single Page Routing & APIs', desc: 'React Router DOM navigation, Axios HTTP data fetching, data normalization, and loading/error states.' },
    { title: '6. Version Control & Git', desc: 'Git commands (commit, branch, merge, rebase), pull requests, and publishing open-source projects on GitHub.' },
    { title: '7. Build Portfolio Projects', desc: 'Construct real-world SaaS applications like JobTrack demonstrating API integration, state management, and CSS design systems.' }
  ];

  const interviewQA = [
    {
      q: 'Tell me about yourself as a fresher candidate.',
      a: 'Structure your answer using the Present-Past-Future model: Start with your current degree and key technical focus (e.g. B.Tech CS focusing on React), highlight 1-2 impactful projects you built, and express why you are excited about entry-level engineering roles.'
    },
    {
      q: 'What is the difference between Virtual DOM and Real DOM in React?',
      a: 'Virtual DOM is a lightweight JS representation of the real DOM. When state changes, React creates a new Virtual DOM tree, diffs it against the previous one using the Reconciliation algorithm, and updates ONLY the changed nodes in the Real DOM for optimal performance.'
    },
    {
      q: 'Explain the difference between let, const, and var in JavaScript.',
      a: 'var is function-scoped and hoisted. let and const are block-scoped. const prevents re-assignment of primitive variable references, whereas let allows variable re-assignment within its block scope.'
    },
    {
      q: 'What is a RESTful API and how do you handle asynchronous data fetching?',
      a: 'REST APIs use standard HTTP methods (GET, POST, PUT, DELETE) to transfer JSON resource representations. Asynchronous data fetching is handled in React using async/await syntax inside useEffect hooks or query libraries.'
    }
  ];

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Fresher Career Resources 🚀</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Interactive skill roadmaps, resume version management, and entry-level interview preparation.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
        {[
          { id: 'roadmaps', label: 'Developer Roadmaps', icon: Code },
          { id: 'resumes', label: 'Resume Version Manager', icon: FileText },
          { id: 'questions', label: 'Fresher Interview Q&A', icon: HelpCircle }
        ].map(t => {
          const IconComp = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                border: 'none',
                background: 'none',
                borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9375rem',
                cursor: 'pointer'
              }}
            >
              <IconComp size={18} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Roadmaps */}
      {activeTab === 'roadmaps' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Code size={24} style={{ color: 'var(--color-primary)' }} />
              <div>
                <h2 style={{ fontSize: '1.25rem' }}>Frontend Developer Career Roadmap 🗺️</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Step-by-step path to master modern frontend engineering for freshers.</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              {frontendSteps.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {idx + 1}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{step.title}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Resumes */}
      {activeTab === 'resumes' && (
        <div>
          <ResumeManager />
        </div>
      )}

      {/* Tab 3: Questions */}
      {activeTab === 'questions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {interviewQA.map((item, qIdx) => (
            <Card key={qIdx}>
              <h3 style={{ fontSize: '1.0625rem', color: 'var(--color-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HelpCircle size={18} /> {item.q}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.6, backgroundColor: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                {item.a}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
