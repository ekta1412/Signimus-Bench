
# Zapier Workflow for Curated UGC Community Spotlight

This document outlines the Zapier workflow to automate the creation and publishing of "Community Spotlight" posts on Medium, triggered by curated User-Generated Content (UGC) records.

**Trigger:**
*   **App:** Supabase (or Airtable, if used)
*   **Event:** New Record in View (or New Record)
*   **Table:** `ugc_submissions`
*   **Filter:** `status` is `Curated`

**Action 1: Generate Community Spotlight Post with LLM**
*   **App:** OpenAI (or other LLM provider like Google Gemini via a custom integration)
*   **Event:** Send Prompt
*   **Prompt:** Construct a prompt using data from the triggered UGC record. For example:
    ```
    Write a compelling "Community Spotlight" blog post (around 300-500 words) based on the following user-generated content. Highlight the user's creativity and how they used our web application. Make it inspiring and encourage others to share their creations. Include a call to action to visit our app. The post content is: "{{post_content}}" from {{platform}}.
    ```
*   **Output:** Store the generated article content.

**Action 2: Publish to Medium**
*   **App:** Medium
*   **Event:** Create Story
*   **Title:** Use a dynamic title, e.g., "Community Spotlight: Featuring a Creation from {{platform}}!"
*   **Content:** Use the output from Action 1 (the generated article content).
*   **Tags:** Add relevant tags, e.g., `Community Spotlight`, `User Generated Content`, `Web App`, `{{hashtag}}`.
*   **Status:** `Public`
*   **License:** `All Rights Reserved` (or as appropriate)

**Action 3 (Optional): Update Supabase/Airtable Record**
*   **App:** Supabase (or Airtable)
*   **Event:** Update Record
*   **Table:** `ugc_submissions`
*   **Record ID:** Use the ID from the triggered UGC record.
*   **Fields to Update:**
    *   `medium_url`: The URL of the published Medium post (from Action 2 output).
    *   `spotlight_published_at`: Current timestamp.

**Required Credentials/Setup:**
*   Supabase/Airtable API Key (for Trigger and Optional Action 3)
*   LLM Provider API Key (e.g., OpenAI API Key, or Google Gemini API Key for custom integration)
*   Medium OAuth Token (configured in Zapier)

**Note:** This workflow assumes a free-tier Zapier account can handle the required steps and frequency. Monitor Zapier task usage to ensure compliance with free-tier limits.
