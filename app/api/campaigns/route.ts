import {forwardOrders} from '@/lib/order-backend';
export const runtime='nodejs';
export async function GET(request:Request){return forwardOrders(request,'/api/campaigns'+new URL(request.url).search);}
