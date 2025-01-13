import { NextResponse } from 'next/server';
import { nimbuspost } from '@/lib/nimbuspost';
import { auth } from '@/lib/auth';

export const POST = auth(async (request: any) => {
  if (!request.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      },
    );
  }
  const { awb } = await request.json();

  try {
    const response = await nimbuspost.get(`/shipments/track/${awb}/`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to track shipment' },
      { status: error.response?.status || 500 },
    );
  }
});

// {
//   "status": true,
//   "data": {
//     "id": "2482000",
//     "order_id": "4340000",
//     "order_number": "#JS5897",
//     "created": "2021-03-01",
//     "awb_number": "59650109492",
//     "rto_awb": "75312963180",
//     "courier_id": "24",
//     "warehouse_id": "21135",
//     "rto_warehouse_id": "21135",
//     "status": "rto",
//     "rto_status": "delivered",
//     "shipment_info": "DEL / VED",
//     "history": [
//       {
//         "status_code": "IT",
//         "location": "BAREJA EPU (NCX)",
//         "event_time": "2021-03-02 18:19",
//         "message": "SHIPMENT ARRIVED"
//       },
//       {
//         "status_code": "IT",
//         "location": "BAREJA EPU (NCX)",
//         "event_time": "2021-03-02 22:07",
//         "message": "SHIPMENT FURTHER CONNECTED"
//       },
//       {
//         "status_code": "IT",
//         "location": "AHMEDABAD HUB (AUB)",
//         "event_time": "2021-03-02 23:50",
//         "message": "SHIPMENT ARRIVED AT HUB"
//       },
//       {
//         "status_code": "IT",
//         "location": "AHMEDABAD HUB (AUB)",
//         "event_time": "2021-03-03 03:20",
//         "message": "SHIPMENT FURTHER CONNECTED"
//       },
//       {
//         "status_code": "IT",
//         "location": "DELHI HUB (DUB)",
//         "event_time": "2021-03-03 07:27",
//         "message": "SHIPMENT ARRIVED AT HUB"
//       },
//       {
//         "status_code": "IT",
//         "location": "GOPINATH BAZAR HUB (GNH)",
//         "event_time": "2021-03-03 13:14",
//         "message": "SHIPMENT FURTHER CONNECTED"
//       },
//       {
//         "status_code": "IT",
//         "location": "PASCHIM VIHAR ETAIL (VED)",
//         "event_time": "2021-03-03 14:50",
//         "message": "SHIPMENT ARRIVED"
//       },
//       {
//         "status_code": "OFD",
//         "location": "PASCHIM VIHAR ETAIL (VED)",
//         "event_time": "2021-03-03 14:51",
//         "message": "SHIPMENT OUT FOR DELIVERY"
//       },
//       {
//         "status_code": "EX",
//         "location": "PASCHIM VIHAR ETAIL (VED)",
//         "event_time": "2021-03-03 16:03",
//         "message": "REFUSAL CONFIRMATION CODE VERIFIED"
//       },
//       {
//         "status_code": "EX",
//         "location": "PASCHIM VIHAR ETAIL (VED)",
//         "event_time": "2021-03-03 16:04",
//         "message": "CONSIGNEE REFUSED TO ACCEPT"
//       },
//       {
//         "status_code": "IT",
//         "location": "PASCHIM VIHAR ETAIL (VED)",
//         "event_time": "2021-03-04 09:55",
//         "message": "UNDELIVERED SHIPMENT HELD AT LOCATION"
//       },
//       {
//         "status_code": "IT",
//         "location": "PASCHIM VIHAR ETAIL (VED)",
//         "event_time": "2021-03-05 10:16",
//         "message": "UNDELIVERED SHIPMENT HELD AT LOCATION"
//       },
//       {
//         "status_code": "RT-IT",
//         "location": "PASCHIM VIHAR ETAIL (VED)",
//         "event_time": "2021-03-05 17:18",
//         "message": "RETURNED TO ORIGIN AT SHIPPER'S REQUEST"
//       },
//       {
//         "status_code": "RT-IT",
//         "location": "PASCHIM VIHAR ETAIL (VED)",
//         "event_time": "2021-03-05 17:18",
//         "message": "SHIPMENT ARRIVED"
//       },
//       {
//         "status_code": "RT-IT",
//         "location": "PASCHIM VIHAR ETAIL (VED)",
//         "event_time": "2021-03-05 19:52",
//         "message": "SHIPMENT FURTHER CONNECTED"
//       },
//       {
//         "status_code": "RT-IT",
//         "location": "DELHI HUB (DUB)",
//         "event_time": "2021-03-05 23:57",
//         "message": "SHIPMENT ARRIVED AT HUB"
//       },
//       {
//         "status_code": "RT-IT",
//         "location": "DELHI HUB (DUB)",
//         "event_time": "2021-03-06 02:05",
//         "message": "SHIPMENT FURTHER CONNECTED"
//       },
//       {
//         "status_code": "RT-IT",
//         "location": "DEL ETAIL HUB (DEH)",
//         "event_time": "2021-03-06 02:54",
//         "message": "SHIPMENT IN TRANSIT"
//       },
//       {
//         "status_code": "RT-IT",
//         "location": "DEL ETAIL HUB (DEH)",
//         "event_time": "2021-03-06 03:35",
//         "message": "SHIPMENT ARRIVED"
//       },
//       {
//         "status_code": "RT-IT",
//         "location": "DEL ETAIL HUB (DEH)",
//         "event_time": "2021-03-06 05:10",
//         "message": "SHIPMENT FURTHER CONNECTED"
//       },
//       {
//         "status_code": "RT-IT",
//         "location": "COD PROCESSING CENTRE II (ITG)",
//         "event_time": "2021-03-06 07:05",
//         "message": "SHIPMENT IN TRANSIT"
//       },
//       {
//         "status_code": "RT-IT",
//         "location": "COD PROCESSING CENTRE II (ITG)",
//         "event_time": "2021-03-06 07:06",
//         "message": "SHIPMENT ARRIVED"
//       },
//       {
//         "status_code": "RT-IT",
//         "location": "COD PROCESSING CENTRE II (ITG)",
//         "event_time": "2021-03-07 05:00",
//         "message": "SHIPMENT FURTHER CONNECTED"
//       },
//       {
//         "status_code": "RT-IT",
//         "location": "ASLALI WAREHOUSE (ASL)",
//         "event_time": "2021-03-08 00:12",
//         "message": "SHIPMENT ARRIVED AT HUB"
//       },
//       {
//         "status_code": "RT-IT",
//         "location": "ASLALI WAREHOUSE (ASL)",
//         "event_time": "2021-03-08 04:46",
//         "message": "SHIPMENT FURTHER CONNECTED"
//       },
//       {
//         "status_code": "RT-IT",
//         "location": "AHMEDABAD (PMX)",
//         "event_time": "2021-03-08 06:24",
//         "message": "SHIPMENT ARRIVED"
//       },
//       {
//         "status_code": "RT-IT",
//         "location": "AHMEDABAD (PMX)",
//         "event_time": "2021-03-08 07:21",
//         "message": "SHIPMENT OUT FOR DELIVERY"
//       },
//       {
//         "status_code": "RT-DL",
//         "location": "AHMEDABAD (PMX)",
//         "event_time": "2021-03-08 11:24",
//         "message": "SHIPMENT DELIVERED"
//       }
//     ]
//   }
// }
