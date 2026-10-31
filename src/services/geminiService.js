import { GoogleGenerativeAI } from "@google/generative-ai";

// Government service knowledge base for RAG grounding
const NEPAL_GOV_KNOWLEDGE_BASE = `
You are JanSewa Sathi (जनसेवा साथी), an official assistive AI service agent for the JanSewa AI Nepal platform.
Your duty is to assist citizens, municipal staff, and ward officers navigating Nepal local government services (वडा कार्यालय, नगरपालिका, र जिल्ला प्रशासन कार्यालय).
Ground all answers strictly in prevailing Nepal Laws:
- Local Government Operation Act 2074 (स्थानीय सरकार सञ्चालन ऐन, २०७४)
- Public Road Act 2031 (सार्वजनिक सडक ऐन, २०३१)
- Nepal Citizenship Act 2063 & Regulations (नेपाल नागरिकता ऐन, २०६३)
- Individual Event Registration Act 2033 (व्यक्तिगत घटना दर्ता ऐन, २०३३)
- Kathmandu Metropolitan City Building By-laws & Municipal Revenue Act 2080

Key Statutory Rules & Legal Frameworks:
1. Nepal Road Laws & Public Roads (सडक सम्बन्धी नेपाल कानून):
   - Public Road Act 2031 (सार्वजनिक सडक ऐन, २०३१):
     * Defines public road classifications: National Highways (राष्ट्रिय राजमार्ग), Feeder Roads (सहायक मार्ग), District Roads, and Urban/Municipal Roads.
     * Road Right-of-Way (RoW / सडक सीमा): Prohibits encroachment, permanent construction, or unauthorized excavation within road boundaries.
     * Department of Roads (सडक विभाग - DoR) manages national highways and strategic roads.
     * Road Digging / Cutting Permission (सडक खन्ने अनुमति): Mandatory prior permit from road authority (KMC Infrastructure Division / DoR) with reinstatement guarantee fees before laying water pipelines, sewage, or telecom cables.
   - Local Government Operation Act 2074 (स्थानीय सरकार सञ्चालन ऐन, २०७४) Sec 11 & 12:
     * Municipalities and Ward Committees have sole authority (एकल अधिकार) over local municipal roads (नगर/गाउँस्तरीय सडक), ward access roads, rural roads, and agricultural roads (कृषि सडक).
     * Ward Committee Responsibilities: Road maintenance, pothole repairs, street drainage, public footpath encroachment clearance, and streetlight maintenance.
   - Public Grievances on Roads: Potholes, road collapses, or drainage overflow can be lodged via JanSewa 'Lodge Complaint' or KMC Call Center 1180.

2. Citizenship Recommendation (नागरिकता प्रमाणपत्र सिफारिस):
   - Authority: Ward Office recommendation -> District Administration Office (DAO / जिल्ला प्रशासन कार्यालय) issuance.
   - Types: By Descent (वंशज), Matrimonial Naturalization (वैवाहिक अंगीकृत), and Non-Resident Nepali (गैर-आवासीय नेपाली नागरिकता - NRN).
   - Requirements: Parents' citizenship copies, verified birth registration certificate (जन्मदर्ता), 3 passport photos, physical presence of father/mother or verified guardian for identification (सनाखत).
   - Fee: NPR 100 at Ward Office. Turnaround: 1-2 working days.

3. Residence Verification (बसोबास प्रमाणित सिफारिस):
   - Permanent Residence: Land ownership deed (लालपुर्जा), current fiscal year property tax receipt (चालु आ.व. को सम्पत्ति कर चुक्ता), citizenship copy, utility bill.
   - Temporary / Tenant Residence: 1-year registered rent agreement (बहाल सम्झौता), house owner's citizenship and Lalpurja copy, applicant citizenship.
   - Fee: NPR 200. Turnaround: Same day or 1 working day.

4. Vital Event Registrations (व्यक्तिगत घटना दर्ता):
   - Birth (जन्म), Death (मृत्यु), Marriage (विवाह), Migration (बसाइँसराइ), Divorce (सम्बन्ध विच्छेद).
   - Statutory Period: FREE (निःशुल्क) if registered within 35 days of the event under Vital Event Registration Act 2033. Nominal late fine applies after 35 days.

5. Building Permit & Map Approval (नक्सा पास):
   - Regulated by Local Government Operation Act 2074 Sec 27-45 and KMC Building By-laws.
   - 5-Stage Process: Application with Lalpurja & blueprint by registered civil engineer -> 15-day neighbor notice (सन्धिसर्पन सूचना) -> Temporary Plinth-level permit -> Structural super-structure check -> Final Building Completion Certificate (निर्माण सम्पन्न प्रमाणपत्र).

6. Municipal Taxes & Trade Licenses:
   - House Rent Tax (घरबहाल कर): 10% strictly payable to the Local Ward / Municipality under KMC Revenue Act 2080.
   - Small Business Registration (व्यवसाय दर्ता): NPR 1,500 - 5,000 depending on capital; requires rental agreement, PAN, and proprietor citizenship.

7. Judicial Committee & Ward Mediation (न्यायिक समिति):
   - Headed by Deputy Mayor / Vice-Chairperson under Local Government Operation Act 2074 Chapter 8.
   - Handles boundary disputes, tenant issues, family partition, and community harmony via court-annexed mediation.

Response Guidelines:
- Respond in the language of the query (Nepali Devanagari, English, or Romanized Nepali).
- Cite specific acts, statutory sections, fees, required documents, and government offices.
- Provide structured markdown lists and clear headings.
- Maintain a warm, respectful, and authoritative tone (e.g., "नमस्ते!" or "Namaste").
`;

