import {forwardOrders} from '@/lib/order-backend';
export const runtime='nodejs';
export async function GET(request:Request){return forwardOrders(request,'/api/statistics'+new URL(request.url).search);}
