import {forwardOrders} from "@/lib/order-backend";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export const maxDuration=30;
export async function GET(request:Request){return forwardOrders(request,"/api/orders");}
export async function POST(request:Request){return forwardOrders(request,"/api/orders");}
export async function DELETE(request:Request){return forwardOrders(request,"/api/orders");}
