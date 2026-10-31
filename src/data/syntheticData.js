export const INITIAL_SERVICES = [
  {
    id: "srv-citizenship",
    code: "CIT-01",
    titleEn: "Citizenship Recommendation",
    titleNe: "नागरिकता प्रमाणपत्र सिफारिस",
    category: "Vital Records & ID",
    feeNpr: 100,
    processingDays: 2,
    department: "Ward Administration",
    descriptionEn: "Ward recommendation letter required by District Administration Office (DAO) to issue new citizenship certificate.",
    descriptionNe: "नयाँ नागरिकता प्रमाणपत्र प्राप्तिका लागि जिल्ला प्रशासन कार्यालयमा पेश गर्नुपर्ने वडा कार्यालयको सिफारिस पत्र।",
    requiredDocs: [
      "Father or Mother's Citizenship Copy (बुबा वा आमाको नागरिकताको प्रतिलिपि)",
      "Birth Certificate (जन्म दर्ता प्रमाणपत्र)",
      "Migration Certificate if applicable (बसाईसराई आएको भए सो को प्रमाणपत्र)",
      "Passport-size Photographs (पासपोर्ट साइजको फोटो)"
    ],
    sampleDocFields: ["Full Name", "Date of Birth", "Father's Name", "Citizenship No.", "Permanent Address"]
  },
  {
    id: "srv-residence",
    code: "RES-02",
    titleEn: "Residence Verification Certificate",
    titleNe: "बसोबास प्रमाणित सिफारिस",
    category: "Citizen Verification",
    feeNpr: 200,
    processingDays: 1,
    department: "Ward Administration",
    descriptionEn: "Official certification of permanent or temporary resident status in Ward 04 for visa, banking, or study.",
    descriptionNe: "बैंक, भिसा वा अध्ययनका प्रयोजनार्थ वडा नं. ४ मा स्थायी वा अस्थायी बसोबास प्रमाणित गर्ने पत्र।",
    requiredDocs: [
      "Land Ownership Certificate (Lalpurja) or House Rent Agreement (लालपुर्जा वा बहाल सम्झौता)",
      "Current Fiscal Year House/Land Tax Receipt (चालु आ.व. को सम्पत्ति कर रसिद)",
      "Applicant Citizenship Copy (निवेदकको नागरिकताको प्रतिलिपि)",
      "Electricity or Water Utility Bill (विद्युत वा खानेपानीको बिल)"
    ],
    sampleDocFields: ["Owner Name", "Plot / Kitta No.", "Ward Number", "Tax Year"]
  },
  {
    id: "srv-tax-clearance",
    code: "TAX-03",
    titleEn: "Ward Property & Business Tax Clearance",
    titleNe: "वडा कर चुक्ता प्रमाणपत्र",
    category: "Revenue & Finance",
    feeNpr: 500,
    processingDays: 1,
    department: "Revenue Department",
    descriptionEn: "Formal clearance certificate verifying that all municipal property and business taxes have been settled.",
    descriptionNe: "स्थानीय तहलाई बुझाउनुपर्ने घरजग्गा, सम्पत्ति तथा व्यवसाय कर पूर्ण भुक्तानी भएको प्रमाणित गर्ने पत्र।",
    requiredDocs: [
      "Latest Property Tax Payment Receipt (सम्पत्ति कर भुक्तानी रसिद)",
      "Citizenship Copy of Property Owner (जग्गाधनीको नागरिकता प्रतिलिपि)",
      "Previous Year Tax Clearance Copy (अघिल्लो वर्षको कर चुक्ताको प्रति)"
    ],
    sampleDocFields: ["Taxpayer ID", "Receipt Number", "Assessment Amount", "Payment Date"]
  },
  {
    id: "srv-birth-reg",
    code: "BRT-04",
    titleEn: "Birth Registration Recommendation",
    titleNe: "जन्म दर्ता सिफारिस",
    category: "Vital Records & ID",
    feeNpr: 0,
    processingDays: 1,
    department: "Civil Registration",
    descriptionEn: "Ward verification for registration of newborn child or delayed birth certificate.",
    descriptionNe: "नवजात शिशुको जन्म दर्ता तथा समयमा दर्ता हुन नसकेका व्यक्तिको जन्म प्रमाणित सिफारिस।",
    requiredDocs: [
      "Hospital Birth Certificate (अस्पतालको जन्म प्रमाणपत्र)",
      "Both Parents' Citizenship Copies (आमाबाबुको नागरिकताको प्रतिलिपि)",
      "Parents' Marriage Registration Certificate (विवाह दर्ता प्रमाणपत्र)"
    ],
    sampleDocFields: ["Child Name", "Date of Birth (B.S. / A.D.)", "Hospital Name", "Mother's Name", "Father's Name"]
  },
  {
    id: "srv-business-reg",
    code: "BIZ-05",
    titleEn: "Small Business & Trade Registration",
    titleNe: "व्यवसाय दर्ता तथा इजाजत पत्र",
    category: "Commerce & Trade",
    feeNpr: 1500,
    processingDays: 3,
    department: "Economic Development",
    descriptionEn: "Ward and municipal registration for local retail, enterprise, and service establishments.",
    descriptionNe: "वडा क्षेत्रभित्र सञ्चालन हुने पसल, व्यवसाय तथा फर्महरूको कानुनी दर्ता तथा सञ्चालन अनुमति।",
    requiredDocs: [
      "Rental Agreement or Land Deed of Business Premises (घर बहाल सम्झौता वा लालपुर्जा)",
      "Proprietor's Citizenship Copy (सञ्चालकको नागरिकता)",
      "PAN / VAT Registration Certificate (स्थायी लेखा नम्बर दर्ता)",
      "Passport Size Photos (२ प्रति फोटो)"
    ],
    sampleDocFields: ["Business Name", "Proprietor Name", "PAN Number", "Capital Amount", "Ward Location"]
  },
  {
    id: "srv-relationship",
    code: "REL-06",
    titleEn: "Relationship Verification (Naata Pramanit)",
    titleNe: "नाता प्रमाणित सिफारिस",
    category: "Citizen Verification",
    feeNpr: 300,
    processingDays: 2,
    department: "Ward Administration",
    descriptionEn: "Official government document certifying biological familial relationship between family members.",
    descriptionNe: "परिवारका सदस्यहरू बीचको पारिवारिक तथा जैविक नाता सम्बन्ध प्रमाणित गर्ने आधिकारिक सिफारिस।",
    requiredDocs: [
      "Citizenship Copies of all Family Members (सम्बन्धित सबैको नागरिकता प्रतिलिपि)",
      "Birth / Marriage Certificates (जन्म वा विवाह दर्ता)",
      "Family Photographs showing all members (पारिवारिक संयुक्त फोटो)",
      "Ward Resident Witness Declaration (वडाका सर्जमिन मुचुल्का)"
    ],
    sampleDocFields: ["Head of Family", "Members List", "Relation Types", "Ward Address"]
  }
];

