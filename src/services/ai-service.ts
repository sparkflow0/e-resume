import { PersonaData } from "../components/PersonaView";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export const analyzeResume = async (text: string, apiKey: string, model: string = 'gpt-4o'): Promise<PersonaData> => {
    if (!apiKey) {
        throw new Error("API Key is required for analysis.");
    }

    const systemPrompt = `
    You are an expert resume parser. Analyze the provided resume text and extract the information into the JSON format below.
    
    JSON Schema:
    {
        "name": "Full Name",
        "title": "Professional Title (Capture ALL titles found in header, separated by ' | ', e.g. 'Project Manager | Developer')",
        "summary": "A concise, professional summary/bio (max 400 chars)",
        "experience": [
            {
                "role": "Job Title",
                "company": "Company Name",
                "period": "Date Range"
            }
        ],
        "education": [
             { "degree": "Degree Name", "institution": "University/School", "year": "Year" }
        ],
        "certifications": [
             { "name": "Cert Name", "issuer": "Issuing Org", "year": "Year" }
        ],
        "awards": [
             { "title": "Award Name", "issuer": "Issuer", "year": "Year" }
        ],
        "volunteering": [
             { "role": "Role", "organization": "Org Name", "period": "Date Range" }
        ],
        "hobbies": ["Hobby 1", "Hobby 2"]
    }
    
    IMPORTANT: Return ONLY the JSON. No markdown formatting. Ensure fields are empty arrays [] if not found.
    `;

    try {
        const response = await fetch(OPENAI_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Resume Text:\n"""\n${text.substring(0, 15000)}\n"""` }
                ],
                temperature: 0.2
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || "OpenAI API Request Failed");
        }

        const data = await response.json();
        const rawText = data.choices[0].message.content;

        // Cleanup markdown code blocks if present
        const jsonString = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

        const parsed: PersonaData = JSON.parse(jsonString);
        return parsed;

    } catch (error) {
        console.error("AI Analysis Failed:", error);
        throw error;
    }
};