// Candidate models in preference order (gemini-2.5-flash is active for this workspace key)
const CANDIDATE_MODELS = [
  "gemini-2.5-flash",
  "gemini-1.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-pro",
  "gemini-pro"
];

let cachedWorkingModel = "gemini-2.5-flash";

/**
 * Robust caller that tries candidate models if a 404 / unsupported model error occurs
 */
async function callGeminiWithFallback(apiKey, runner) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const modelsToTry = [
    cachedWorkingModel,
    ...CANDIDATE_MODELS.filter((m) => m !== cachedWorkingModel)
  ];

  let lastErr = null;
  for (const modelName of modelsToTry) {
    try {
      const res = await runner(genAI, modelName);
      cachedWorkingModel = modelName;
      return res;
    } catch (err) {
      lastErr = err;
      const msg = (err?.message || "").toLowerCase();
      const isModelMissing =
        msg.includes("404") ||
        msg.includes("not found") ||
        msg.includes("no longer available") ||
        msg.includes("is not supported") ||
        msg.includes("update your code");

      if (!isModelMissing) {
        // Quota, auth, or safety block — do not cycle model names
        throw err;
      }
      console.warn(`[GeminiService] Model ${modelName} unavailable. Trying next candidate...`);
    }
  }
  throw lastErr;
}

export function getStoredGeminiKey() {
  const localKey = typeof localStorage !== "undefined" ? localStorage.getItem("jansewa_gemini_api_key") : null;
  const viteKey = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_GEMINI_API_KEY : null;
  const procKey = typeof process !== "undefined" && process.env ? (process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API) : null;
  return (localKey || viteKey || procKey || "").trim();
}

export function setStoredGeminiKey(key) {
  if (key) {
    localStorage.setItem("jansewa_gemini_api_key", key.trim());
  } else {
    localStorage.removeItem("jansewa_gemini_api_key");
  }
}

/**
 * 1. AI Document Intelligence (OCR, Checklist Verification & Field Extraction)
 */
export async function analyzeDocumentWithGemini(fileData, serviceContext) {
  const apiKey = getStoredGeminiKey();

  if (!apiKey) {
    return simulateDocumentAnalysis(fileData, serviceContext);
  }

  try {
    return await callGeminiWithFallback(apiKey, async (genAI, modelName) => {
      const model = genAI.getGenerativeModel({ model: modelName });

      const prompt = `
Analyze this submitted document for Nepal Municipal Public Service: "${serviceContext?.titleEn || 'Public Service'}".
Required documents for this service are:
${serviceContext?.requiredDocs?.join("\n") || "Standard Government Identification"}

Your task:
1. Identify the document type (e.g. Nepali Citizenship card, Lalpurja, Birth Certificate, Tax receipt, Rent deed).
2. Assess document scan readability quality (0 to 100%).
3. Extract relevant candidate metadata fields (Full Name in English & Nepali if visible, Document Reference Number, Date of Birth / Registration Date, Father/Spouse name, Address/Ward).
4. Verify whether it satisfies requirements or if anything is missing or flagged.

Return ONLY a strict JSON object with this schema:
{
  "documentType": string,
  "readabilityScore": number,
  "isAcceptableQuality": boolean,
  "completeness": string,
  "extractedData": {
    "fullName": string,
    "docNumber": string,
    "issueDate": string,
    "address": string,
    "relationOrOwner": string
  },
  "flags": [string],
  "checklistNotes": string
}
`;

      let result;
      if (fileData.base64 && fileData.mimeType) {
        const imagePart = {
          inlineData: {
            data: fileData.base64.split(",")[1] || fileData.base64,
            mimeType: fileData.mimeType
          }
        };
        result = await model.generateContent([prompt, imagePart]);
      } else {
        result = await model.generateContent(`${prompt}\n\nDocument details:\nFile name: ${fileData.name}\nType: ${fileData.type}`);
      }

      const text = result.response.text();
      const cleanedJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleanedJson);
    });
  } catch (err) {
    console.warn("Gemini Live Document Analysis fallback to simulated engine:", err);
    return simulateDocumentAnalysis(fileData, serviceContext, err.message);
  }
}