export const INITIAL_APPLICATIONS = [
  {
    id: "app-001",
    trackingId: "JSN-KTM04-2026-004128",
    serviceId: "srv-citizenship",
    serviceTitleEn: "Citizenship Recommendation",
    serviceTitleNe: "नागरिकता प्रमाणपत्र सिफारिस",
    applicantName: "Aayush Shrestha",
    applicantNameNe: "आयुष श्रेष्ठ",
    phone: "9841234567",
    email: "aayush.shrestha@example.np",
    ward: "Ward 04, Kathmandu",
    submittedAt: "2026-10-29T10:30:00Z",
    status: "under_review",
    feePaid: true,
    feeAmount: 100,
    documents: [
      { name: "Father_Citizenship_Copy.pdf", type: "Parent Citizenship", size: "1.2 MB", verified: true },
      { name: "Hospital_Birth_Certificate.jpg", type: "Birth Certificate", size: "850 KB", verified: true },
      { name: "Passport_Photo_Aayush.png", type: "Photo", size: "320 KB", verified: true }
    ],
    aiFlags: {
      readabilityScore: 94,
      completeness: "100% Complete",
      extractedData: {
        fullName: "Aayush Shrestha",
        fatherName: "Bishnu Prasad Shrestha",
        citizenshipNoFather: "27-01-72-04912",
        dobBs: "2065/04/12",
        permanentAddress: "Kathmandu Metro Ward 04, Baluwatar"
      },
      flagNotes: "All 3 required documents verified. Names match perfectly across birth certificate and parent citizenship."
    },
    workflowHistory: [
      { step: "Application Submitted online by citizen", date: "2026-10-29 10:30", officer: "System Auto-Ingest" },
      { step: "Municipal AI Document Verification completed with 94% confidence", date: "2026-10-29 10:31", officer: "JanSewa Municipal AI Engine" },
      { step: "Assigned to Ward Secretary Sita Adhikari for administrative scrutiny", date: "2026-10-29 11:15", officer: "Ward 04 Desk" }
    ],
    officialRemarks: "Document checklist verified. Awaiting physical signature from Ward Chairperson."
  },
  {
    id: "app-002",
    trackingId: "JSN-KTM04-2026-004129",
    serviceId: "srv-residence",
    serviceTitleEn: "Residence Verification Certificate",
    serviceTitleNe: "बसोबास प्रमाणित सिफारिस",
    applicantName: "Sunita Tamang",
    applicantNameNe: "सुनिता तामाङ",
    phone: "9812987654",
    email: "sunita.tamang@example.np",
    ward: "Ward 04, Kathmandu",
    submittedAt: "2026-10-28T14:20:00Z",
    status: "approved",
    feePaid: true,
    feeAmount: 200,
    documents: [
      { name: "Lalpurja_Scan_Plot_452.pdf", type: "Land Ownership", size: "2.1 MB", verified: true },
      { name: "Property_Tax_Receipt_2081_82.pdf", type: "Tax Receipt", size: "620 KB", verified: true },
      { name: "Sunita_Citizenship.pdf", type: "Citizenship Copy", size: "900 KB", verified: true }
    ],
    aiFlags: {
      readabilityScore: 98,
      completeness: "100% Complete",
      extractedData: {
        fullName: "Sunita Tamang",
        plotNo: "452",
        wardNo: "4",
        taxYear: "2081/2082 B.S.",
        clearanceStatus: "PAID"
      },
      flagNotes: "All documents authentic and tax receipts up-to-date. Approved for official seal."
    },
    workflowHistory: [
      { step: "Application Submitted online", date: "2026-10-28 14:20", officer: "System" },
      { step: "AI extracted Plot 452 and confirmed current FY tax clearance", date: "2026-10-28 14:21", officer: "JanSewa Municipal AI Engine" },
      { step: "Document examined and approved by Ward Secretary", date: "2026-10-29 09:40", officer: "Sita Adhikari (Ward Secretary)" },
      { step: "Digital Certificate Issued with QR Code and Municipal Seal", date: "2026-10-29 10:05", officer: "KMC Ward 04 Digital Desk" }
    ],
    officialRemarks: "Approved. Certificate JSN-CERT-2026-8812 available for citizen download."
  },
  {
    id: "app-003",
    trackingId: "JSN-KTM04-2026-004130",
    serviceId: "srv-business-reg",
    serviceTitleEn: "Small Business & Trade Registration",
    serviceTitleNe: "व्यवसाय दर्ता तथा इजाजत पत्र",
    applicantName: "Bikash Thapa",
    applicantNameNe: "बिकेश थापा",
    phone: "9851098765",
    email: "himalayan.crafts@thapa.np",
    ward: "Ward 04, Kathmandu",
    submittedAt: "2026-10-30T09:15:00Z",
    status: "needs_info",
    feePaid: true,
    feeAmount: 1500,
    documents: [
      { name: "House_Rent_Agreement.pdf", type: "Rent Agreement", size: "1.4 MB", verified: true },
      { name: "Citizenship_Bikash.jpg", type: "Citizenship Copy", size: "480 KB", verified: true }
    ],
    aiFlags: {
      readabilityScore: 72,
      completeness: "Missing 1 Required Document",
      extractedData: {
        businessName: "Himalayan Herbal Crafts",
        proprietor: "Bikash Thapa",
        panNo: "NOT_FOUND"
      },
      flagNotes: "Missing Permanent Account Number (PAN) / VAT Certificate as mandated by KMC Trade By-laws."
    },
    workflowHistory: [
      { step: "Application Submitted", date: "2026-10-30 09:15", officer: "System" },
      { step: "AI Flagged: Missing PAN certificate", date: "2026-10-30 09:16", officer: "JanSewa Municipal AI Engine" },
      { step: "Returned to Applicant: Please upload PAN/VAT certificate issued by IRD", date: "2026-10-30 11:00", officer: "Ramesh Sharma (Assistant)" }
    ],
    officialRemarks: "Please upload your IRD PAN certificate to proceed with Trade License approval."
  },
  {
    id: "app-004",
    trackingId: "JSN-KTM04-2026-004131",
    serviceId: "srv-citizenship",
    serviceTitleEn: "Citizenship Recommendation (Special Referral)",
    serviceTitleNe: "नागरिकता सिफारिस (प्रजिअ समन्वय)",
    applicantName: "Pooja Gurung",
    applicantNameNe: "पुजा गुरुङ",
    phone: "9803124567",
    email: "pooja.g@example.np",
    ward: "Ward 04, Kathmandu",
    submittedAt: "2026-10-30T13:45:00Z",
    status: "referred",
    feePaid: true,
    feeAmount: 100,
    documents: [
      { name: "Mother_Citizenship_Only.pdf", type: "Mother Citizenship", size: "1.8 MB", verified: true },
      { name: "Birth_Certificate.pdf", type: "Birth Certificate", size: "750 KB", verified: true },
      { name: "Self_Declaration_Affidavit.pdf", type: "Affidavit", size: "520 KB", verified: true }
    ],
    aiFlags: {
      readabilityScore: 91,
      completeness: "Referral Flagged",
      extractedData: {
        fullName: "Pooja Gurung",
        motherName: "Maya Gurung",
        caseType: "Citizenship by descent through Mother (नेपाल नागरिकता ऐन दफा ८ ख)"
      },
      flagNotes: "Descent through single mother identified. Requires special verification memo to District Administration Office (DAO)."
    },
    workflowHistory: [
      { step: "Application Received", date: "2026-10-30 13:45", officer: "System" },
      { step: "AI identified descent verification protocol", date: "2026-10-30 13:46", officer: "JanSewa Municipal AI Engine" },
      { step: "Referred to DAO Kathmandu for CDO consultation", date: "2026-10-31 10:00", officer: "Ward 04 Chairperson" }
    ],
    officialRemarks: "Forwarded to District Administration Office (DAO Kathmandu) file ref DAO-CIT-2026-9021."
  }
];

