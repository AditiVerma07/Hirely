const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Sends a job description to the LLM and asks for a short, prioritized
 * list of prep topics. Returns a plain array of strings — parsing/validating
 * the model's output happens here so callers never touch raw LLM text.
 */
async function extractFocusTopics(jobDescription) {
  const prompt = `You are helping a candidate prepare for a job interview.
Read the job description below and list 5-8 specific technical topics they
should study, ordered by priority. Return ONLY a JSON array of strings,
nothing else — no markdown, no preamble.

Job description:
"""
${jobDescription}
"""`;

  const completion = await groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2, // low temperature — this is extraction, not creative writing
  });

  const raw = completion.choices[0]?.message?.content?.trim() || '[]';

  try {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const topics = JSON.parse(cleaned);

    if (!Array.isArray(topics)) throw new Error('Response was not an array');
    return topics.filter((t) => typeof t === 'string' && t.trim().length > 0);
  } catch (err) {
    // If the model returns malformed JSON, fail loudly rather than saving garbage topics
    throw new Error(`Failed to parse LLM response into topics: ${err.message}`);
  }
}

module.exports = { extractFocusTopics, extractApplicationDetails };

/**
 * Extracts company, role, stipend, and a cleaned job description from ANY
 * pasted text — a LinkedIn posting, a confirmation email, an Indeed listing,
 * whatever the user has in front of them. Deliberately source-agnostic:
 * rather than building separate parsers per platform, one prompt handles
 * all of them since the underlying task (extract structured fields from
 * unstructured text) is the same regardless of where the text came from.
 */
async function extractApplicationDetails(rawText) {
  const prompt = `You are helping someone log a job application. Below is text
they pasted — it could be a LinkedIn job posting, a confirmation email, a job
board listing, or anything similar. Extract what you can find.

Return ONLY a JSON object with these exact keys, nothing else — no markdown,
no preamble:
{
  "company": "company name, or empty string if not found",
  "role": "job title, or empty string if not found",
  "stipend": "salary/stipend as written, or empty string if not found",
  "jobDescription": "the core job description/responsibilities text, cleaned up, or empty string if not found"
}

Text:
"""
${rawText}
"""`;

  const completion = await groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
  });

  const raw = completion.choices[0]?.message?.content?.trim() || '{}';

  try {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      company: parsed.company || '',
      role: parsed.role || '',
      stipend: parsed.stipend || '',
      jobDescription: parsed.jobDescription || '',
    };
  } catch (err) {
    throw new Error(`Failed to parse LLM response into application details: ${err.message}`);
  }
}