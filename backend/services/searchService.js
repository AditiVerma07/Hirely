const TAVILY_URL = 'https://api.tavily.com/search';

/**
 * Fetches real top search results for a topic. Returns [{ title, url }].
 * Unlike asking an LLM to "suggest" links, this hits an actual search engine,
 * so every URL returned genuinely exists and resolves.
 */
async function fetchTopicResources(topicTitle, maxResults = 3) {
  const response = await fetch(TAVILY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query: `${topicTitle} tutorial interview preparation`,
      max_results: maxResults,
      search_depth: 'basic',
    }),
  });

  if (!response.ok) {
    throw new Error(`Tavily search failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  return (data.results || []).map((result) => ({
    title: result.title,
    url: result.url,
  }));
}

module.exports = { fetchTopicResources };