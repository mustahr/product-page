import {forwardOrders} from "@/lib/order-backend";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request){return forwardOrders(request,"/api/profit/expenses"+new URL(request.url).search);}
export async function POST(request:Request){return forwardOrders(request,"/api/profit/expenses");}
export async function DELETE(request:Request){return forwardOrders(request,"/api/profit/expenses");}
