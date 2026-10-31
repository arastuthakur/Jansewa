import { GoogleGenerativeAI } from "@google/generative-ai";

// Government service knowledge base for RAG grounding
const NEPAL_GOV_KNOWLEDGE_BASE = `
You are JanSewa Sathi (जनसेवा साथी), an official assistive AI service agent for the JanSewa AI Nepal platform.
Your duty is to assist citizens and municipal staff navigating Nepal local government services (वडा कार्यालय, नगरपालिका, र जिल्ला प्रशासन कार्यालय).
Follow the Local Government Operation Act 2074 (स्थानीय सरकार सञ्चालन ऐन, २०७४) and Nepal Citizenship Act.

Key Service Rules:
1. Citizenship Recommendation (नागरिकता प्रमाणपत्र सिफारिस):
   - Office: Ward Office (वडा कार्यालय) then District Administration Office (DAO / जि.प्र.का.).
   - Requirements: Parents' citizenship copy (आमाबुबाको नागरिकता), birth registration certificate (जन्मदर्ता प्रमाणपत्र), 3 passport photos, and physical presence of father/mother or verified legal guardian.
   - Fee: NPR 100 at Ward Office. Processing time: 1-2 days.

2. Residence Verification (बसोबास प्रमाणित सिफारिस):
   - Office: Ward Office.
   - Requirements: Land ownership deed (Lalpurja - लालपुर्जा) or registered house rent contract (बहाल सम्झौता), property tax receipt of current fiscal year (चालु आ.व. को कर रसिद), citizenship copy, and utility bill (water/electricity).
   - Fee: NPR 200. Processing time: Same day or 1 day.

3. Property & Business Tax Clearance (कर चुक्ता प्रमाणपत्र):
   - Office: Ward Revenue Desk / Municipality.
   - Requirements: Latest property valuation document, past tax receipts, citizenship copy.
   - Fee: NPR 500.

4. Birth Registration (जन्म दर्ता सिफारिस):
   - Free if registered within 35 days of birth.
   - Requirements: Hospital birth discharge summary, parents' citizenship copies, parents' marriage certificate.

5. Small Business / Trade License (व्यवसाय दर्ता):
   - Office: Ward Office & Municipal Economic Development Department.
   - Requirements: Business premises rent agreement or Lalpurja, proprietor citizenship copy, PAN/VAT certificate, 2 photos.
   - Fee: NPR 1,500 - 3,000 depending on capital.

Guidelines for response:
- Answer in the same language as the user query (Nepali Devanagari, English, or Romanized Nepali).
- Cite specific required documents, expected fees in NPR, and estimated working days.
- Include a warm respectful greeting (e.g., "नमस्ते!" or "Namaste").
- If a question is outside Nepal local government scope, politely clarify that you are restricted to public administrative matters.
- Provide clear bullet points for document checklists.
`;

export function getStoredGeminiKey() {
  const localKey = typeof localStorage !== "undefined" ? localStorage.getItem("jansewa_gemini_api_key") : null;
  const viteKey = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_GEMINI_API_KEY : null;
  const procKey = typeof process !== "undefined" && process.env ? process.env.GEMINI_API : null;
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
    // High-fidelity fallback simulated analysis if key is not yet provided
    return simulateDocumentAnalysis(fileData, serviceContext);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    // Parse json from markdown code fences if present
    const cleanedJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanedJson);
  } catch (err) {
    console.warn("Gemini Live Document Analysis failed or rate limited, using simulated fallback:", err);
    return simulateDocumentAnalysis(fileData, serviceContext, err.message);
  }
}

function simulateDocumentAnalysis(fileData, serviceContext, errMsg = null) {
  const fileName = (fileData?.name || "").toLowerCase();
  const isBirth = fileName.includes("birth") || fileName.includes("hospital");
  const isLalpurja = fileName.includes("lalpurja") || fileName.includes("land");
  const isTax = fileName.includes("tax") || fileName.includes("rasid");
  const isCitizen = fileName.includes("citizen") || fileName.includes("nagarikta");

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
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
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

    // Ensure history ends with 'model' turn so chat.sendMessage(userQuery) provides the subsequent 'user' turn
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
  } catch (err) {
    console.warn("JanSewa Sathi live API request fallback to verified municipal knowledge:", err);
    // Provide clean, authoritative grounded answer without leaking internal debugging notes
    return simulateJanSewaSathi(userQuery);
  }
}