export const INITIAL_COMPLAINTS = [
  {
    id: "cmp-001",
    trackingId: "CMP-KTM-2026-0091",
    title: "Severe Road Caving and Potholes near Baluwatar Chowk",
    titleNe: "बालुवाटार चोक नजिकै सडक भासिएको र ठूला खाल्डाखुल्डी",
    category: "Road & Infrastructure",
    categoryNe: "सडक तथा पूर्वाधार",
    ward: "Ward 04, Kathmandu",
    location: "Pavitra Marg, Baluwatar near Russian Embassy turning",
    reportedAt: "2026-10-27T08:30:00Z",
    status: "in_progress",
    priority: "High",
    aiAnalysis: {
      confidence: 0.96,
      suggestedDepartment: "KMC Infrastructure & Road Maintenance Division",
      detectedUrgency: "High (Traffic hazard & pedestrian safety risk)",
      keywords: ["road cave-in", "potholes", "Baluwatar", "traffic hazard"]
    },
    citizenName: "Prabin Maharjan",
    resolutionNotes: "Inspection team dispatched; asphalt patch repair scheduled for 2026-11-02."
  },
  {
    id: "cmp-002",
    trackingId: "CMP-KTM-2026-0092",
    title: "Drinking Water Main Pipeline Burst - Severe Flooding",
    titleNe: "खानेपानीको मुख्य पाइप फुटि सडक जलमग्न",
    category: "Drinking Water & Sewage",
    categoryNe: "खानेपानी तथा ढल निकास",
    ward: "Ward 04, Kathmandu",
    location: "Opposite Bhatbhateni Supermarket, Ward 04",
    reportedAt: "2026-10-30T07:15:00Z",
    status: "urgent",
    priority: "Emergency",
    aiAnalysis: {
      confidence: 0.98,
      suggestedDepartment: "Kathmandu Upatyaka Khanepani Limited (KUKL) Branch 2",
      detectedUrgency: "Emergency (Severe clean water wastage & roadway erosion)",
      keywords: ["main pipeline burst", "KUKL line", "road flooding", "urgent cutoff needed"]
    },
    citizenName: "Deepak Basnet",
    resolutionNotes: "KUKL emergency maintenance unit notified. Valve shutoff in progress."
  },
  {
    id: "cmp-003",
    trackingId: "CMP-KTM-2026-0093",
    title: "Uncollected Solid Waste Accumulation for 6 Days",
    titleNe: "६ दिनदेखि फोहर संकलन नभई दुर्गन्ध फैलिएको",
    category: "Sanitation & Waste",
    categoryNe: "सरसफाइ तथा फोहर व्यवस्थापन",
    ward: "Ward 04, Kathmandu",
    location: "Bhadrakali Tole, Ward 04",
    reportedAt: "2026-10-29T16:00:00Z",
    status: "resolved",
    priority: "Medium",
    aiAnalysis: {
      confidence: 0.93,
      suggestedDepartment: "KMC Environment Management Department",
      detectedUrgency: "Medium (Health & hygiene concern)",
      keywords: ["waste accumulation", "compactor delay", "hygiene risk"]
    },
    citizenName: "Sarita Rijal",
    resolutionNotes: "Special compactor vehicle sent on Oct 30 18:00; area cleared and disinfected with lime."
  }
];