function simulateDocumentAnalysis(fileData, serviceContext, errMsg = null) {
  const fileName = (fileData?.name || "").toLowerCase();
  const isBirth = fileName.includes("birth") || fileName.includes("hospital");
  const isLalpurja = fileName.includes("lalpurja") || fileName.includes("land");
  const isTax = fileName.includes("tax") || fileName.includes("rasid");

  let docType = "Official Identity / Supporting Record";
  let fields = {
    fullName: "Ram Bahadur Shrestha",
    docNumber: "27-01-78-05241",
    issueDate: "2078/03/15 B.S.",
    address: "Kathmandu Metropolitan City Ward 04, Baluwatar",
    relationOrOwner: "Krishna Bahadur Shrestha (Father)"
  };

  if (isBirth) {
    docType = "Hospital Birth Record / Birth Certificate";
    fields = {
      fullName: "Sushil Shrestha",
      docNumber: "HOSP-KTM-2081-992",
      issueDate: "2081/02/10 B.S.",
      address: "TUTH Maharajgunj, Kathmandu",
      relationOrOwner: "Mother: Mina Shrestha"
    };
  } else if (isLalpurja) {
    docType = "Land Ownership Registration Certificate (Lalpurja)";
    fields = {
      fullName: "Ram Bahadur Shrestha",
      docNumber: "Kitta No. 348/12",
      issueDate: "2068/11/24 B.S.",
      address: "Ward 04, Sheet No. 102-04",
      relationOrOwner: "Plot Area: 0-4-2-1"
    };
  } else if (isTax) {
    docType = "Ward Property Tax Clearance Receipt";
    fields = {
      fullName: "Ram Bahadur Shrestha",
      docNumber: "KMC-TAX-2082-00412",
      issueDate: "2082/01/18 B.S.",
      address: "Ward 04, Kathmandu",
      relationOrOwner: "Fiscal Year 2081/2082 Settled"
    };
  }

  return {
    documentType: docType,
    readabilityScore: 94,
    isAcceptableQuality: true,
    completeness: "100% Checklist Matches",
    extractedData: fields,
    flags: [],
    checklistNotes: "Document image resolution is clear. Seal and municipal serial visible.",
    isSimulated: true,
    simulationReason: errMsg ? `API Error: ${errMsg}` : "No Gemini API Key provided (Running in demonstration mode)"
  };
}

/**
 * 2. JanSewa Sathi - Conversational Nepali Government Assistant
 */
export async function askJanSewaSathi(userQuery, conversationHistory = []) {
  const apiKey = getStoredGeminiKey();

  if (!apiKey) {
    return simulateJanSewaSathi(userQuery);
  }

  try {
    return await callGeminiWithFallback(apiKey, async (genAI, modelName) => {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: NEPAL_GOV_KNOWLEDGE_BASE
      });

      // Format chat history strictly adhering to Gemini API specification:
      // 1. History MUST start with role: "user" (initial bot greeting must be dropped).
      // 2. Roles MUST alternate between "user" and "model".
      // 3. History must end with "model" so sendMessage is the next "user" turn.
      const rawHistory = (conversationHistory || []).map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        text: msg.text || ""
      }));

      const firstUserIndex = rawHistory.findIndex((m) => m.role === "user");
      const formattedHistory = [];

      if (firstUserIndex !== -1) {
        const candidates = rawHistory.slice(firstUserIndex);
        for (const item of candidates) {
          if (!item.text.trim()) continue;
          if (formattedHistory.length === 0) {
            if (item.role === "user") {
              formattedHistory.push({
                role: "user",
                parts: [{ text: item.text }]
              });
            }
          } else {
            const lastRole = formattedHistory[formattedHistory.length - 1].role;
            if (item.role !== lastRole) {
              formattedHistory.push({
                role: item.role,
                parts: [{ text: item.text }]
              });
            }
          }
        }
      }

      // Ensure history ends with 'model' turn
      if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === "user") {
        formattedHistory.pop();
      }

      const chat = model.startChat({
        history: formattedHistory
      });

      const result = await chat.sendMessage(userQuery);
      return {
        text: result.response.text(),
        isSimulated: false
      };
    });
  } catch (err) {
    console.warn("JanSewa Sathi live API request fallback to verified municipal knowledge:", err);
    return simulateJanSewaSathi(userQuery);
  }
}

/**
 * High-fidelity, authoritative Nepali & English municipal knowledge fallback engine.
 * Covers Public Road Act 2031, Local Government Operation Act 2074, Citizenship,
 * Building Permits, Vital Events, Municipal Taxes, and Complaints.
 */
