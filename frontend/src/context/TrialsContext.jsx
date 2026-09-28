import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
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
  SITE_QUALITY_RANKINGS,
} from '../data/mockData';
import { calculateTrialHealth } from '../services/riskEngine';
import { useAuth } from './AuthContext';

const API_BASE = 'http://localhost:8001';
const TrialsContext = createContext(null);

const normalizeTrial = (trial = {}) => ({
  id: trial.id,
  title: trial.title,
  shortTitle: trial.short_title || trial.shortTitle || trial.title,
  studyType: trial.study_type || trial.studyType || 'Interventional Trial',
  phase: trial.phase || 'Phase II',
  piName: trial.pi_name || trial.piName || 'Unknown',
  piEmail: trial.pi_email || trial.piEmail || '',
  leadInstitution: trial.lead_institution || trial.leadInstitution || '',
  participatingSitesCount: trial.participating_sites_count || trial.participatingSitesCount || 1,
  siteIds: trial.site_ids || trial.siteIds || [],
  targetEnrollment: trial.target_enrollment ?? trial.targetEnrollment ?? 0,
  currentEnrollment: trial.current_enrollment ?? trial.currentEnrollment ?? 0,
  screenedCount: trial.screened_count ?? trial.screenedCount ?? 0,
  eligibleCount: trial.eligible_count ?? trial.eligibleCount ?? 0,
  randomizedCount: trial.randomized_count ?? trial.randomizedCount ?? 0,
  completedCount: trial.completed_count ?? trial.completedCount ?? 0,
  dropoutCount: trial.dropout_count ?? trial.dropoutCount ?? 0,
  status: trial.status || 'Active',
  riskLevel: trial.risk_level || trial.riskLevel || 'Low',
  healthScore: trial.health_score ?? trial.healthScore ?? 85,
  ctriNumber: trial.ctri_number || trial.ctriNumber || '',
  ctriStatus: trial.ctri_status || trial.ctriStatus || '',
  ctriNextUpdateDue: trial.ctri_next_update_due || trial.ctriNextUpdateDue || '',
  iecApprovalDate: trial.iec_approval_date || trial.iecApprovalDate || '',
  iecExpiryDate: trial.iec_expiry_date || trial.iecExpiryDate || '',
  iecStatus: trial.iec_status || trial.iecStatus || '',
  ndctApplicability: trial.ndct_applicability || trial.ndctApplicability || '',
  startDate: trial.start_date || trial.startDate || '',
  expectedCompletion: trial.expected_completion || trial.expectedCompletion || '',
  lastUpdated: trial.last_updated || trial.lastUpdated || '',
  intervention: trial.intervention || '',
  comparator: trial.comparator || '',
  primaryEndpoint: trial.primary_endpoint || trial.primaryEndpoint || '',
  population: trial.population || '',
  studyDesign: trial.study_design || trial.studyDesign || '',
  progress: trial.progress ?? 0,
  scoreBreakdown: trial.score_breakdown || {},
});

const normalizeParticipant = (participant = {}) => ({
  id: participant.id,
  trialId: participant.trial_id || participant.trialId || '',
  siteId: participant.site_id || participant.siteId || '',
  siteName: participant.site_name || participant.siteName || '',
  gender: participant.gender || '',
  age: participant.age || 0,
  randomizedArm: participant.randomized_arm || participant.randomizedArm || '',
  screeningDate: participant.screening_date || participant.screeningDate || '',
  randomizationDate: participant.randomization_date || participant.randomizationDate || '',
  screeningStatus: participant.screening_status || participant.screeningStatus || 'Eligible',
  enrollmentStatus: participant.enrollment_status || participant.enrollmentStatus || 'Enrolled',
  consentStatus: participant.consent_status || participant.consentStatus || 'Consented',
  participantStatus: participant.participant_status || participant.participantStatus || 'Active',
  lastVisitDate: participant.last_visit_date || participant.lastVisitDate || '',
  lastVisitName: participant.last_visit_name || participant.lastVisitName || '',
  nextVisitDate: participant.next_visit_date || participant.nextVisitDate || '',
  nextVisitName: participant.next_visit_name || participant.nextVisitName || '',
  adherenceRate: participant.adherence_rate ?? participant.adherenceRate ?? 95,
  hba1cBaseline: participant.hba1c_baseline ?? participant.hba1cBaseline ?? null,
  hba1cLatest: participant.hba1c_latest ?? participant.hba1cLatest ?? null,
  openQueriesCount: participant.open_queries_count ?? participant.openQueriesCount ?? 0,
});

