declare namespace Cloudflare {
  interface Env {
    WHATSAPP_ACCESS_TOKEN?: string;
    WHATSAPP_PHONE_NUMBER_ID?: string;
    WHATSAPP_RECIPIENT_NUMBER?: string;
    WHATSAPP_TEMPLATE_NAME?: string;
    WHATSAPP_TEMPLATE_LANGUAGE?: string;
    WHATSAPP_GRAPH_API_VERSION?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
