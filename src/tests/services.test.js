import { describe, it, expect, vi } from "vitest";
import { 
  getStoredGeminiKey, 
  setStoredGeminiKey, 
  askJanSewaSathi, 
  classifyComplaintWithGemini, 
  analyzeDocumentWithGemini,
  generatePredictiveInsights 
} from "../services/geminiService";
import { fetchKathmanduEnvironmentalData } from "../services/publicDataService";
import { INITIAL_SERVICES, INITIAL_APPLICATIONS, INITIAL_COMPLAINTS } from "../data/syntheticData";

describe("JanSewa Public Service & Gemini AI Layer", () => {
  it("should retrieve stored or environment Gemini key properly", () => {
    const key = getStoredGeminiKey();
    expect(typeof key).toBe("string");
  });

  it("should answer citizen queries with grounded Nepali government knowledge", async () => {
    const response = await askJanSewaSathi("नागरिकता सिफारिस लिन के के चाहिन्छ?");
    expect(response).toBeDefined();
    expect(response.text).toContain("नागरिकता");
    expect(response.text.length).toBeGreaterThan(50);
  });

  it("should answer residence verification queries with required documents", async () => {
    const response = await askJanSewaSathi("What documents are needed for residence verification?");
    expect(response).toBeDefined();
    expect(response.text.toLowerCase()).toContain("residence");
  });

  it("should triage road complaints with urgency and department routing", async () => {
    const result = await classifyComplaintWithGemini(
      "Deep crater cave-in near Baluwatar",
      "Motorcycle risk",
      "Baluwatar Chowk"
    );
    expect(result).toBeDefined();
    expect(result.category).toContain("Road");
    expect(["High", "Emergency", "Medium"]).toContain(result.priority);
  });

  it("should triage pipeline burst as emergency water department task", async () => {
    const result = await classifyComplaintWithGemini(
      "Main water pipe burst flooding road",
      "Massive leak",
      "Ward 4 Bhatbhateni"
    );
    expect(result.category).toContain("Water");
    expect(result.suggestedDepartment).toContain("KUKL");
  });

  it("should extract candidate fields and verify document completeness", async () => {
    const result = await analyzeDocumentWithGemini(
      { name: "Nepali_Citizenship_Card.jpg", type: "image/jpeg" },
      INITIAL_SERVICES[0]
    );
    expect(result.readabilityScore).toBeGreaterThanOrEqual(70);
    expect(result.extractedData).toBeDefined();
    expect(result.extractedData.fullName).toBeDefined();
  });

  it("should generate predictive workload analytics for Kathmandu municipality", async () => {
    const forecast = await generatePredictiveInsights([
      { month: "Jan", actualRequests: 120 },
      { month: "Feb", actualRequests: 155 }
    ]);
    expect(forecast.forecastNextMonth).toBeGreaterThan(0);
    expect(forecast.surgeRiskServices.length).toBeGreaterThan(0);
  });

  it("should fetch environmental data for Kathmandu with valid metrics", async () => {
    const env = await fetchKathmanduEnvironmentalData();
    expect(env).toBeDefined();
    expect(typeof env.temperature).toBe("number");
    expect(typeof env.aqi).toBe("number");
    expect(env.condition).toBeDefined();
  });

  it("should validate synthetic municipal data completeness", () => {
    expect(INITIAL_SERVICES.length).toBeGreaterThanOrEqual(5);
    expect(INITIAL_APPLICATIONS.length).toBeGreaterThanOrEqual(4);
    expect(INITIAL_COMPLAINTS.length).toBeGreaterThanOrEqual(3);

    INITIAL_SERVICES.forEach((s) => {
      expect(s.id).toBeDefined();
      expect(s.code).toBeDefined();
      expect(s.titleEn).toBeDefined();
      expect(s.titleNe).toBeDefined();
      expect(s.feeNpr).toBeGreaterThanOrEqual(0);
      expect(s.requiredDocs.length).toBeGreaterThan(0);
    });
  });
});