export const INITIAL_NOTICES = [
  {
    id: "not-01",
    titleEn: "Annual Ward General Assembly & Public Hearing for Fiscal Year 2083/84",
    titleNe: "आर्थिक वर्ष २०८३/८४ को वार्षिक वडा भेला तथा सार्वजनिक सुनुवाइ सम्बन्धी सूचना",
    date: "2026-10-28",
    issuedBy: "Ward 04 Office, Kathmandu Metropolitan City",
    category: "Public Hearing",
    contentEn: "All residents, civil society members, and business owners of Ward 04 are cordially invited to attend the annual public review meeting at Ward Community Hall on Kartik 20.",
    contentNe: "वडा नं. ४ का सम्पूर्ण आदरणीय दाजुभाइ, दिदीबहिनी तथा सरोकारवालाहरूलाई वडा कार्यालयको वार्षिक योजना समीक्षा तथा सार्वजनिक सुनुवाइमा उपस्थितिको लागि हार्दिक अनुरोध गरिन्छ।"
  },
  {
    id: "not-02",
    titleEn: "Free Health Camp: Senior Citizens Blood Pressure & Diabetes Screening",
    titleNe: "ज्येष्ठ नागरिक निःशुल्क स्वास्थ्य शिविर: रक्तचाप तथा मधुमेह परीक्षण",
    date: "2026-10-25",
    issuedBy: "KMC Urban Health Clinic Ward 04",
    category: "Health & Wellness",
    contentEn: "Free medical screening, basic medicine distribution, and wellness counsel for residents aged 60 and above every Sunday morning.",
    contentNe: "६० वर्ष माथिका ज्येष्ठ नागरिकहरूका लागि निःशुल्क स्वास्थ्य परीक्षण तथा आवश्यक औषधी वितरण कार्यक्रम।"
  },
  {
    id: "not-03",
    titleEn: "Property Tax Rebate 10% Discount deadline notice",
    titleNe: "सम्पत्ति करमा १०% छुट सुविधा प्राप्त गर्ने अन्तिम म्याद सम्बन्धी जरुरी सूचना",
    date: "2026-10-20",
    issuedBy: "KMC Revenue Department",
    category: "Revenue & Finance",
    contentEn: "Citizens paying property tax for the current fiscal year before Kartik end are entitled to a 10% concession.",
    contentNe: "चालु आर्थिक वर्षको सम्पत्ति तथा घरजग्गा कर कात्तिक मसान्तभित्र बुझाएमा १०% विशेष छुट प्राप्त हुनेछ।"
  }
];