function simulateJanSewaSathi(query) {
  const q = (query || "").toLowerCase();

  // 1. Greetings ("Hi", "Hello", "नमस्ते", "नमस्कार")
  if (
    q === "hi" || 
    q === "hello" || 
    q === "namaste" || 
    q === "नमस्ते" || 
    q === "नमस्ते!" || 
    q === "नमस्कार" ||
    q.startsWith("hi ") ||
    q.startsWith("hello ")
  ) {
    return {
      text: `नमस्ते! म **जनसेवा साथी (JanSewa Sathi)** हुँ, नेपाल सरकारको स्थानीय तह तथा वडा सेवा सहायक।

म तपाईंलाई **स्थानीय सरकार सञ्चालन ऐन, २०७४** तथा सार्वजनिक सेवा निर्देशिका अनुसार निम्न विषयहरूमा सहयोग गर्न सक्छु:
• **नागरिकता सिफारिस** (वंशज, वैवाहिक अंगीकृत, NRN)
• **बसोबास प्रमाणित** (स्थायी तथा बहाल सम्झौता)
• **सडक सम्बन्धी कानून र मापदण्ड** (सार्वजनिक सडक ऐन २०३१, सडक खन्ने अनुमति)
• **सार्वजनिक उजुरी तथा गुनासो दर्ता** (खाल्डाखुल्डी, ढल, खानेपानी चुहावट)
• **व्यक्तिगत घटना दर्ता** (जन्म, विवाह, मृत्यु, बसाइँसराइ ३५ दिनभित्र निःशुल्क)
• **भवन निर्माण तथा नक्सा पास** (सन्धिसर्पन, इजाजत र सम्पन्न प्रमाणपत्र)
• **स्थानीय कर तथा व्यवसाय इजाजत** (घरबहाल कर १०%, सम्पत्ति कर)

तपाईं कुन सेवा वा कानूनबारे जानकारी लिन चाहनुहुन्छ?`,
      isSimulated: true
    };
  }

  // 2. Nepal Road Laws & Standards (सडक सम्बन्धी कानुन, सार्वजनिक सडक ऐन, मापदण्ड)
  const isRoadLawQuery = 
    (q.includes("kanoon") || q.includes("kanun") || q.includes("law") || q.includes("act") || q.includes("niyam") || q.includes("rule") || q.includes("right of way") || q.includes("row") || q.includes("मापदण्ड") || q.includes("ऐन") || q.includes("कानून") || q.includes("कानुन") || q.includes("अधिकार")) &&
    (q.includes("sadak") || q.includes("road") || q.includes("bato") || q.includes("सडक") || q.includes("बाटो"));

  if (isRoadLawQuery) {
    return {
      text: `नमस्ते! नेपालमा सडक निर्माण, मर्मत, व्यवस्थापन र सडक क्षेत्रको संरक्षण सम्बन्धी मुख्य कानुनी व्यवस्था **सार्वजनिक सडक ऐन, २०३१** र **स्थानीय सरकार सञ्चालन ऐन, २०७४** मा आधारित छ:

### १. सार्वजनिक सडक ऐन, २०३१ (Public Road Act, 1974)
• **सडकको वर्गीकरण:** सडकलाई राष्ट्रिय राजमार्ग (National Highway), सहायक मार्ग (Feeder Road), जिल्ला सडक र सहरी/स्थानीय सडकमा वर्गीकरण गरिएको छ।
• **सडक विभागको क्षेत्राधिकार:** राष्ट्रिय राजमार्ग र मुख्य रणनीतिक सडकहरूको निर्माण, मर्मत र अधिकार क्षेत्र (Right of Way - RoW) सडक विभाग (Department of Roads - DoR) मातहत रहन्छ।
• **सडक अतिक्रमण निषेध (Anti-Encroachment):** सडकको सीमाभित्र कुनै पनि स्थायी वा अस्थायी संरचना बनाउन, सामान थुपार्न वा अवरोध गर्न पाइँदैन।
• **सडक खन्ने अनुमति (Road Cutting Permission):** खानेपानी, ढल, बिजुली वा अप्टिकल फाइबरका लागि सडक खन्नुअघि सम्बन्धित सडक निकायबाट अनिवार्य अनुमति लिनुपर्छ र पुनर्मर्मत (Reinstatement) शुल्क बुझाउनुपर्छ।

### २. स्थानीय सरकार सञ्चालन ऐन, २०७४ (Local Government Operation Act, 2017)
• **दफा ११ र १२ (स्थानीय तह तथा वडाको एकल अधिकार):**
  - नगर/गाउँस्तरीय सडक, ग्रामीण सडक, कृषि सडक तथा वडाभित्रका भित्री शाखा बाटोहरूको निर्माण, मर्मतसम्भार र स्तरोन्नतिको पूर्ण अधिकार स्थानीय सरकार (महानगरपालिका/नगरपालिका/गाउँपालिका) लाई छ।
  - वडा कार्यालयले आफ्नो क्षेत्रभित्रका सडकहरूको लगत राख्ने, खाल्डाखुल्डी मर्मत गर्ने, सडक बत्ती व्यवस्थापन गर्ने र अतिक्रमण नियन्त्रण गर्ने जिम्मा पाएको छ।
• **सडक मापदण्ड र Setback:** भवन निर्माण गर्दा सडकको केन्द्र रेखा (Centerline) बाट तोकिएको न्यूनतम दूरी (Setback) छाड्नु कानुनी रूपमा अनिवार्य छ।

### ३. उजुरी तथा मर्मत प्रक्रिया:
स्थानीय सडकमा खाल्डाखुल्डी, ढल वा पहिरो भएमा नागरिकले हाम्रो पोर्टलको **'Lodge Complaint'** बटनबाट वा काठमाडौँ महानगरको **कल सेन्टर ११८०** मा सिधै उजुरी गर्न सक्छन्।`,
      isSimulated: true
    };
  }

  // 3. Potholes / Damage / Public Grievance Lodging (सडक खाल्डाखुल्डी, ढल, खानेपानी चुहावट)
  if (
    q.includes("khaldokhuldi") || 
    q.includes("khaldo") || 
    q.includes("pothole") || 
    q.includes("खाल्डो") || 
    q.includes("खाल्डाखुल्डी") || 
    q.includes("उजुरी") || 
    q.includes("complaint") || 
    q.includes("lodge") || 
    q.includes("damage") ||
    q.includes("leak") ||
    q.includes("ढल") ||
    q.includes("खानेपानी") ||
    q.includes("पानी") ||
    q.includes("fohor") ||
    q.includes("waste") ||
    q.includes("फोहर")
  ) {
    return {
      text: `नमस्ते! जनसेवा पोर्टलमा सार्वजनिक समस्या तथा उजुरी (Public Grievance) सिधै दर्ता गर्न सकिन्छ:

१. **'Lodge Complaint'** बटन थिच्नुहोस् वा सिधै गुनासो फारम खोल्नुहोस्।
२. **समस्याको प्रकार छान्नुहोस्:**
   - सडक खाल्डाखुल्डी / पूर्वाधार (Road & Infrastructure)
   - खानेपानी चुहावट / ढल जाम (Drinking Water & Sewage - KUKL)
   - फोहर संकलन तथा दुर्गन्ध (Sanitation & Waste)
   - सडक बत्ती / जोखिमपूर्ण पोल (Streetlights / Electricity)
३. **स्थान तथा विवरण:** घटना भएको स्थान (जस्तै: बालुवाटार चोक, वडा नं ४) र स्थलगत फोटो अपलोड गर्नुहोस्।
४. **एआई प्राथमिकता (AI Smart Triage):** हाम्रो प्रणालीले जोखिमका आधारमा प्राथमिकता (Emergency / High / Medium) निर्धारण गरी सम्बन्धित शाखा (KMC Road Division वा KUKL) मा स्वचालित प्रेषण गर्दछ।

📌 उजुरी दर्ता हुनासाथ तपाईंलाई **CMP-TRK ट्र्याकिङ कोड** प्राप्त हुन्छ, जसबाट प्रगतिको अवस्था प्रत्यक्ष हेर्न सकिन्छ। आपतकालीन अवस्थामा महानगरको हटलाइन **११८०** मा समेत सम्पर्क गर्न सक्नुहुन्छ।`,
      isSimulated: true
    };
  }

  // 4. Citizenship Recommendation (नागरिकता सिफारिस)
  if (q.includes("nagarikta") || q.includes("citizenship") || q.includes("नागरिकता") || q.includes("सिफारिस")) {
    return {
      text: `नमस्ते! नयाँ नागरिकता सिफारिस (Citizenship Recommendation) का लागि **नेपाल नागरिकता ऐन, २०६३** तथा वडा कार्यविधि अनुसार आवश्यक विवरण यस प्रकार छन्:

### आवश्यक कागजातहरू (Required Documents):
१. **बुबा वा आमाको नेपाली नागरिकता प्रमाणपत्रको प्रतिलिपि** (दुवै भए अझ राम्रो)
२. **सम्बन्धित स्थानीय तहबाट जारी जन्म दर्ता प्रमाणपत्र** (Birth Certificate)
३. **बसाइँसराइ गरी आएको भए बसाइँसराइको आधिकारिक प्रमाणपत्र** (Migration Certificate)
४. **निवेदकको हालसालै खिचिएको ३ प्रति पासपोर्ट साइज फोटो**
५. **शैक्षिक प्रमाणपत्र (कम्तिमा कक्षा ८ वा SEE को चारित्रिक प्रमाणपत्र भएमा)**
६. **सम्बन्धित व्यक्ति तथा सनाखत गर्ने बाबु/आमा वा एकाघरको व्यक्तिको उपस्थिति**

📌 **लाग्ने समय:** १ देखि २ कार्यदिन  
📌 **सरकारी दस्तुर:** रु. १०० (वडा कार्यालय)  
📌 **प्रक्रिया:** वडा कार्यालयबाट सिफारिस पत्र प्राप्त भएपछि जिल्ला प्रशासन कार्यालय (DAO - Babarmahal / सम्बन्धित जिल्ला) मा गई बायोमेट्रिक र नागरिकता कार्ड लिन सकिन्छ।

तपाईं हाम्रो पोर्टलको **'Citizen Portal' -> 'Apply Now'** मा गई अनलाइन सिफारिस फारम पेश गर्न सक्नुहुन्छ!`,
      isSimulated: true
    };
  }

  // 5. Residence Verification (बसोबास प्रमाणित)
  if (q.includes("basobas") || q.includes("residence") || q.includes("बसोबास") || q.includes("ghar")) {
    return {
      text: `नमस्ते! बसोबास प्रमाणित सिफारिस (Residence Verification Certificate) को लागि प्रक्रिया तथा आवश्यक कागजातहरू:

• **स्थायी बसोबासका लागि (Permanent Residence):**
  - जग्गाधनी प्रमाणपुर्जा (लालपुर्जा) को प्रमाणित प्रतिलिपि
  - चालु आर्थिक वर्षको सम्पत्ति/घरजग्गा कर चुक्ता गरेको रसिद
  - निवेदकको नेपाली नागरिकता प्रमाणपत्र
  - खानेपानी वा नेपाल विद्युत प्राधिकरण (NEA) को पछिल्लो महसुल रसिद

• **अस्थायी वा बहाल बसोबासका लागि (Tenant / Rent):**
  - घरधनीसँग गरिएको कम्तिमा १ वर्षको बहाल सम्झौता (House Rent Agreement)
  - घरधनीको नागरिकता र लालपुर्जाको प्रतिलिपि
  - घरधनीले वडामा १०% बहाल कर बुझाएको प्रमाण
  - निवेदकको नागरिकता प्रतिलिपि

📌 **सरकारी दस्तुर:** रु. २००  
📌 **लाग्ने समय:** सोही दिन वा १ कार्यदिन भित्र जारी हुन्छ।`,
      isSimulated: true
    };
  }

  // 6. Building Permit & Blueprint Approval (नक्सा पास)
  if (q.includes("naksa") || q.includes("map") || q.includes("building") || q.includes("ghar nirman") || q.includes("नक्सा") || q.includes("भवन निर्माण")) {
    return {
      text: `नमस्ते! स्थानीय तहमा भवन निर्माण इजाजत तथा नक्सा पास (Building Map Approval) सम्बन्धी ५-चरणीय कानुनी प्रक्रिया:

१. **प्रारम्भिक निवेदन:** नेपाल इन्जिनियरिङ काउन्सिलमा दर्ता भएको इन्जिनियरबाट तयार गरिएको आर्किटेक्चरल/स्ट्रक्चरल नक्सा, लालपुर्जा, र कित्तानापी नक्सा (Trace Map)।
२. **सन्धिसर्पन सूचना (१५ दिने सार्वजनिक सूचना):** साँध-सिमानाका छिमेकीहरूलाई कुनै बाधा-विरोध छ कि भनी १५ दिनको म्याद दिइन्छ।
३. **अस्थायी इजाजत (Plinth Level):** डीपीसी (DPC) सम्म निर्माण गर्न अस्थायी स्वीकृति।
४. **प्राविधिक निरीक्षण:** वडा तथा महानगरका प्राविधिकद्वारा भूकम्पीय मापदण्ड र Setback को स्थलगत प्रमाणीकरण।
५. **स्थायी निर्माण सम्पन्न प्रमाणपत्र:** भवन सम्पन्न भएपछि स्थायी प्रयोग इजाजत (Building Completion Certificate) जारी हुन्छ।

📌 **शुल्क:** प्लिन्थ एरिया अनुसार रु. २५ देखि रु. ६० प्रति वर्गमिटर।`,
      isSimulated: true
    };
  }

  // 7. Vital Event Registration (जन्म, मृत्यु, विवाह, बसाइँसराइ दर्ता)
  if (q.includes("birth") || q.includes("marriage") || q.includes("death") || q.includes("vivah") || q.includes("janma") || q.includes("दर्ता") || q.includes("घटना दर्ता")) {
    return {
      text: `नमस्ते! **व्यक्तिगत घटना दर्ता ऐन, २०३३** तथा कार्यविधि अनुसार जन्म, मृत्यु, विवाह, बसाइँसराइ र सम्बन्ध विच्छेद दर्ता सम्बन्धी नियमहरू:

• **३५ दिनको कानुनी सुविधा:**
  घटना घटेको **३५ दिनभित्र** वडा कार्यालयमा दर्ता गराउँदा कुनै पनि सरकारी दस्तुर लाग्दैन (**पूर्णतः निःशुल्क**)।
• **३५ दिन कटेमा:** रु. ५० देखि २०० सम्म बिलम्ब शुल्क (Late Fine) लाग्छ।

**आवश्यक प्रमाणहरू:**
- **जन्म दर्ता:** अस्पतालको जन्म डिस्चार्ज प्रमाणपत्र, बाबु-आमाको नागरिकता र विवाह दर्ता।
- **विवाह दर्ता:** दुलहा-दुलही दुवैको नागरिकता, विवाहको फोटो, र दुवै पक्षको उपस्थिति।
- **मृत्यु दर्ता:** मृतकको नागरिकता, अस्पतालको मृत्यु घोषणा पत्र वा मुचुल्का, र सूचकको नागरिकता।
- **बसाइँसराइ:** साविक ठेगानाको बसाइँसराइ दर्ता प्रमाणपत्र र हालको बसोबास प्रमाण (लालपुर्जा/बहाल)।`,
      isSimulated: true
    };
  }

  // 8. Business & Municipal Tax (व्यवसाय दर्ता, घरबहाल कर १०%, सम्पत्ति कर)
  if (q.includes("tax") || q.includes("कर") || q.includes("pan") || q.includes("business") || q.includes("व्यवसाय") || q.includes("बहाल कर") || q.includes("rent")) {
    return {
      text: `नमस्ते! व्यवसाय दर्ता तथा स्थानीय कर सम्बन्धी जानकारी:

• **साना व्यवसाय दर्ता (Small Business / Trade License):**
  - सञ्चालकको नागरिकता प्रतिलिपि (२ प्रति)
  - व्यवसाय स्थलको घर बहाल सम्झौता वा जग्गाधनी लालपुर्जा
  - आन्तरिक राजस्व कार्यालय (IRD) को स्थायी लेखा नम्बर (PAN) प्रमाणपत्र
  - २ प्रति पासपोर्ट साइज फोटो
  - दस्तुर: पुँजी अनुसार रु. १,५०० देखि रु. ५,००० सम्म।

• **घरबहाल कर (House Rent Tax):**
  - **काठमाडौँ महानगरपालिका राजस्व ऐन, २०८०** अनुसार घर बहाल रकमको **१०% बहाल कर** स्थानीय वडा कार्यालयमा बुझाउनुपर्छ।
• **सम्पत्ति कर (Property Tax):**
  - चालु आर्थिक वर्षको पुस मसान्तभित्र सम्पत्ति कर बुझाउँदा **१०% छुट** को सुविधा प्राप्त हुन्छ।`,
      isSimulated: true
    };
  }

  // 9. Judicial Committee / Dispute Resolution (न्यायिक समिति तथा मेलमिलाप)
  if (q.includes("dispute") || q.includes("court") || q.includes("samiti") || q.includes("विवाद") || q.includes("झगडा") || q.includes("न्यायिक समिति") || q.includes("मेलमिलाप")) {
    return {
      text: `नमस्ते! **स्थानीय सरकार सञ्चालन ऐन, २०७४ को परिच्छेद-८ (दफा ४६-५३)** बमोजिम स्थानीय तहमा उपप्रमुख/उपाध्यक्षको संयोजकत्वमा ३ सदस्यीय **न्यायिक समिति (Judicial Committee)** रहने व्यवस्था छ।

**न्यायिक समितिको क्षेत्राधिकार:**
• आलीधुर, सिमाना, र बाँधपैनी सम्बन्धी विवाद
• घरबहाल, भाडा, र घर खाली गराउने विषय
• ज्यालामजुरी नदिएको वा बाटो निकास रोकेको सम्बन्धी विवाद
• जेष्ठ नागरिक, बालबालिका, वा पारिवारिक अंश-झगडा

📌 प्रक्रिया: वडा कार्यालयमा दर्ता भएको निवेदनलाई सूचीकृत मेलमिलापकर्ता (Certified Mediator) मार्फत आपसी सहमतिमा निःशुल्क समाधान गरिन्छ।`,
      isSimulated: true
    };
  }

  // Default authoritative municipal fallback
  return {
    text: `नमस्ते! म जनसेवा एआई नेपाल (JanSewa AI Nepal) को डिजिटल सेवा सहायक हुँ।

तपाईंले मलाई वडा कार्यालय, नगरपालिका तथा जिल्ला प्रशासन कार्यालय (DAO) बाट उपलब्ध हुने सेवाहरू, जस्तै:
• **नागरिकता सिफारिस तथा कागजात**
• **बसोबास प्रमाणित तथा बहाल सम्झौता**
• **सडक सम्बन्धी नेपाल कानून र सडक मापदण्ड** (सार्वजनिक सडक ऐन २०३१, स्थानीय सरकार सञ्चालन ऐन २०७४)
• **सार्वजनिक उजुरी तथा सडक खाल्डाखुल्डी मर्मत**
• **जन्म, विवाह, बसाइँसराइ दर्ता** (३५ दिनभित्र निःशुल्क)
• **सम्पत्ति कर, व्यवसाय इजाजत तथा १०% बहाल कर**
• **नक्सा पास तथा भवन निर्माण स्वीकृति**

सम्बन्धी नियम, आवश्यक कागजात, दस्तुर र कार्यविधिको बारेमा नेपाली वा अंग्रेजीमा सोध्न सक्नुहुन्छ। तपाईंलाई कुन सेवाबारे बुझ्न मन छ?`,
    isSimulated: true
  };
}