const normalizeAE = (item = {}) => ({
  id: item.id,
  trialId: item.trial_id || item.trialId || '',
  trialShort: item.trial_short || item.trialShort || '',
  participantId: item.participant_id || item.participantId || '',
  participantAge: item.participant_age || item.participantAge || 0,
  participantGender: item.participant_gender || item.participantGender || '',
  siteId: item.site_id || item.siteId || '',
  siteName: item.site_name || item.siteName || '',
  adverseEvent: item.adverse_event || item.adverseEvent || '',
  meddraTerm: item.meddra_term || item.meddraTerm || '',
  meddraSoc: item.meddra_soc || item.meddraSoc || '',
  whodrugCode: item.whodrug_code || item.whodrugCode || '',
  severity: item.severity || '',
  seriousness: item.seriousness || '',
  seriousnessCriteria: item.seriousness_criteria || item.seriousnessCriteria || '',
  causality: item.causality || '',
  onsetDate: item.onset_date || item.onsetDate || '',
  reportDate: item.report_date || item.reportDate || '',
  reviewStatus: item.review_status || item.reviewStatus || 'Under Review',
  outcome: item.outcome || '',
  regulatorySubmissionStatus: item.regulatory_submission_status || item.regulatorySubmissionStatus || '',
  assignedPvOfficer: item.assigned_pv_officer || item.assignedPvOfficer || '',
  followUp: item.follow_up || item.followUp || '',
  actionTaken: item.action_taken || item.actionTaken || '',
  safetyStatus: item.safety_status || item.safetyStatus || 'Open',
});

const normalizeAlert = (item = {}) => ({
  id: item.id,
  trialId: item.trial_id || item.trialId || '',
  trialShort: item.trial_short || item.trialShort || '',
  category: item.category || 'Medium',
  severity: item.severity || 'Medium',
  title: item.title || '',
  description: item.description || '',
  date: item.date || '',
  responsibleRole: item.responsible_role || item.responsibleRole || 'pi',
  status: item.status || 'Open',
  assignedTo: item.assigned_to || item.assignedTo || '',
  dueInHours: item.due_in_hours ?? item.dueInHours ?? 24,
  recommendedAction: item.recommended_action || item.recommendedAction || '',
});

const normalizeAuditLog = (item = {}) => ({
  id: item.id,
  timestamp: item.timestamp || '',
  user: item.user || 'System',
  role: item.role || '',
  action: item.action || '',
  module: item.module || '',
  record: item.record || '',
  previousValue: item.previous_value || item.previousValue || '',
  newValue: item.new_value || item.newValue || '',
  ipAddress: item.ip_address || item.ipAddress || '',
  signature: item.signature || '',
});