export const MUNICIPAL_PROJECTS = [
  {
    id: "prj-01",
    nameEn: "Baluwatar Deep Drainage & Stormwater Upgrade",
    nameNe: "बालुवाटार ढल तथा वर्षातको पानी निकास स्तरोन्नति",
    ward: "Ward 04",
    budgetNpr: 18500000,
    spentNpr: 13200000,
    progressPercent: 71,
    status: "On Track",
    contractor: "Shankar - Kalika JV",
    completionTarget: "2026-12-30"
  },
  {
    id: "prj-02",
    nameEn: "Ward 04 Smart Solar Streetlighting & CCTV Grid",
    nameNe: "वडा नं. ४ स्मार्ट सडक सौर्य बत्ती तथा सीसीटीभी जडान",
    ward: "Ward 04",
    budgetNpr: 7500000,
    spentNpr: 7100000,
    progressPercent: 95,
    status: "Near Completion",
    contractor: "Nepal Solar Tech Ltd",
    completionTarget: "2026-11-15"
  },
  {
    id: "prj-03",
    nameEn: "Community Wellness Park & Senior Citizen Pavilion",
    nameNe: "सामुदायिक शान्ति पार्क तथा ज्येष्ठ नागरिक विश्राम स्थल",
    ward: "Ward 04",
    budgetNpr: 12000000,
    spentNpr: 4500000,
    progressPercent: 38,
    status: "Under Construction",
    contractor: "Himalayan Builders Pvt Ltd",
    completionTarget: "2027-03-31"
  }
];

