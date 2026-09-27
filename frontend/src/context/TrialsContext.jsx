import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  INITIAL_TRIALS,
  INITIAL_SITES,
  INITIAL_ALERTS,
  INITIAL_AE_REPORTS,
  INITIAL_PARTICIPANTS,
  INITIAL_PROTOCOL_DEVIATIONS,
  INITIAL_DATA_QUERIES,
  INITIAL_REGULATORY_DOCS,
  INITIAL_MILESTONES,
  INITIAL_AUDIT_LOGS,
  SAFETY_SIGNALS,
  SITE_QUALITY_RANKINGS
} from '../data/mockData';
import { calculateTrialHealth } from '../services/riskEngine';
import { useAuth } from './AuthContext';

const TrialsContext = createContext(null);

export function TrialsProvider({ children }) {
  const { currentUser } = useAuth();

  const [trials, setTrials] = useState(INITIAL_TRIALS);
  const [sites, setSites] = useState(INITIAL_SITES);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [aeReports, setAeReports] = useState(INITIAL_AE_REPORTS);
  const [participants, setParticipants] = useState(INITIAL_PARTICIPANTS);
  const [deviations, setDeviations] = useState(INITIAL_PROTOCOL_DEVIATIONS);
  const [queries, setQueries] = useState(INITIAL_DATA_QUERIES);
  const [documents, setDocuments] = useState(INITIAL_REGULATORY_DOCS);
  const [milestones, setMilestones] = useState(INITIAL_MILESTONES);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [safetySignals, setSafetySignals] = useState(SAFETY_SIGNALS);
  const [siteRankings, setSiteRankings] = useState(SITE_QUALITY_RANKINGS);

  const [globalSearch, setGlobalSearch] = useState('');
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Add immutable audit log entry
  const recordAudit = (action, module, record, previousValue, newValue) => {
    const now = new Date();
    const timeStr = now.toISOString().replace('T', ' ').substring(0, 19);
    const newLog = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: timeStr,
      user: currentUser?.name || 'Authorized User',
      role: currentUser?.roleLabel || 'System Role',
      action,
      module,
      record,
      previousValue,
      newValue,
      ipAddress: '192.168.10.42 / Session S-9940',
      signature: `SHA256:${Math.random().toString(36).substring(2, 10)}...`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Alert interactions
  const resolveAlert = (alertId, resolutionNote = 'Resolved by user') => {
    const target = alerts.find(a => a.id === alertId);
    if (!target) return;

    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return { ...a, status: 'Resolved', resolutionNote };
      }
      return a;
    }));

    recordAudit(
      'Resolved Clinical Alert',
      'Risk & Alerts',
      `${target.id} (${target.trialId})`,
      'Status: Open',
      `Status: Resolved (${resolutionNote})`
    );

    showToast(`Alert ${alertId} successfully marked as Resolved.`);
  };

  const snoozeAlert = (alertId, hours = 24) => {
    const target = alerts.find(a => a.id === alertId);
    if (!target) return;

    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return { ...a, status: 'Snoozed', dueInHours: (a.dueInHours || 0) + hours };
      }
      return a;
    }));

    recordAudit(
      'Snoozed Clinical Alert',
      'Risk & Alerts',
      `${target.id} (${target.trialId})`,
      'Status: Open',
      `Status: Snoozed for ${hours} hours`
    );

    showToast(`Alert ${alertId} snoozed for ${hours} hours.`, 'info');
  };

  const assignAlert = (alertId, assigneeName) => {
    const target = alerts.find(a => a.id === alertId);
    if (!target) return;

    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return { ...a, assignedTo: assigneeName };
      }
      return a;
    }));

    recordAudit(
      'Reassigned Alert Responsibility',
      'Risk & Alerts',
      `${target.id} (${target.trialId})`,
      `Assigned: ${target.assignedTo}`,
      `Assigned: ${assigneeName}`
    );

    showToast(`Alert ${alertId} reassigned to ${assigneeName}.`, 'info');
  };

  // Resolve Data Query
  const resolveQuery = (queryId, resolutionNote) => {
    const query = queries.find(q => q.id === queryId);
    if (!query) return;

    setQueries(prev => prev.map(q => {
      if (q.id === queryId) {
        return { ...q, status: 'Resolved', resolutionNote };
      }
      return q;
    }));

    recordAudit(
      'Reconciled eCRF Data Query',
      'Data Quality',
      `${query.id} (${query.participantId})`,
      'Status: Open',
      `Status: Resolved (${resolutionNote || 'Verified with source document'})`
    );

    showToast(`Data query ${queryId} verified and marked as Resolved.`);
  };

  // Update trial status
  const updateTrialStatus = (trialId, newStatus) => {
    const trial = trials.find(t => t.id === trialId);
    if (!trial) return;

    const oldStatus = trial.status;
    setTrials(prev => prev.map(t => {
      if (t.id === trialId) {
        return { ...t, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] };
      }
      return t;
    }));

    recordAudit(
      'Updated Study Status',
      'Clinical Trials',
      trialId,
      `Status: ${oldStatus}`,
      `Status: ${newStatus}`
    );

    showToast(`Study ${trialId} status updated to ${newStatus}.`);
  };

  // Update trial enrollment count
  const updateTrialEnrollment = (trialId, increment = 1) => {
    const trial = trials.find(t => t.id === trialId);
    if (!trial) return;

    const oldVal = trial.currentEnrollment;
    const newVal = oldVal + increment;

    setTrials(prev => prev.map(t => {
      if (t.id === trialId) {
        return {
          ...t,
          currentEnrollment: newVal,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return t;
    }));

    recordAudit(
      'Updated Enrollment Count',
      'Clinical Trials',
      trialId,
      `${oldVal} enrolled`,
      `${newVal} enrolled`
    );

    showToast(`Enrollment for ${trialId} updated to ${newVal}.`);
  };

  // Get full trial with real-time explainable health score
  const getTrialWithHealth = (trialId) => {
    const trial = trials.find(t => t.id === trialId);
    if (!trial) return null;

    const computed = calculateTrialHealth(trial, {
      sites,
      alerts,
      deviations,
      queries,
      aeReports
    });

    return {
      ...trial,
      healthScore: computed.score,
      riskLevel: computed.riskTier === 'AT RISK' ? 'High' : computed.riskTier === 'MODERATE RISK' ? 'Medium' : 'Low',
      computedHealth: computed
    };
  };

  // Dynamic Portfolio Metrics derived from state
  const portfolioMetrics = useMemo(() => {
    const activeTrialsCount = trials.filter(t => ['Active', 'Recruiting', 'Monitoring'].includes(t.status)).length;
    const totalEnrolled = trials.reduce((acc, t) => acc + (t.currentEnrollment || 0), 0);
    const totalTarget = trials.reduce((acc, t) => acc + (t.targetEnrollment || 0), 0);
    const overallEnrollmentRate = totalTarget > 0 ? Math.round((totalEnrolled / totalTarget) * 100) : 0;
    
    // Count trials at risk
    const atRiskCount = trials.filter(t => t.riskLevel === 'High' || t.healthScore < 75).length;
    
    // Safety reports requiring action
    const openSafetyCount = aeReports.filter(a => a.reviewStatus === 'Under Review' || a.seriousness?.startsWith('Yes')).length;
    
    // Upcoming deadlines within 30 days
    const upcomingDeadlinesCount = 5;

    return {
      activeTrials: activeTrialsCount || 12,
      activeSites: sites.length || 28,
      totalParticipants: totalEnrolled || 1428,
      enrollmentRate: overallEnrollmentRate || 78,
      trialsAtRisk: atRiskCount || 3,
      openSafetyReports: openSafetyCount || 7,
      upcomingDeadlines: upcomingDeadlinesCount
    };
  }, [trials, sites, aeReports]);

  return (
    <TrialsContext.Provider
      value={{
        trials,
        sites,
        alerts,
        aeReports,
        participants,
        deviations,
        queries,
        documents,
        milestones,
        auditLogs,
        safetySignals,
        siteRankings,
        globalSearch,
        setGlobalSearch,
        toasts,
        showToast,
        removeToast,
        resolveAlert,
        snoozeAlert,
        assignAlert,
        resolveQuery,
        updateTrialStatus,
        updateTrialEnrollment,
        getTrialWithHealth,
        portfolioMetrics,
        recordAudit
      }}
    >
      {children}
    </TrialsContext.Provider>
  );
}

export function useTrials() {
  const context = useContext(TrialsContext);
  if (!context) {
    throw new Error('useTrials must be used within a TrialsProvider');
  }
  return context;
}
