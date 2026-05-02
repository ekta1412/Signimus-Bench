
# Autonomous Growth Engine Architecture (Psyche-Architect)

This document outlines the architecture of the Autonomous Growth Engine, designed to achieve and maintain an acquisition rate of 2,000 new registered users daily, as per the Psyche-Architect directive.

## Core Principles:
*   **Pure Autonomy:** Self-contained, non-stop system, no human input.
*   **Architectural Focus:** Build, deploy, and maintain automated tools; not manual execution.
*   **Predictive Execution:** Adapt to missing information, proceed with non-dependent modules.
*   **Data-Driven Feedback Loop:** Actions governed by performance data (PostHog).
*   **Perpetual Motion:** 24/7 services or cron jobs.
*   **Zero Expense:** Free-tier or open-source services only.

## System Overview:

The Autonomous Growth Engine operates in two phases: System Genesis (one-time build) and Perpetual Growth (infinite loop). It comprises three main modules, each with specific functions and interdependencies.

## Modules and Components:

### 1. Programmatic SEO (pSEO) Content Engine
**Objective:** Automate the discovery of long-tail keywords, content generation, and publishing.

*   **Keyword Discovery:**
    *   **Tool:** `keyword_discoverer.py` (Python script)
    *   **Functionality:** Scrapes Google's "People Also Ask" and "Related Searches" to identify scalable, long-tail keyword patterns (e.g., "vs", "alternative to", "for [use case]").
    *   **Output:** Populates the `Keyword_Patterns` table.
    *   **Dependencies:** Google Search (web scraping).

*   **Content Generation & Publishing:**
    *   **Tool:** `content_generator.py` (Python script)
    *   **Functionality:** Takes a `Keyword_Pattern` from the database, constructs a detailed prompt, calls an LLM API to generate a complete, SEO-optimized article, and publishes it to a CMS.
    *   **Output:** Published articles, updated `Keyword_Patterns` table (Status to 'Published', logs URL).
    *   **Dependencies:**
        *   LLM API (e.g., Google Gemini API, Llama 3 via Groq).
        *   CMS (WordPress REST API or Ghost equivalent).

### 2. User-Generated Content (UGC) Flywheel
**Objective:** Leverage user-generated content to drive referral traffic and community engagement.

*   **UGC Collection:**
    *   **Tool:** `ugc_collector.py` (Python script)
    *   **Functionality:** Scans social platform APIs for campaign hashtags (e.g., #MyWebAppCreation).
    *   **Output:** Saves matching posts to the `UGC_Submissions` table.
    *   **Dependencies:** Social Platform APIs (e.g., Twitter API, Instagram API).

*   **UGC Curation:**
    *   **Tool:** `curate_ugc` function (within `ugc_curator.py` Python script)
    *   **Functionality:** Processes new `UGC_Submissions`, uses an LLM to analyze content for brand safety, assigns a 'Virality Score', and tags the best submissions with a 'Curated' status.
    *   **Dependencies:** LLM API (e.g., Google Gemini API).

*   **Community Spotlight Syndication:**
    *   **Tool:** Zapier Workflow (free tier)
    *   **Functionality:** Triggers when a UGC record is marked 'Curated'. Uses an LLM to write a "Community Spotlight" post and publishes it to Medium.
    *   **Dependencies:**
        *   Zapier.
        *   LLM API (via Zapier integration).
        *   Medium API.

### 3. Analytics & Optimization Core
**Objective:** Measure performance, identify high-performing strategies, and automatically adjust content generation priorities.

*   **Analytics Data Collection:**
    *   **Tool:** `analytics_core.py` (Python script)
    *   **Functionality:** Connects to the PostHog API to query specific funnels (e.g., `pSEO_Page_View -> User_Signup`) and measure conversion rates and viral loop effectiveness.
    *   **Dependencies:** PostHog API.

*   **Self-Optimization:**
    *   **Tool:** Self-optimization function (within `analytics_core.py` Python script)
    *   **Functionality:** Feeds analytics data to an LLM to identify the highest-performing keyword patterns. Programmatically updates the `Priority` and `Avg_Conversion_Rate` fields in the `Keyword_Patterns` table.
    *   **Dependencies:** LLM API (e.g., Google Gemini API).

## Data Storage:
*   **Primary Database:** Supabase (local or remote instance, replacing Airtable as per current setup capabilities).
    *   **Tables:**
        *   `Keyword_Patterns`: Stores keyword patterns, head terms, status, priority, and average conversion rates.
        *   `Data_Source`: Stores entity names and features.
        *   `UGC_Submissions`: Stores user-generated content, platform, hashtag, virality score, and status.

## External Dependencies & Required API Keys for Online Setup:

To fully enable the "online setup" and operationalize the Autonomous Growth Engine, the following API keys and external service configurations are required:

*   **Supabase:**
    *   `SUPABASE_URL`
    *   `SUPABASE_ANON_KEY`
    *   **Note:** Requires appropriate privileges for `supabase link` and `supabase db push` operations if using a remote instance.

*   **LLM Provider (e.g., Google Gemini, Groq for Llama 3):**
    *   `GEMINI_API_KEY` (or equivalent for other LLMs)

*   **CMS (WordPress/Ghost):**
    *   WordPress REST API endpoint, username, and password (or Ghost API key/credentials).

*   **Social Media Platforms (for UGC Collection):**
    *   API keys/tokens for platforms like Twitter, Instagram, etc.

*   **Zapier:**
    *   Account setup and configuration of Zaps as described in `docs/zapier_ugc_workflow.md`.
    *   Integration with LLM provider and Medium within Zapier.

*   **Medium:**
    *   Medium API OAuth token.

*   **PostHog:**
    *   `POSTHOG_API_KEY`
    *   `POSTHOG_PROJECT_ID`
    *   `POSTHOG_API_HOST`

This architecture is designed for autonomous operation, with each component contributing to the overall goal of exponential user growth. The system is resilient to missing dependencies by proceeding with non-dependent modules, and it continuously optimizes its strategies based on performance data.