function simulateJanSewaSathi(query) {
  const q = query.toLowerCase();

  if (q.includes("nagarikta") || q.includes("citizenship") || q.includes("नागरिकता")) {
    return {
      text: `नमस्ते! नयाँ नागरिकता सिफारिस (Citizenship Recommendation) का लागि वडा कार्यालयमा निम्न कागजातहरू आवश्यक पर्दछन्:

1. **बुबा वा आमाको नेपाली नागरिकता प्रमाणपत्रको प्रतिलिपि** (दुवै भए अझ राम्रो)
2. **सम्बन्धित वडामा दर्ता भएको जन्म दर्ता प्रमाणपत्र**
3. **बसाईसराई गरी आएको भए बसाईसराईको आधिकारिक प्रमाणपत्र**
4. **निवेदकको हालसालै खिचिएको ३ प्रति पासपोर्ट साइज फोटो**
5. **सम्बन्धित व्यक्ति तथा सनाखत गर्ने बाबु/आमाको उपस्थिति**

📌 **लाग्ने समय:** १ देखि २ कार्यदिन  
📌 **सरकारी दस्तुर:** रु. १०० (वडा कार्यालय)  
📌 **प्रक्रिया:** वडाबाट सिफारिस प्राप्त भएपछि जिल्ला प्रशासन कार्यालय (DAO Babarmahal / सम्बन्धित जिल्ला) मा गई बायोमेट्रिक र नागरिकता कार्ड प्राप्त गर्न सकिन्छ।

तपाईं सिधै **'Citizen Portal' -> 'Apply Now'** मा गई अनलाइन फारम भर्न सक्नुहुन्छ!`,
      isSimulated: true
    };
  }

  if (q.includes("basobas") || q.includes("residence") || q.includes("बसोबास") || q.includes("ghar")) {
    return {
      text: `नमस्ते! बसोबास प्रमाणित सिफारिस (Residence Verification Certificate) को लागि प्रक्रिया यस प्रकार छ:

• **स्थायी बसोबासका लागि:**
  - जग्गाधनी प्रमाणपुर्जा (लालपुर्जा) को प्रतिलिपि
  - चालु आर्थिक वर्षको सम्पत्ति/घरजग्गा कर चुक्ता गरेको रसिद
  - निवेदकको नागरिकता प्रमाणपत्र
  - खानेपानी वा बिजुलीको पछिल्लो महिनाको महसुल रसिद

• **अस्थायी (बहाल/भाडा) बसोबासका लागि:**
  - घरधनीसँग गरिएको कम्तिमा १ वर्षको बहाल सम्झौता (Rent Agreement)
  - घरधनीको नागरिकता र लालपुर्जाको प्रतिलिपि
  - निवेदकको नागरिकता प्रतिलिपि

📌 **सरकारी दस्तुर:** रु. २००  
📌 **समय:** सोही दिन वा १ कार्यदिन भित्र।`,
      isSimulated: true
    };
  }

  if (q.includes("complaint") || q.includes("sadak") || q.includes("water") || q.includes("ढल") || q.includes("गुनासो") || q.includes("फोहर")) {
    return {
      text: `नमस्ते! जनसेवा पोर्टलमा सार्वजनिक समस्या तथा उजुरी सिधै दर्ता गर्न सकिन्छ:

१. हाम्रो **'Lodge Complaint'** बटन थिच्नुहोस्।
२. समस्याको प्रकार (सडक खाल्डाखुल्डी, खानेपानी चुहावट, फोहर संकलन, वा ढल निकास) छान्नुहोस्।
३. घटना भएको स्थान (जस्तै: बालुवाटार चोक, वडा नं ४) र आवश्यक भए फोटो अपलोड गर्नुहोस्।
४. हाम्रो **डिजिटल एआई प्रणाली**ले स्वतः प्राथमिकता (Emergency / High / Medium) निर्धारण गरी सम्बन्धित शाखा वा KUKL/सडक विभागमा पठाउनेछ।

तपाईंले पाउने **CMP-TRK कोड** मार्फत कारबाहीको अवस्था प्रत्यक्ष हेर्न सक्नुहुन्छ।`,
      isSimulated: true
    };
  }

  if (q.includes("tax") || q.includes("कर") || q.includes("pan") || q.includes("business")) {
    return {
      text: `नमस्ते! व्यवसाय दर्ता तथा कर सम्बन्धी जानकारी:

• **साना व्यवसाय दर्ता (Small Business Registration):**
  - सञ्चालकको नागरिकता प्रतिलिपि (२ प्रति)
  - व्यवसाय रहने स्थानको घर बहाल सम्झौता वा लालपुर्जा
  - आन्तरिक राजस्व कार्यालय (IRD) बाट जारी स्थायी लेखा नम्बर (PAN) प्रमाणपत्र
  - २ प्रति पासपोर्ट साइज फोटो

📌 **दस्तुर:** पुँजी अनुसार रु. १,५०० देखि रु. ५,००० सम्म।  
चालु आर्थिक वर्षको सम्पत्ति कर समयमै बुझाउँदा १०% सम्म छुटको व्यवस्था रहेको छ।`,
      isSimulated: true
    };
  }

  return {
    text: `नमस्ते! म जनसेवा एआई नेपाल (JanSewa AI Nepal) को डिजिटल सेवा सहायक हुँ। 
तपाईंले मलाई वडा कार्यालय, नगरपालिका तथा जिल्ला प्रशासन कार्यालय (DAO) बाट उपलब्ध हुने सेवाहरू, जस्तै:
• **नागरिकता सिफारिस**
• **बसोबास प्रमाणित**
• **जन्म, विवाह, बसाईसराई दर्ता**
• **सम्पत्ति कर तथा व्यवसाय इजाजत**
• **सडक, खानेपानी र फोहर सम्बन्धी सार्वजनिक गुनासो दर्ता**

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
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
  } catch (err) {
    console.warn("Live complaint classification failed, using domain fallback:", err);
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
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
