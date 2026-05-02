import { Client } from 'pg';

async function collectUGC() {
    const client = new Client({
        user: 'supabase_admin',
        host: 'localhost',
        database: 'postgres',
        password: 'postgres',
        port: 54322, // Connecting to OrbStack's PostgreSQL
    });

    const CAMPAIGN_HASHTAG = '#PsycheArchitectGrowth'; // Example hashtag

    try {
        await client.connect(); // This will likely fail due to port conflict
        console.log('Connected to PostgreSQL database.');

        console.log(`Scanning social platforms for hashtag: ${CAMPAIGN_HASHTAG} (mocked)...`);

        // Mock social media posts
        const mockPosts = [
            {
                platform: 'Twitter',
                post_url: 'http://mocktwitter.com/post1',
                content: `Loving the new growth strategies! ${CAMPAIGN_HASHTAG}`,
                author: 'UserA',
            },
            {
                platform: 'Instagram',
                post_url: 'http://mockinstagram.com/post2',
                content: `Amazing results with Psyche-Architect! #GrowthHack ${CAMPAIGN_HASHTAG}`,
                author: 'UserB',
            },
            {
                platform: 'Facebook',
                post_url: 'http://mockfacebook.com/post3',
                content: `My user acquisition rate is soaring! ${CAMPAIGN_HASHTAG}`,
                author: 'UserC',
            },
        ];

        for (const post of mockPosts) {
            console.log(`Found post from ${post.platform} by ${post.author}`);
            // Insert into UGC_Submissions table
            await client.query(
                'INSERT INTO UGC_Submissions(platform, post_url, content, author, status) VALUES($1, $2, $3, $4, $5)',
                [post.platform, post.post_url, post.content, post.author, 'New']
            );
            console.log(`Inserted UGC post: ${post.post_url}`);
        }

        console.log('UGC collection complete (mocked).');

    } catch (error) {
        console.error('Error during UGC collection:', error);
    } finally {
        await client.end();
        console.log('Disconnected from PostgreSQL database.');
    }
}

collectUGC();