export function TrialsProvider({ children }) {
  const { currentUser, token } = useAuth();

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

  useEffect(() => {
    const loadData = async () => {
      if (!token) return;
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [trialRes, participantRes, alertRes, aeRes, auditRes, siteRes, milestoneRes] = await Promise.all([
          fetch(`${API_BASE}/trials/`, { headers }),
          fetch(`${API_BASE}/trials/participants`, { headers }),
          fetch(`${API_BASE}/trials/alerts`, { headers }),
          fetch(`${API_BASE}/safety/ae-reports`, { headers }),
          fetch(`${API_BASE}/audit/logs`, { headers }),
          fetch(`${API_BASE}/trials/sites`, { headers }),
          fetch(`${API_BASE}/trials/milestones`, { headers }),
        ]);

        if (trialRes.ok) {
          const trialData = await trialRes.json();
          setTrials(trialData.map(normalizeTrial));
        }
        if (participantRes.ok) {
          const participantData = await participantRes.json();
          setParticipants(participantData.map(normalizeParticipant));
        }
        if (alertRes.ok) {
          const alertData = await alertRes.json();
          setAlerts(alertData.map(normalizeAlert));
        }
        if (aeRes.ok) {
          const aeData = await aeRes.json();
          setAeReports(aeData.map(normalizeAE));
        }
        if (auditRes.ok) {
          const auditData = await auditRes.json();
          setAuditLogs(auditData.map(normalizeAuditLog));
        }
        if (siteRes.ok) {
          const siteData = await siteRes.json();
          setSites(siteData.map((s) => ({
            ...s,
            id: s.id,
            name: s.name,
            city: s.city,
            state: s.state,
            piName: s.pi_name || s.piName,
            contactEmail: s.contact_email || s.contactEmail,
            enrolledCount: s.enrolled_count ?? s.enrolledCount,
            targetCount: s.target_count ?? s.targetCount,
            dataQualityScore: s.data_quality_score ?? s.dataQualityScore,
            openQueriesCount: s.open_queries_count ?? s.openQueriesCount,
            monitoringStatus: s.monitoring_status ?? s.monitoringStatus,
            lastMonitoringDate: s.last_monitoring_date ?? s.lastMonitoringDate,
            nextMonitoringDate: s.next_monitoring_date ?? s.nextMonitoringDate,
            riskLevel: s.risk_level ?? s.riskLevel,
          })));
        }
        if (milestoneRes.ok) {
          const milestoneData = await milestoneRes.json();
          setMilestones(milestoneData);
        }
      } catch (error) {
        // leave the mock dataset as fallback
      }
    };

    loadData();
  }, [token]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

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
      signature: `SHA256:${Math.random().toString(36).substring(2, 10)}...`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const resolveAlert = (alertId, resolutionNote = 'Resolved by user') => {
    const target = alerts.find((a) => a.id === alertId);
    if (!target) return;
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, status: 'Resolved', resolutionNote } : a)));
    recordAudit('Resolved Clinical Alert', 'Risk & Alerts', `${target.id} (${target.trialId})`, 'Status: Open', `Status: Resolved (${resolutionNote})`);
    showToast(`Alert ${alertId} successfully marked as Resolved.`);
  };

  const snoozeAlert = (alertId, hours = 24) => {
    const target = alerts.find((a) => a.id === alertId);
    if (!target) return;
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, status: 'Snoozed', dueInHours: (a.dueInHours || 0) + hours } : a)));
    recordAudit('Snoozed Clinical Alert', 'Risk & Alerts', `${target.id} (${target.trialId})`, 'Status: Open', `Status: Snoozed for ${hours} hours`);
    showToast(`Alert ${alertId} snoozed for ${hours} hours.`, 'info');
  };

  const assignAlert = (alertId, assigneeName) => {
    const target = alerts.find((a) => a.id === alertId);
    if (!target) return;
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, assignedTo: assigneeName } : a)));
    recordAudit('Reassigned Alert Responsibility', 'Risk & Alerts', `${target.id} (${target.trialId})`, `Assigned: ${target.assignedTo}`, `Assigned: ${assigneeName}`);
    showToast(`Alert ${alertId} reassigned to ${assigneeName}.`, 'info');
  };

  const resolveQuery = (queryId, resolutionNote) => {
    const query = queries.find((q) => q.id === queryId);
    if (!query) return;
    setQueries((prev) => prev.map((q) => (q.id === queryId ? { ...q, status: 'Resolved', resolutionNote } : q)));
    recordAudit('Reconciled eCRF Data Query', 'Data Quality', `${query.id} (${query.participantId})`, 'Status: Open', `Status: Resolved (${resolutionNote || 'Verified with source document'})`);
    showToast(`Data query ${queryId} verified and marked as Resolved.`);
  };

  const updateTrialStatus = (trialId, newStatus) => {
    const trial = trials.find((t) => t.id === trialId);
    if (!trial) return;
    const oldStatus = trial.status;
    setTrials((prev) => prev.map((t) => (t.id === trialId ? { ...t, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] } : t)));
    recordAudit('Updated Study Status', 'Clinical Trials', trialId, `Status: ${oldStatus}`, `Status: ${newStatus}`);
    showToast(`Study ${trialId} status updated to ${newStatus}.`);
  };

  const updateTrialEnrollment = (trialId, increment = 1) => {
    const trial = trials.find((t) => t.id === trialId);
    if (!trial) return;
    const oldVal = trial.currentEnrollment;
    const newVal = oldVal + increment;
    setTrials((prev) => prev.map((t) => (t.id === trialId ? { ...t, currentEnrollment: newVal, lastUpdated: new Date().toISOString().split('T')[0] } : t)));
    recordAudit('Updated Enrollment Count', 'Clinical Trials', trialId, `${oldVal} enrolled`, `${newVal} enrolled`);
    showToast(`Enrollment for ${trialId} updated to ${newVal}.`);
  };

  const getTrialWithHealth = (trialId) => {
    const trial = trials.find((t) => t.id === trialId);
    if (!trial) return null;
    const computed = calculateTrialHealth(trial, { sites, alerts, deviations, queries, aeReports });
    return {
      ...trial,
      healthScore: computed.score,
      riskLevel: computed.riskTier === 'AT RISK' ? 'High' : computed.riskTier === 'MODERATE RISK' ? 'Medium' : 'Low',
      computedHealth: computed,
    };
  };

  const portfolioMetrics = useMemo(() => {
    const activeTrialsCount = trials.filter((t) => ['Active', 'Recruiting', 'Monitoring'].includes(t.status)).length;
    const totalEnrolled = trials.reduce((acc, t) => acc + (t.currentEnrollment || 0), 0);
    const totalTarget = trials.reduce((acc, t) => acc + (t.targetEnrollment || 0), 0);
    const overallEnrollmentRate = totalTarget > 0 ? Math.round((totalEnrolled / totalTarget) * 100) : 0;
    const atRiskCount = trials.filter((t) => t.riskLevel === 'High' || t.healthScore < 75).length;
    const openSafetyCount = aeReports.filter((a) =>
      a.safetyStatus !== 'Resolved' && (a.reviewStatus === 'Under Review' || a.safetyStatus === 'Open')
    ).length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineLimit = new Date(today);
    deadlineLimit.setDate(deadlineLimit.getDate() + 30);
    const upcomingDeadlinesCount = milestones.filter((milestone) => {
      if (milestone.status === 'Completed') return false;
      const dueDate = milestone.dueDate || milestone.due_date;
      if (!dueDate) return false;
      const due = new Date(`${dueDate.slice(0, 10)}T00:00:00`);
      return !Number.isNaN(due.getTime()) && due >= today && due <= deadlineLimit;
    }).length;

    return {
      activeTrials: activeTrialsCount,
      activeSites: sites.filter((site) => site.status === 'Active').length,
      totalParticipants: totalEnrolled,
      totalTarget,
      enrollmentRate: overallEnrollmentRate,
      trialsAtRisk: atRiskCount,
      openSafetyReports: openSafetyCount,
      upcomingDeadlines: upcomingDeadlinesCount,
    };
  }, [trials, sites, aeReports, milestones]);

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
        recordAudit,
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
