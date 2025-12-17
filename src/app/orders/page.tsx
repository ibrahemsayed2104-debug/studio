import { MOCK_ORDERS } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function OrdersPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
          طلباتي
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          عرض محفوظات طلباتك وتتبع حالة طلباتك الحالية.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>محفوظات الطلبات</CardTitle>
          <CardDescription>قائمة بجميع طلباتك السابقة.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الطلب</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-left">الإجمالي</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_ORDERS.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}
                      className={
                        order.status === 'Delivered' ? 'bg-green-600/80 text-white' : 
                        order.status === 'Shipped' ? 'bg-blue-500/80 text-white' : ''
                      }
                    >
                      {order.status === 'Delivered' ? 'تم التوصيل' : order.status === 'Shipped' ? 'تم الشحن' : 'قيد المعالجة'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">{order.total} ر.س</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