export const MONTHLY_METRICS = [
  { month: "Jan", actualRequests: 120, aiProcessed: 110, completed: 115, forecast: 125 },
  { month: "Feb", actualRequests: 155, aiProcessed: 148, completed: 149, forecast: 150 },
  { month: "Mar", actualRequests: 138, aiProcessed: 132, completed: 134, forecast: 140 },
  { month: "Apr", actualRequests: 190, aiProcessed: 182, completed: 178, forecast: 185 },
  { month: "May", actualRequests: 174, aiProcessed: 170, completed: 171, forecast: 175 },
  { month: "Jun", actualRequests: 220, aiProcessed: 215, completed: 212, forecast: 210 },
  { month: "Jul", actualRequests: 245, aiProcessed: 240, completed: 236, forecast: 240 },
  { month: "Aug", actualRequests: 210, aiProcessed: 205, completed: 204, forecast: 215 },
  { month: "Sep", actualRequests: 280, aiProcessed: 272, completed: 265, forecast: 275 },
  { month: "Oct", actualRequests: 310, aiProcessed: 302, completed: 298, forecast: 300 },
  { month: "Nov (Proj)", actualRequests: null, aiProcessed: null, completed: null, forecast: 340 },
  { month: "Dec (Proj)", actualRequests: null, aiProcessed: null, completed: null, forecast: 365 }
];
