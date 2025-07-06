## Email MCP Server – Lightweight Multi-Recipient Mail Sender
<p align="center"> 
  <img src="https://github.com/user-attachments/assets/5c1db1d6-bf89-43d5-ba8a-4b517f1e1068" width="90%" title="demo using google gemini cli"/>
</p>

## Usage:
Add the `.env` file with the correct credentials:
```.env
GMAIL_USER=yourmail@gmail.com
GMAIL_PASS=yourpasscode
```

### Usage with [Google Gemini CLI](https://github.com/google-gemini/gemini-cli):

Add this to your `.gemini/settings.json` file:
```json
{
  "theme": "Default Light",
  "selectedAuthType": "oauth-personal",
  "mcpServers": {
    "email-node-server": {
      "command": "node",
      "args": ["index.js", "--verbose"],
      "cwd": "<YOUR_PATH_TO_DIRECTORY>/email-mcp-server"
    }
  }
}
```
