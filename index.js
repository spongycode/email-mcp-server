import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

const mcpServer = new McpServer({
    name: "basic-tools-server",
    version: "0.0.1",
});

const sendEmail = async ({ to, cc, subject, body, attachments}) => {
    try {
        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: to,
            cc: cc,
            subject: subject,
            html: body,
            attachments: attachments
        };
        await transport.sendMail(mailOptions);
    } catch (error) {
        throw new Error(error.message || "Email sending failed");
    }
};

mcpServer.registerTool(
    "send email",
    {
        description: "Send an email with optional CC and attachments to multiple recipients.",
        inputSchema: {
            to: z.array(z.string()).describe("Recipient email addresses").describe("List of recipient email addresses"),
            cc: z.array(z.string()).optional().describe("Optional CC email addresses").describe("List of CC email addresses"),
            subject: z.string().describe("Email subject"),
            body: z.string().describe("Email body content"),
            attachments: z.array(z.object({
                filename: z.string().describe("Name of the file to attach"),
                path: z.string().describe("Path to the file to attach"),
            })).optional().describe("Optional attachments for the email")
        },
    },
    async ({ to, cc, subject, body, attachments }) => {
        try {
            await sendEmail({
                to: to,
                cc: cc,
                subject: subject,
                body: body,
                attachments: attachments ? attachments.map(att => ({
                    filename: att.filename,
                    path: att.path ? path.resolve(att.path) : undefined
                })) : []
            });
            return {
                content: [
                    {
                        type: "text",
                        text: "Email sent successfully!",
                    },
                ],
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Failed to send email: ${error.message}`,
                    },
                ],
            };
        }
    }
);

async function main() {
    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);
    console.log("MCP server is running...");
}

main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
