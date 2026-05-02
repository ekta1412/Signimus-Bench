import { Client } from 'pg';
// google_web_search will be available in the execution environment

async function runKeywordDiscovery() {
    const client = new Client({
        user: 'supabase_admin',
        host: 'localhost', // Reverted to localhost as 127.0.0.1 didn't help and port is blocked anyway
        database: 'postgres',
        password: 'postgres',
        port: 54322, // Connecting to OrbStack's PostgreSQL
    });

    try {
        await client.connect(); // This will likely fail due to port conflict
        console.log('Connected to PostgreSQL database.');

        // Example search query - this will be refined later
        const searchQuery = "user acquisition strategies long tail keywords";
        console.log(`Searching for: "${searchQuery}"`);

        // Assuming google_web_search is globally available in the execution environment
        const searchResults = await google_web_search({ query: searchQuery });
        console.log('Search results received.');

        const keywordsToInsert: string[] = [];

        // Simple extraction: look for common phrases or related terms in snippets
        if (searchResults && searchResults.output && searchResults.output.web_search_results) {
            for (const result of searchResults.output.web_search_results) {
                if (result.snippet) {
                    // A very basic keyword extraction logic
                    const words = result.snippet.toLowerCase().split(/\W+/);
                    const phrases = new Set<string>();
                    for (let i = 0; i < words.length - 2; i++) {
                        if (words[i] && words[i+1] && words[i+2]) {
                            phrases.add(`${words[i]} ${words[i+1]} ${words[i+2]}`);
                        }
                    }
                    keywordsToInsert.push(...Array.from(phrases));
                }
            }
        }

        // Filter out empty or very short phrases and duplicates
        const uniqueKeywords = Array.from(new Set(keywordsToInsert.filter(k => k.length > 5)));

        if (uniqueKeywords.length > 0) {
            console.log(`Found ${uniqueKeywords.length} unique keywords. Inserting into Keyword_Patterns table.`);
            for (const keyword of uniqueKeywords) {
                // Check if keyword already exists to prevent duplicates on re-runs
                const checkRes = await client.query('SELECT id FROM Keyword_Patterns WHERE pattern = $1', [keyword]);
                if (checkRes.rows.length === 0) {
                    await client.query('INSERT INTO Keyword_Patterns(pattern, status) VALUES($1, $2)', [keyword, 'Pending']);
                    console.log(`Inserted: ${keyword}`);
                } else {
                    console.log(`Skipped (exists): ${keyword}`);
                }
            }
            console.log('Keyword insertion complete.');
        } else {
            console.log('No new keywords found to insert.');
        }

    } catch (error) {
        console.error('Error during keyword discovery:', error);
    } finally {
        await client.end();
        console.log('Disconnected from PostgreSQL database.');
    }
}

runKeywordDiscovery();
