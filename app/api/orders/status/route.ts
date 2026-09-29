import {forwardOrders} from "@/lib/order-backend";
export const runtime="nodejs";
export async function POST(request:Request){return forwardOrders(request,"/api/orders/status");}
