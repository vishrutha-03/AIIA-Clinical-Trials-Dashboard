// AIIA CTMS - CDISC & HL7 FHIR R4 Interoperability Service
// Provides standards-compliant mock exports for Regulatory Submissions (CDISC SDTM, ADaM, Define-XML)
// and Healthcare Interoperability (HL7 FHIR R4 ResearchStudy, ResearchSubject, AdverseEvent)

export function generateFhirR4Bundle(trial, participants = [], aeReports = []) {
  const trialId = trial?.id || 'AYU-2026-004';
  
  return {
    resourceType: 'Bundle',
    id: `bundle-aiia-${trialId.toLowerCase()}`,
    meta: {
      lastUpdated: new Date().toISOString(),
      profile: ['http://hl7.org/fhir/StructureDefinition/Bundle']
    },
    type: 'collection',
    total: 1 + participants.length + aeReports.length,
    entry: [
      {
        fullUrl: `urn:uuid:study-${trialId}`,
        resource: {
          resourceType: 'ResearchStudy',
          id: trialId,
          identifier: [
            {
              system: 'https://ctri.nic.in',
              value: trial?.ctriNumber || 'CTRI/2026/01/051284'
            },
            {
              system: 'https://aiia.gov.in/ctms/study-id',
              value: trialId
            }
          ],
          title: trial?.title,
          status: trial?.status?.toLowerCase() === 'active' ? 'active' : 'completed',
          phase: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/research-study-phase',
                code: 'phase-3',
                display: trial?.phase || 'Phase III'
              }
            ]
          },
          category: [
            {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '386053000',
                  display: 'Ayurvedic Medicine / ASU&H Interventional Trial'
                }
              ]
            }
          ],
          principalInvestigator: {
            display: trial?.piName || 'Dr. Anand Kumar Varma'
          },
          sponsor: {
            display: 'All India Institute of Ayurveda (AIIA), Ministry of Ayush'
          },
          enrollment: [
            {
              display: `Target: ${trial?.targetEnrollment}, Actual: ${trial?.currentEnrollment}`
            }
          ]
        }
      },
      ...participants.slice(0, 5).map(p => ({
        fullUrl: `urn:uuid:subject-${p.id}`,
        resource: {
          resourceType: 'ResearchSubject',
          id: p.id,
          identifier: [
            {
              system: 'https://aiia.gov.in/ctms/participant-id',
              value: p.id
            }
          ],
          status: p.enrollmentStatus === 'Active' ? 'active' : 'candidate',
          study: {
            reference: `ResearchStudy/${trialId}`,
            display: trial?.shortTitle
          },
          individual: {
            reference: `Patient/MOCK-PATIENT-${p.id}`,
            display: `De-identified Subject (Age ${p.age}, Gender: ${p.gender})`
          },
          assignedArm: p.randomizedArm
        }
      })),
      ...aeReports.slice(0, 3).map(ae => ({
        fullUrl: `urn:uuid:adverse-event-${ae.id}`,
        resource: {
          resourceType: 'AdverseEvent',
          id: ae.id,
          actuality: 'actual',
          category: [
            {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/adverse-event-category',
                  code: ae.seriousness?.startsWith('Yes') ? 'serious-adverse-event' : 'adverse-event'
                }
              ]
            }
          ],
          event: {
            coding: [
              {
                system: 'http://www.meddra.org',
                code: ae.meddraTerm?.match(/\d+/)?.[0] || '10020993',
                display: ae.meddraTerm || ae.adverseEvent
              }
            ],
            text: ae.adverseEvent
          },
          subject: {
            reference: `ResearchSubject/${ae.participantId}`
          },
          date: ae.onsetDate,
          seriousness: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/adverse-event-seriousness',
                code: ae.seriousness?.startsWith('Yes') ? 'Serious' : 'Non-serious'
              }
            ]
          },
          severity: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/adverse-event-severity',
                code: ae.severity?.toLowerCase()
              }
            ]
          },
          causality: [
            {
              assessment: {
                text: ae.causality
              },
              productRelatedness: ae.whodrugCode
            }
          ]
        }
      }))
    ]
  };
}

