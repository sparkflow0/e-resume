const i="https://api.openai.com/v1/chat/completions",p=async(t,r,a="gpt-4o")=>{if(!r)throw new Error("API Key is required for analysis.");const o=`
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
    `;try{const e=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify({model:a,messages:[{role:"system",content:o},{role:"user",content:`Resume Text:
"""
${t.substring(0,15e3)}
"""`}],temperature:.2})});if(!e.ok){const n=await e.json();throw new Error(n.error?.message||"OpenAI API Request Failed")}const s=(await e.json()).choices[0].message.content.replace(/```json/g,"").replace(/```/g,"").trim();return JSON.parse(s)}catch(e){throw console.error("AI Analysis Failed:",e),e}};export{p as analyzeResume};
