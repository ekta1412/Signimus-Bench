#!/bin/zsh
cd "/Users/test/Startups/bench/" || exit
source ~/.zshrc

# Load Doppler if project exists
DOPPLER_PROJECT="bench"
if doppler projects list 2>/dev/null | grep -iq "$DOPPLER_PROJECT"; then
    doppler run --project $DOPPLER_PROJECT -- echo '✅ Credentials loaded from Doppler'
else
    echo "⚠ Doppler project '$DOPPLER_PROJECT' not found, skipping..."
fi

# Run Aider with fallbacks
aider --message "PASTE YOUR FULL SYSTEM PROMPT HERE" --auto-commits --dirty-commits --weak-model gemini/gemini-1.5-flash --editor-model gemini/gemini-1.5-flash --show-model-warnings --stream --yes-always --pretty || aider --message "PASTE YOUR FULL SYSTEM PROMPT HERE" --model ollama/codellama:7b-instruct --stream --yes-always || aider --message "PASTE YOUR FULL SYSTEM PROMPT HERE" --model mistral/mistral-7b-instruct --stream --yes-always