export function generateSdtmDataset(trial, participants = [], aeReports = []) {
  // CDISC SDTM DM (Demographics), AE (Adverse Events), DS (Disposition)
  const dmRecords = participants.map((p, idx) => ({
    STUDYID: trial?.id || 'AYU-2026-004',
    DOMAIN: 'DM',
    USUBJID: `${trial?.id || 'AYU-2026-004'}-${p.siteId}-${p.id}`,
    SUBJID: p.id,
    RFSTDTC: p.randomizationDate || '2026-01-20',
    RFXSTDTC: p.randomizationDate || '2026-01-20',
    SITEID: p.siteId,
    AGE: p.age,
    AGEU: 'YEARS',
    SEX: p.gender === 'Male' ? 'M' : 'F',
    RACE: 'ASIAN (INDIAN SUB-CONTINENT)',
    ARM: p.randomizedArm.includes('Arm A') ? 'AYURVEDIC_FORMULATION_X' : 'ACTIVE_COMPARATOR_METFORMIN',
    ACTARM: p.randomizedArm.includes('Arm A') ? 'AYURVEDIC_FORMULATION_X' : 'ACTIVE_COMPARATOR_METFORMIN',
    COUNTRY: 'IND'
  }));

  const aeRecords = aeReports.map((ae, idx) => ({
    STUDYID: trial?.id || 'AYU-2026-004',
    DOMAIN: 'AE',
    USUBJID: `${trial?.id || 'AYU-2026-004'}-${ae.siteId}-${ae.participantId}`,
    AESEQ: idx + 1,
    AETERM: ae.adverseEvent,
    AEDECOD: ae.meddraTerm?.split(' (PT')[0] || ae.adverseEvent,
    AEBODSYS: ae.meddraSoc || 'General disorders',
    AESEV: ae.severity?.toUpperCase() || 'MILD',
    AESER: ae.seriousness?.startsWith('Yes') ? 'Y' : 'N',
    AEREL: ae.causality?.toUpperCase() || 'POSSIBLE',
    AESTDTC: ae.onsetDate,
    AEOUT: ae.outcome?.toUpperCase() || 'RECOVERED'
  }));

  return {
    meta: {
      standard: 'CDISC SDTM v3.3 / SDTMIG v3.3',
      trialId: trial?.id || 'AYU-2026-004',
      generatedDate: new Date().toISOString(),
      institution: 'All India Institute of Ayurveda'
    },
    domains: {
      DM: dmRecords,
      AE: aeRecords
    }
  };
}

export function generateAdamDataset(trial, participants = []) {
  // CDISC ADaM ADSL (Subject Level Analysis Dataset)
  const adslRecords = participants.map((p, idx) => ({
    STUDYID: trial?.id || 'AYU-2026-004',
    USUBJID: `${trial?.id || 'AYU-2026-004'}-${p.siteId}-${p.id}`,
    SUBJID: p.id,
    SITEID: p.siteId,
    TRT01P: p.randomizedArm.includes('Arm A') ? 'Ayurvedic Formulation X' : 'Metformin Standard Care',
    TRT01A: p.randomizedArm.includes('Arm A') ? 'Ayurvedic Formulation X' : 'Metformin Standard Care',
    AGE: p.age,
    AGEGR1: p.age < 50 ? '< 50 yrs' : '>= 50 yrs',
    SEX: p.gender === 'Male' ? 'M' : 'F',
    SAFFL: 'Y',
    ITTFL: 'Y',
    COMPLFL: p.enrollmentStatus === 'Active' ? 'Y' : 'N',
    BASE_HBA1C: p.hbA1cBaseline || 8.4,
    WEEK24_HBA1C: p.hbA1cLatest || 7.2,
    CHG_HBA1C: Number(((p.hbA1cLatest || 7.2) - (p.hbA1cBaseline || 8.4)).toFixed(2))
  }));

  return {
    meta: {
      standard: 'CDISC ADaM v2.1 / ADSL Implementation Guide',
      datasetName: 'ADSL',
      trialId: trial?.id || 'AYU-2026-004',
      generatedDate: new Date().toISOString()
    },
    data: adslRecords
  };
}