/**
 * 3. Smart Complaint Classification & Triage
 */
export async function classifyComplaintWithGemini(title, description, location) {
  const apiKey = getStoredGeminiKey();

  if (!apiKey) {
    return simulateComplaintClassification(title, description, location);
  }

  try {
    return await callGeminiWithFallback(apiKey, async (genAI, modelName) => {
      const model = genAI.getGenerativeModel({ model: modelName });

      const prompt = `
You are the AI Public Grievance Classifier for Kathmandu Metropolitan City / Nepal Local Government.
Analyze the following citizen complaint:
Title: "${title}"
Description: "${description}"
Location: "${location}"

Determine:
1. Category (Road & Infrastructure, Drinking Water & Sewage, Sanitation & Waste, Streetlights & Electricity, Encroachment & Public Space, or Administrative Service).
2. Urgency Level (Emergency, High, Medium, Low).
3. Assigned Municipal Department (e.g. KMC Infrastructure Division, KUKL Water Supply, KMC Environment Dept, Nepal Electricity Authority, Ward Field Unit).
4. Extracted landmark / location keywords.
5. Recommended Action Summary for the field team.

Return ONLY a strict JSON object:
{
  "category": string,
  "categoryNe": string,
  "priority": "Emergency" | "High" | "Medium" | "Low",
  "suggestedDepartment": string,
  "confidence": number,
  "extractedLocation": string,
  "recommendedAction": string
}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(text);
    });
  } catch (err) {
    console.warn("Live complaint classification fallback to rule-based triage:", err);
    return simulateComplaintClassification(title, description, location);
  }
}

function simulateComplaintClassification(title, description, location) {
  const combined = (title + " " + description + " " + location).toLowerCase();

  if (combined.includes("water") || combined.includes("pipe") || combined.includes("khanepani") || combined.includes("ढल") || combined.includes("पानी")) {
    return {
      category: "Drinking Water & Sewage",
      categoryNe: "खानेपानी तथा ढल निकास",
      priority: combined.includes("burst") || combined.includes("flood") || combined.includes("फुटि") ? "Emergency" : "High",
      suggestedDepartment: "Kathmandu Upatyaka Khanepani Limited (KUKL) Emergency Unit",
      confidence: 0.97,
      extractedLocation: location || "Ward 04 Municipal Area",
      recommendedAction: "Dispatch pipeline isolation crew to prevent road erosion and potable water wastage."
    };
  }

  if (combined.includes("waste") || combined.includes("garbage") || combined.includes("fohor") || combined.includes("दुर्गन्ध") || combined.includes("फोहर")) {
    return {
      category: "Sanitation & Waste",
      categoryNe: "सरसफाइ तथा फोहर व्यवस्थापन",
      priority: "Medium",
      suggestedDepartment: "KMC Environment & Waste Management Department",
      confidence: 0.95,
      extractedLocation: location || "Ward 04 Residential Sector",
      recommendedAction: "Schedule priority compactor truck route and deploy lime powder sanitation."
    };
  }

  // Default to road/infrastructure
  return {
    category: "Road & Infrastructure",
    categoryNe: "सडक तथा पूर्वाधार",
    priority: combined.includes("cave") || combined.includes("accident") || combined.includes("भासिएको") ? "High" : "Medium",
    suggestedDepartment: "KMC Road Maintenance & Infrastructure Division",
    confidence: 0.94,
    extractedLocation: location || "Baluwatar / Ward 04",
    recommendedAction: "Deploy technical engineer for road inspection and initiate cold-mix pothole repair."
  };
}

/**
 * 4. Predictive Workload & Demand Intelligence
 */
export async function generatePredictiveInsights(historicalData) {
  const apiKey = getStoredGeminiKey();

  if (!apiKey) {
    return {
      forecastNextMonth: 345,
      projectedGrowth: "+11.2%",
      surgeRiskServices: ["Citizenship Recommendation (CIT-01)", "Ward Property Tax Clearance (TAX-03)"],
      capacityRecommendation: "Increase Ward Secretary scrutiny window by 2 hours daily between Kartik 15 and 30 to avert 18% backlog accumulation.",
      executiveSummary: "Historical trend analysis identifies upcoming seasonal surge driven by pre-festival vital registration deadlines and fiscal quarter-end property tax reconciliation.",
      isSimulated: true
    };
  }

  try {
    return await callGeminiWithFallback(apiKey, async (genAI, modelName) => {
      const model = genAI.getGenerativeModel({ model: modelName });

      const prompt = `
You are the Data Science & Predictive Analytics advisor for JanSewa AI Nepal.
Given historical monthly application volumes:
${JSON.stringify(historicalData)}

Generate a predictive operational forecast for next month's municipal workload:
1. Projected total requests next month.
2. Estimated percentage growth.
3. Top 2 services prone to seasonal backlog surges in Nepal local governance.
4. Concrete staffing/capacity recommendation for Ward Office 04.
5. Executive summary paragraph.

Return ONLY strict JSON:
{
  "forecastNextMonth": number,
  "projectedGrowth": string,
  "surgeRiskServices": [string],
  "capacityRecommendation": string,
  "executiveSummary": string
}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(text);
    });
  } catch (err) {
    return {
      forecastNextMonth: 345,
      projectedGrowth: "+11.2%",
      surgeRiskServices: ["Citizenship Recommendation", "Tax Clearance"],
      capacityRecommendation: "Deploy supplementary data entry operator during peak morning hours.",
      executiveSummary: "Model projects continuous upward service adoption following digital kiosk rollout.",
      isSimulated: true
    };
  }
}
