# JanSewa AI Nepal (जनसेवा एआई नेपाल)
### Integrated Digital Governance & Public Service Intelligence Platform

A minimal, soulful, production-grade digital governance software product designed with **Neumorphism (Soft UI)**, built for citizen public services, municipal ward offices, and district administration coordination across Nepal.

---

## 🎨 Design Philosophy — Minimal, Soulful Neumorphism (Soft UI)

The visual design delivers a calm, tactile experience with subtle depth, generous whitespace, and soft pastel accents:

* **Base Background**: `#E8E8E8`
* **Highlight**: `#FFFFFF`
* **Shadow**: `#D0D0D0`
* **Soft Blue**: `#C8E0F4` (Informational surfaces, subtle badges)
* **Soft Pink**: `#F5E0E8` (Grievance priorities, attention states)
* **Soft Sage**: `#D6EAD8` (Verified & completed status)
* **Primary Accent**: `#7B68EE` (Action elements, primary focus)
* **Heading**: `#3F3F46` (High contrast, elegant hierarchy)
* **Body Text**: `#52525B` (Optimized line height and readability)

### Shadow System Tokens
* **Raised surface**: `box-shadow: -10px -10px 30px #FFFFFF, 10px 10px 30px #D0D0D0;`
* **Inset surface**: `box-shadow: inset -5px -5px 15px #FFFFFF, inset 5px 5px 15px #D0D0D0;`
* **Raised button**: `box-shadow: -5px -5px 15px #FFFFFF, 5px 5px 15px #D0D0D0;`
* **Pressed button**: `box-shadow: inset -3px -3px 8px #FFFFFF, inset 3px 3px 8px #D0D0D0;`
* **Transitions**: Smooth 150ms transitions (`transition: all 150ms ease;`)

---

## 🏛️ Application Architecture & Portals

1. **👨‍💼 Citizen Portal (नागरिक सेवा)**:
   * **Service Catalogue**: Detailed requirements, statutory fees in NPR, and estimated completion times (*Citizenship Recommendation*, *Residence Verification*, *Birth Registration*, *Trade License*, *Tax Clearance*).
   * **Application Wizard**: Step-by-step form with debossed document upload dropzone, sample document quick-loaders, and real-time AI document pre-check.
   * **Live Application Tracker**: Full visual lifecycle pipeline (`Submitted` ➔ `Under Review` ➔ `Verification` ➔ `Decision Recorded` ➔ `Certificate Issued`) with audit trail.
   * **Public Grievance Lodging**: Citizen issue reporting with automated NLP departmental triage.
   * **Ward Notices Bulletin Board**: Municipal announcements in Nepali and English.

2. **📋 Staff & Officer Work Queue (कर्मचारी कार्यतालिका)**:
   * Ward 04 work dashboard with category filters (*All*, *Pending Review*, *Needs Info*, *Referred*, *Approved*).
   * **Side-by-Side Review Drawer**: Inspects citizen documents alongside automated OCR extracted candidate fields, completeness match %, and discrepancy flags.
   * Decision recording: *Approve & Issue Certificate*, *Request Corrections*, *Refer to DAO / CDO*, or *Reject with Legal Grounds*.

3. **🏛️ DAO / CDO Coordination Desk (प्रमुख जिल्ला अधिकारी / जि.प्र.का. समन्वय)**:
   * District Administration Office workflow handling escalated citizenship referrals, inter-agency endorsements, and urgent public emergency grievances.

4. **📊 Intelligence & Executive Analytics Dashboard (डेटा साइन्स ड्यासबोर्ड)**:
   * Municipal KPIs: Total applications received, compliance rate, pending workload, median processing time, and complaint resolution rate.
   * **Live Environmental Intelligence**: Integrated with Open-Meteo public stations for Kathmandu (Temperature, Humidity, Precipitation risk, and Air Quality Index AQI / PM2.5).
   * Monthly trend charts comparing recorded applications vs. AI forecasted workload.
   * Ward performance and backlog comparison across Kathmandu Metropolitan City wards.
   * Local infrastructure project tracker with approved budgets, disbursements, and physical progress percentages.

5. **💬 JanSewa Sathi (जनसेवा साथी - Digital Assistant)**:
   * Conversational assistant grounded in the *Local Government Operation Act 2074 (स्थानीय सरकार सञ्चालन ऐन, २०७४)* and Nepal citizenship regulations.
   * Multi-lingual capability: Fluent in English, Devanagari Nepali (नेपाली), and Romanized Nepali (*"Nagarikta lina k k kagajat chahincha?"*).

---

## 🌐 Public APIs & Datasets Integrated

1. **Open-Meteo Free Public Weather & Forecast API**:
   * Endpoint: `https://api.open-meteo.com/v1/forecast`
   * Coordinates: Lat 27.7172° N, Long 85.3240° E (Kathmandu Station)
   * Free public API without authentication. Used by the municipal dashboard for monsoon drainage preparedness and road paving safety alerts.
2. **Open-Meteo Air Quality API**:
   * Endpoint: `https://air-quality-api.open-meteo.com/v1/air-quality`
   * Live European AQI, PM2.5, and PM10 values informing Kathmandu Metropolitan City environmental actions.
3. **Municipal Public AI Engine**:
   * Multimodal document OCR, grounded administrative assistant, smart complaint classification, and predictive workload forecasting.

---

## 🚀 Setup & Local Execution

### Prerequisites
* Node.js 18+ (tested on Node v24)
* npm 9+

### 1. Installation
```bash
git clone <repo-url>
cd AI
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### 4. Run Automated Test Suite
```bash
npm run test
```
Executes all unit and integration tests via Vitest.

### 5. Production Build
```bash
npm run build
npm run preview
```
Generates an optimized, tree-shaken static production bundle in `dist/`.

---

## 🔒 Security & Privacy Guarantees

* **Zero Hardcoded Secrets**: Secrets are kept in `.env` (ignored by `.gitignore`) or user browser storage.
* **Input Sanitization**: Form inputs and file uploads enforce strict type, size, and character sanitization.
* **Data Minimization**: Document metadata is reviewed alongside files without storing raw sensitive credentials in public bundles.
* **Assistive AI Boundary**: AI outputs are strictly assistive recommendations requiring authorized human verification before legal certificates are sealed.

---

## 📜 License
Official Public Service & Digital Governance Platform for Nepal Municipalities.