export function generateDefineXml(trial) {
  const trialId = trial?.id || 'AYU-2026-004';
  return `<?xml version="1.0" encoding="UTF-8"?>
<ODM xmlns="http://www.cdisc.org/ns/odm/v1.3"
     xmlns:def="http://www.cdisc.org/ns/def/v2.1"
     CreationDateTime="${new Date().toISOString()}"
     FileOID="DEFINE_XML_${trialId}"
     ODMVersion="1.3.2">
  <Study OID="STUDY_${trialId}">
    <GlobalVariables>
      <StudyName>${trial?.title || 'AIIA Ayurvedic Clinical Study'}</StudyName>
      <StudyDescription>Standardized ASU&H CDISC Submission Package</StudyDescription>
      <ProtocolName>${trialId}</ProtocolName>
    </GlobalVariables>
    <MetaDataVersion OID="MDV.SDTM.3.3" Name="SDTM 3.3 Study Metadata Definition">
      <def:Standards>
        <def:Standard OID="STD.SDTM" Name="SDTMIG" Version="3.3" Status="Final" Type="IG"/>
      </def:Standards>
      <ItemGroupDef OID="IG.DM" Name="DM" Repeating="No" IsReferenceData="No" SASDatasetName="DM" Domain="DM" Purpose="Tabulation">
        <Description><TranslatedText xml:lang="en">Demographics Domain</TranslatedText></Description>
        <ItemRef ItemOID="IT.STUDYID" Mandatory="Yes" OrderNumber="1"/>
        <ItemRef ItemOID="IT.DOMAIN" Mandatory="Yes" OrderNumber="2"/>
        <ItemRef ItemOID="IT.USUBJID" Mandatory="Yes" OrderNumber="3"/>
        <ItemRef ItemOID="IT.SUBJID" Mandatory="Yes" OrderNumber="4"/>
        <ItemRef ItemOID="IT.RFSTDTC" Mandatory="Yes" OrderNumber="5"/>
        <ItemRef ItemOID="IT.AGE" Mandatory="Yes" OrderNumber="6"/>
        <ItemRef ItemOID="IT.SEX" Mandatory="Yes" OrderNumber="7"/>
        <ItemRef ItemOID="IT.ARM" Mandatory="Yes" OrderNumber="8"/>
      </ItemGroupDef>
      <ItemGroupDef OID="IG.AE" Name="AE" Repeating="Yes" IsReferenceData="No" SASDatasetName="AE" Domain="AE" Purpose="Tabulation">
        <Description><TranslatedText xml:lang="en">Adverse Events Domain (ASU&amp;H MedDRA/WHODrug Coded)</TranslatedText></Description>
        <ItemRef ItemOID="IT.STUDYID" Mandatory="Yes" OrderNumber="1"/>
        <ItemRef ItemOID="IT.DOMAIN" Mandatory="Yes" OrderNumber="2"/>
        <ItemRef ItemOID="IT.USUBJID" Mandatory="Yes" OrderNumber="3"/>
        <ItemRef ItemOID="IT.AETERM" Mandatory="Yes" OrderNumber="4"/>
        <ItemRef ItemOID="IT.AEDECOD" Mandatory="Yes" OrderNumber="5"/>
        <ItemRef ItemOID="IT.AESEV" Mandatory="Yes" OrderNumber="6"/>
        <ItemRef ItemOID="IT.AESER" Mandatory="Yes" OrderNumber="7"/>
      </ItemGroupDef>
    </MetaDataVersion>
  </Study>
</ODM>`;
}

// Download helper function for client browser
export function triggerDownload(content, filename, contentType = 'application/json') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
