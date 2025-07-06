#!/bin/bash
# This script builds and sends a Discord notification.
# It exits immediately if a command fails.
set -euo pipefail

# Construct the JSON payload using jq. This is safer than building strings.
# It conditionally adds the 'image' and 'fields' objects only if the
# corresponding inputs are provided.
JSON_PAYLOAD=$(jq -n \
  --arg title "$INPUT_TITLE" \
  --arg description "$INPUT_DESCRIPTION" \
  --arg url "$INPUT_URL" \
  --argjson color "$INPUT_COLOR" \
  --arg author_name "$INPUT_AUTHOR_NAME" \
  --arg author_url "$INPUT_AUTHOR_URL" \
  --arg author_icon_url "$INPUT_AUTHOR_ICON_URL" \
  --arg button_label "$INPUT_BUTTON_LABEL" \
  --arg image_url "$INPUT_IMAGE_URL" \
  --arg branch_info "$INPUT_BRANCH_INFO" \
  '
    {
      "embeds": [
        {
          "title": $title,
          "description": $description,
          "url": $url,
          "color": $color,
          "author": { "name": $author_name, "url": $author_url, "icon_url": $author_icon_url }
        }
      ],
      "components": [
        {
          "type": 1,
          "components": [
            { "type": 2, "label": $button_label, "style": 5, "url": $url }
          ]
        }
      ]
    }
    | if $image_url != null and $image_url != "" then .embeds[0].image = {"url": $image_url} else . end
    | if $branch_info != null and $branch_info != "" then .embeds[0].fields = [{"name": "Branch", "value": $branch_info, "inline": false}] else . end
  ')

# Send the payload to the Discord webhook URL.
curl -X POST -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD" \
  "$INPUT_WEBHOOK_URL?with_components=true" 